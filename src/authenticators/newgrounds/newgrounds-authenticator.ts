import { Newgrounds, Config } from "medal-popup"; // Import necessary modules from medal-popup package
import { Authenticator } from "../authenticator"; // Import Authenticator interface

// Define the structure of the payload object
interface Payload {
  userId: string;
  session: string;
  type: string;
}

// Implement NewgroundsAuthenticator class which conforms to Authenticator interface
export class NewgroundsAuthenticator implements Authenticator {
  type = "newgrounds"; // Define the type of the authenticator

  // Constructor to initialize the config
  constructor(private config: Config) {}

  // Method to authenticate user based on userId and session
  async authenticate({ userId, session }: Payload): Promise<boolean> {
    // Validate the session using Newgrounds API and check if it matches the userId
    return await Newgrounds.validateSession(session, this.config) === userId;
  }
}
