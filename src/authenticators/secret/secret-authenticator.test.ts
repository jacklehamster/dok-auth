import { SecretAuthenticator } from "./secret-authenticator";
import jsSHA from "jssha";

describe("SecretAuthenticator", () => {
  it("should initialize with default secret key and hash", () => {
    const authenticator = new SecretAuthenticator({});
    expect(authenticator["secretKey"]).toBe("secret");
    const expectedHash = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" }).getHash("HEX");
    expect(authenticator["secretHash"]).toBe(expectedHash);
  });

  it("should initialize with provided secret key and word", () => {
    const secretWord = "testWord";
    const authenticator = new SecretAuthenticator({ secretWord });
    const expectedHash = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" }).update(secretWord).getHash("HEX");
    expect(authenticator["secretHash"]).toBe(expectedHash);
  });

  it("should initialize with provided secret hash", () => {
    const secretHash = "testHash";
    const authenticator = new SecretAuthenticator({ secretHash });
    expect(authenticator["secretHash"]).toBe(secretHash);
  });

  it("should authenticate correctly with matching secret hash", async () => {
    const secretWord = "testWord";
    const payload = { secret: secretWord };
    const authenticator = new SecretAuthenticator({ secretWord });
    const result = await authenticator.authenticate(payload);
    expect(result).toBe(true);
  });

  it("should authenticate correctly with non-matching secret hash", async () => {
    const secretWord = "testWord";
    const payload = { secret: "wrongWord" };
    const authenticator = new SecretAuthenticator({ secretWord });
    const result = await authenticator.authenticate(payload);
    expect(result).toBe(false);
  });

  it("should authenticate correctly with provided secret hash", async () => {
    const secretHash = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
      .update("testWord")
      .getHash("HEX");
    const payload = { secret: "testWord" };
    const authenticator = new SecretAuthenticator({ secretHash });
    const result = await authenticator.authenticate(payload);
    expect(result).toBe(true);
  });
});
