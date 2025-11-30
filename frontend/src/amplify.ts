// src/amplify.ts
import { Amplify } from "aws-amplify";
import {
    COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID,
    COGNITO_DOMAIN,
    COGNITO_REDIRECT_URI,
    COGNITO_LOGOUT_URI,
} from "./config";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: COGNITO_USER_POOL_ID,
            userPoolClientId: COGNITO_CLIENT_ID,
            loginWith: {
                oauth: {
                    domain: COGNITO_DOMAIN, // e.g. "your-prefix.auth.us-west-2.amazoncognito.com"
                    scopes: ["openid", "email", "profile"],
                    redirectSignIn: [COGNITO_REDIRECT_URI],
                    redirectSignOut: [COGNITO_LOGOUT_URI],
                    responseType: "code", // Authorization Code + PKCE
                },
            },
        },
    },
});
    