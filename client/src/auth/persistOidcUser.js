import { User } from 'oidc-client-ts'
import { getUserManager } from './cognito'

/**
 * Persist password (SRP) sign-in tokens in the oidc-client-ts session store as an OIDC User.
 * @param {import('amazon-cognito-identity-js').CognitoUserSession} session
 * @returns {Promise<User>}
 */
export async function persistSessionAsOidcUser(session) {
  const userManager = getUserManager()
  if (!userManager) {
    throw new Error('Cognito is not configured.')
  }

  const idToken = session.getIdToken()
  const accessToken = session.getAccessToken()
  const refreshToken = session.getRefreshToken()
  const payload = idToken.decodePayload()

  const oidcUser = new User({
    id_token: idToken.getJwtToken(),
    access_token: accessToken.getJwtToken(),
    refresh_token: refreshToken?.getToken(),
    token_type: 'Bearer',
    scope: 'openid email profile',
    profile: {
      sub: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified,
      name: payload.name,
      preferred_username: payload['cognito:username'] ?? payload.sub,
    },
    expires_at: payload.exp,
  })

  await userManager.storeUser(oidcUser)
  return oidcUser
}
