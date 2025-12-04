import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const rawClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(rawClient);

const allowedOrigin = process.env.ALLOWED_ORIGIN?.slice(1, -1);
const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
    const claims = event.requestContext?.authorizer?.claims;

    if (!claims?.sub) {
        return {
            statusCode: 401,
            headers: corsHeaders(event),
            body: JSON.stringify({
                ok: false,
                error: "Missing 'sub' in Cognito claims",
            }),
        };
    }

    const userId = claims.sub;
    const email = claims.email ?? claims["email"];

    try {
        const getRes = await ddb.send(
            new GetCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
            })
        );

        let user = getRes.Item;

        if (!user) {
            const now = new Date().toISOString();
            user = {
                id: userId,
                email: email ?? null,
                createdAt: now,
                updatedAt: now,
                plan: "free",
                onboarded: false,
            };

            await ddb.send(
                new PutCommand({
                    TableName: USERS_TABLE,
                    Item: user,
                    ConditionExpression: "attribute_not_exists(id)",
                })
            );
        } else {
            const now = new Date().toISOString();
            const needsUpdate = email && user.email !== email;

            if (needsUpdate) {
                user = { ...user, email, updatedAt: now };
                await ddb.send(
                    new PutCommand({
                        TableName: USERS_TABLE,
                        Item: user,
                    })
                );
            }
        }

        return {
            statusCode: 200,
            headers: corsHeaders(event),
            body: JSON.stringify({
                ok: true,
                user,
                raw: claims,
            }),
        };
    } catch (err) {
        console.error("Error in /me:", err);
        return {
            statusCode: 500,
            headers: corsHeaders(event),
            body: JSON.stringify({
                ok: false,
                error: "Internal server error",
            }),
        };
    }
};

function corsHeaders(event) {
    const origin = event.headers?.origin || event.headers?.Origin || null;

    const headers = {
        "Content-Type": "application/json",
    };

    if (origin && allowedOrigin === origin) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Vary"] = "Origin";
    }

    return headers;
}
