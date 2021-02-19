import { OktaAuth, AuthState } from '@okta/okta-auth-js';

class OktaAuthService {
  authClient;

  constructor() {
    this.authClient = new OktaAuth({
      issuer: `${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`,
      clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
      redirectUri: `${process.env.REACT_APP_REDIRECT_URI}`
    })
  }

  isAuth = async () => await this.authClient.isAuthenticated();

  login = (username: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const signIn = await this.authClient.signInWithCredentials({ username, password });
        if (signIn.status === 'SUCCESS') {
          try {
            const res = await this.authClient.token
              .getWithoutPrompt({
                responseType: ["token", "id_token"],
                scopes: ["openid", "profile", "email"],
                sessionToken: signIn.sessionToken,
                redirectUri: process.env.REACT_APP_REDIRECT_URI
              });
            const { tokens } = res;
            this.authClient.tokenManager.setTokens(tokens);
          } catch (err) {
            console.warn('Failed to get tokens: ', err)
          }
          console.log('Login success');
          resolve(true);
        }
      } catch (err) {
        console.warn('Failed to login: ', err);
        reject(err.message);
      }
    });
  }

  getAccessToken = async () => await this.authClient.tokenManager.get('accessToken');

  logout = async () => await this.authClient.signOut();

  getAuthState = async (callback: (auth: AuthState) => void) => this.authClient.authStateManager.subscribe((e: AuthState) => callback(e));

  unsubscribe = () => this.authClient.authStateManager.unsubscribe();
}

const Auth = new OktaAuthService();
export default Auth;