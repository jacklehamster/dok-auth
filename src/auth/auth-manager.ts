import { Authenticator } from "@/authenticators/authenticator";
import { AuthProvider } from "./auth-provider";
import { TokenResult } from "./TokenResult";
import { Payload } from "./Payload";

export class AuthManager {
  private authenticators: Set<Authenticator> = new Set();
  constructor(private authProvider: AuthProvider, authenticators: Authenticator[]) {
    authenticators.forEach(validator => this.authenticators.add(validator));
  }

  /**
   * 
   * @param payload 
   * @returns 
   */
  async authenticatePayload(payload: Payload): Promise<TokenResult> {
    if (payload.authToken) {
      const newToken = await this.authProvider.refreshToken(payload.userId, payload.authToken);
      if (newToken) {
        return {
          authToken: newToken,
          expiration: this.authProvider.getTokenTimestamp(newToken)
        };  
      }
    }

    let authenticated = false;
    for (let auth of this.authenticators) {
      if (await auth.authenticate(payload)) {
        authenticated = true;
        break;
      }
    }
    if (authenticated) {
      const token = await this.authProvider.provideToken(payload.userId);
      if (token) {
        return {
          authToken: token,
          expiration: this.authProvider.getTokenTimestamp(token),
        }  
      }  
    }
    return {};
  }
}
