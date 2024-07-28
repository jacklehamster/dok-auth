import { AuthManager } from "./auth/auth-manager";
import { AuthProvider } from "./auth/auth-provider";
import { NewgroundsAuthenticator } from "./authenticators/newgrounds/newgrounds-authenticator";
import { SecretAuthenticator } from "./authenticators/secret/secret-authenticator";
import { Authenticator } from "./authenticators/authenticator";
import { Payload } from "./auth/Payload";
import { TokenResult } from "./auth/TokenResult";
import { DataClient } from "@dobuki/data-client";
import { Config as NewgroundsConfig } from "medal-popup";

export { AuthManager, AuthProvider, NewgroundsAuthenticator, SecretAuthenticator, Authenticator, Payload, TokenResult };

interface Props {
  secretConfig?: {
    secretKey?: string;
    secret: string;  
  };
  newgroundsConfig?: NewgroundsConfig;
}

export function createAuthManager(dataClient: DataClient, {
  secretConfig,
  newgroundsConfig,
}: Props): AuthManager {
  const provider = new AuthProvider(dataClient);
  return new AuthManager(provider, [
    ...secretConfig ? [new SecretAuthenticator({
      secretKey: secretConfig.secretKey,
      secretWord: secretConfig.secret,
    })] : [],
    ...newgroundsConfig ? [
      new NewgroundsAuthenticator(newgroundsConfig),
    ] : [],
  ]);
}
