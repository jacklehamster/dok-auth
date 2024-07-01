import { Authenticator } from "@/authenticators/authenticator";
import { AuthProvider } from "./auth-provider";

interface Payload {
  type: string;
  userId: string;
  authToken?: string;
  [key: string]: any;
}

interface TokenResult {
  authToken?: string;
  expiration?: Date;
}

export class AuthManager {
  private authenticators: Record<string, Authenticator> = {};
  constructor(private authProvider: AuthProvider, authenticators: Authenticator[]) {
    authenticators.forEach(validator => this.authenticators[validator.type] = validator);
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

    if (await this.authenticators[payload.type].authenticate(payload)) {
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
