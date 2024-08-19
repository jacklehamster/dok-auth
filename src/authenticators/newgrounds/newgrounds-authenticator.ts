import { Newgrounds, Config } from "medal-popup"; // Import necessary modules from medal-popup package
import { Authenticator } from "../authenticator"; // Import Authenticator interface

const NEWGROUNDS = "newgrounds";

// Define the structure of the payload object
interface Payload {
  type?: typeof NEWGROUNDS | string;
  userId?: string;
  session?: string;
}

// Implement NewgroundsAuthenticator class which conforms to Authenticator interface
export class NewgroundsAuthenticator implements Authenticator {

  // Constructor to initialize the config
  constructor(private config: Config) { }

  // Method to authenticate user based on userId and session
  async authenticate({ userId, session, type }: Payload): Promise<boolean> {
    if (!session || !userId || type !== NEWGROUNDS) {
      return false;
    }
    // Validate the session using Newgrounds API and check if it matches the userId
    return await Newgrounds.validateSession(session, this.config) === userId;
  }
}
