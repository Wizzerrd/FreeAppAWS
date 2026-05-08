import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export interface FreeAppAuthStackProps extends cdk.StackProps {
    /** OAuth callback and sign-out URL (e.g. client stack `publicAppUrl`: CloudFront HTTPS origin). */
    appUrl: string;
}

export class FreeAppAuthStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props: FreeAppAuthStackProps) {
        super(scope, id, props);

        this.userPool = new cognito.UserPool(this, 'UserPool', {
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            autoVerify: { email: true },
        });

        this.userPoolClient = this.userPool.addClient('UserPoolClient', {
            generateSecret: false,
            authFlows: {
                userSrp: true,
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                },
                scopes: [
                    cognito.OAuthScope.EMAIL,
                    cognito.OAuthScope.OPENID,
                    cognito.OAuthScope.PROFILE,
                ],
                callbackUrls: ['localhost:5173/callback', `${props.appUrl}/callback`],
                logoutUrls: ['localhost:5173', props.appUrl],
            },
        });

        const issuer = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPool.userPoolId}`;

        new cdk.CfnOutput(this, 'UserPoolId', {
            value: this.userPool.userPoolId,
            exportName: 'FreeAppUserPoolId',
        } as cdk.CfnOutputProps);

        new cdk.CfnOutput(this, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId,
            exportName: 'FreeAppUserPoolClientId',
        } as cdk.CfnOutputProps);

        new cdk.CfnOutput(this, 'UserPoolIssuer', {
            value: issuer,
            exportName: 'FreeAppUserPoolIssuer',
        } as cdk.CfnOutputProps);
    }
}
