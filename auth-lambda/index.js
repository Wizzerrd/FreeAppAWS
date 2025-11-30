const allowedOrigin = process.env.ALLOWED_ORIGIN.slice(1, -1);

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
    if (origin && allowedOrigin === origin) {
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
