
export interface Payload {
  userId?: string;
  authToken?: string;
  [key: string]: any;
}

export const DEFAULT_USER_ID = "default";
