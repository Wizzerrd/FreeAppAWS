export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
export const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID
export const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
export const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
export const COGNITO_LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI
export const API_BASE = import.meta.env.VITE_API_BASE;



if (!COGNITO_CLIENT_ID || !COGNITO_DOMAIN || !COGNITO_REDIRECT_URI || !API_BASE) {
    // Just for your sanity while wiring things
    console.warn("Missing one or more required Vite env vars");
}