import { Authenticator } from "../authenticator";
import jsSHA from "jssha";

interface Props {
  secretKey?: string;
  secretWord?: string;
  secretHash?: string;
}

export class SecretAuthenticator implements Authenticator {
  type: string = "secret";
  private secretKey: string;
  private secretHash: string;
  constructor({ secretKey = "secret", secretWord, secretHash }: Props) {
    this.secretKey = secretKey;
    this.secretHash = secretHash ?? new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
      .update(secretWord ?? "")
      .getHash("HEX");
  }

  async authenticate(payload: any): Promise<boolean> {
    const secret = payload[this.secretKey];
    if (secret === this.secretHash) {
      return true;
    }
    const hash = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
      .update(payload[this.secretKey])
      .getHash("HEX");
    return hash === this.secretHash;
  }
}
