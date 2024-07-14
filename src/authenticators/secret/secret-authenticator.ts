import { Authenticator } from "../authenticator";
import jsSHA from "jssha";

interface Props {
  secretKey?: string;
  secretWord?: string;
  secretHash?: string;
}

// Define the structure of the payload object
interface Payload {
  [key: string]: string;
}

/**
 * Authenticator where we can just pass a secret word.
 * Mainly used for testing purposes.
 */
export class SecretAuthenticator implements Authenticator {
  private secretKey: string;
  private secretHash: string;
  constructor({ secretKey = "secret", secretWord, secretHash }: Props) {
    this.secretKey = secretKey;
    this.secretHash = secretHash ?? new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
      .update(secretWord ?? "")
      .getHash("HEX");
  }

  async authenticate(payload: Payload): Promise<boolean> {
    const secret = payload[this.secretKey];
    if (!secret) {
      return false;
    }
    if (secret === this.secretHash) {
      return true;
    }
    const hash = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
      .update(payload[this.secretKey])
      .getHash("HEX");
    return hash === this.secretHash;
  }
}
