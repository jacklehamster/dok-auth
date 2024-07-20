import ShortUniqueId from "short-unique-id";
import { DEFAULT_USER_ID } from "./Payload";
import { DataClient } from "@/interface/data-client";

const shortUid = new ShortUniqueId();
const EXPIRATION_TIME_IN_SECONDS = 600; // 10 minutes

export class AuthProvider {
  constructor(private client: DataClient) {
  }

  async provideToken(userId: string = DEFAULT_USER_ID) {
    const authToken = shortUid.stamp(32, new Date(Date.now() + EXPIRATION_TIME_IN_SECONDS * 1000));

    try {
        const result = await this.client.set(userId, authToken, {
            EX: EXPIRATION_TIME_IN_SECONDS
        });
        console.log(`New authToken ${authToken} for user ${userId} set with expiration of ${EXPIRATION_TIME_IN_SECONDS} seconds.`);
    } catch (err) {
        console.error('Error setting authToken:', err);
        return undefined;
    }

    return authToken;
  }

  async authenticateToken(userId: string, authToken: string) {
    return await this.getAuthToken(userId) === authToken;
  }

  async refreshToken(userId: string = DEFAULT_USER_ID, authToken: string) {
    if (await this.authenticateToken(userId, authToken)) {
      return await this.provideToken(userId);
    }
  }

  getTokenTimestamp(authToken: string) {
    return shortUid.parseStamp(authToken);
  }

  async getAuthToken(userId: string) {
      try {
          const authToken = await this.client.get(userId);
          if (authToken) {
              console.log(`Current authToken for user ${userId}: ${authToken}`);
              return authToken;
          } else {
              console.log(`AuthToken for user ${userId} has expired or does not exist.`);
              return null;
          }
      } catch (err) {
          console.error('Error getting authToken:', err);
          return null;
      }
  }
}
