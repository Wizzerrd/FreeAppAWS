export const handler = async (event) => {
    const claims = event.requestContext.authorizer?.claims;

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
        },
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
