const allowedOrigins = new Set(
    (process.env.ALLOWED_ORIGINS || "")
        .slice(1,-1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
);

export const handler = async (event) => {
    // Extract claims from API Gateway Cognito Authorizer
    const claims = event.requestContext.authorizer?.claims;

    // Determine which origin made the request
    const origin =
        event.headers?.origin ||
        event.headers?.Origin ||
        null;

    const headers = {};

    // Dynamic CORS logic based on allow-list
    if (origin && allowedOrigins.has(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Vary"] = "Origin"; // Best practice for caches
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            ok: true,
            user: {
                sub: claims?.sub,
                email: claims?.email,
            },
            raw: claims,
        }),
    };
};
