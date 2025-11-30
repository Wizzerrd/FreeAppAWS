// src/App.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

type MeResponse = {
  ok?: boolean;
  user?: { sub?: string; email?: string };
  raw?: unknown;
  error?: string;
};

function App() {
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  // On load, see if we're already signed in
  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser({ username: u.username });
      } catch {
        setUser(null);
      } finally {
        setCheckingUser(false);
      }
    })();
  }, []);

  async function handleLogin() {
    setError(null);
    await signInWithRedirect(); // goes to Hosted UI, then back to redirect URI
  }

  async function handleLogout() {
    setError(null);
    setMeData(null);
    setUser(null);
    await signOut({ global: true });
    // Amplify will redirect to the configured signOut URL
  }

  async function callBackend() {
    setLoadingMe(true);
    setError(null);
    setMeData(null);

    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      const idToken = session.tokens?.idToken?.toString();

      if (!accessToken) {
        throw new Error("No access token; are you logged in?");
      }

      const res = await fetch(`${API_BASE}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const json = (await res.json()) as MeResponse;
      if (!res.ok) {
        throw new Error(json.error || `Request failed with ${res.status}`);
      }

      setMeData(json);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoadingMe(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Backend Test (Amplify + Cognito)</h1>
      <p>API base: {API_BASE || "(not set)"}</p>

      {checkingUser ? (
        <p>Checking login state…</p>
      ) : user ? (
        <p>Signed in as: <strong>{user.username}</strong></p>
      ) : (
        <p>Not signed in</p>
      )}

      <div style={{ marginBottom: 16 }}>
        {!user ? (
          <button onClick={handleLogin}>Login with Cognito</button>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>

      <button
        onClick={callBackend}
        disabled={loadingMe || !API_BASE}
        style={{ marginBottom: 16 }}
      >
        {loadingMe ? "Calling…" : "Call /me"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          Error: {error}
        </p>
      )}

      {meData && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#eee",
            borderRadius: 4,
          }}
        >
          {JSON.stringify(meData, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
