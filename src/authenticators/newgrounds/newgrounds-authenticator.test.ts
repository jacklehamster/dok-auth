import { describe, it, expect, beforeAll, jest } from "bun:test";
import { NewgroundsAuthenticator } from "./newgrounds-authenticator";
import { Newgrounds, Config } from "medal-popup";

describe("NewgroundsAuthenticator", () => {
  let mockConfig: Config;
  let authenticator: NewgroundsAuthenticator;

  beforeAll(() => {
    mockConfig = {} as Config; // Initialize mock Config object
    authenticator = new NewgroundsAuthenticator([mockConfig]);
  });

  it("should authenticate user with valid session", async () => {
    const payload = {
      userId: "validUserId",
      session: "validSession",
      type: "newgrounds",
    };

    // Mocking the validateSession function directly
    Newgrounds.validateSession = jest.fn().mockResolvedValue(payload.userId);

    const result = await authenticator.authenticate(payload);
    expect(result).toBe(true);
    expect(Newgrounds.validateSession).toHaveBeenCalledWith(payload.session, mockConfig);
  });

  it("should not authenticate user with invalid session", async () => {
    const payload = {
      type: "newgrounds",
      userId: "validUserId",
      session: "invalidSession",
    };

    // Mocking the validateSession function directly
    Newgrounds.validateSession = jest.fn().mockResolvedValue("differentUserId");

    const result = await authenticator.authenticate(payload);
    expect(result).toBe(false);
    expect(Newgrounds.validateSession).toHaveBeenCalledWith(payload.session, mockConfig);
  });

  it("should not authenticate if type is not newgrounds", async () => {
    const payload = {
      type: "differentType",
      userId: "validUserId",
      session: "validSession",
    };

    // Mocking the validateSession function directly
    Newgrounds.validateSession = jest.fn().mockResolvedValue("differentUserId");

    const result = await authenticator.authenticate(payload);
    expect(result).toBe(false);
    expect(Newgrounds.validateSession).not.toHaveBeenCalledWith(payload.session, mockConfig);
  });
});
