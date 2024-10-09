import { Newgrounds, Config } from "medal-popup"; // Import necessary modules from medal-popup package
import { Authenticator } from "../authenticator"; // Import Authenticator interface

const NEWGROUNDS = "newgrounds";

// Define the structure of the payload object
interface Payload {
  type?: typeof NEWGROUNDS | string;
  key?: string;
  userId?: string;
  session?: string;
}

// Implement NewgroundsAuthenticator class which conforms to Authenticator interface
export class NewgroundsAuthenticator implements Authenticator {

  // Constructor to initialize the config
  constructor(private configs: Config[]) { }

  // Method to authenticate user based on userId and session
  async authenticate({ userId, session, type, key }: Payload): Promise<boolean> {
    if (!session || !userId || type !== NEWGROUNDS) {
      return false;
    }
    console.log("Key", key);
    console.log("this.configs", this.configs);
    const config = this.configs.find(config => config.key === key);
    // Validate the session using Newgrounds API and check if it matches the userId
    return await Newgrounds.validateSession(session, config) === userId;
  }
}
