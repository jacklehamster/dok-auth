export interface Authenticator {
  type: string;
  authenticate(payload: any):Promise<boolean>;
}
