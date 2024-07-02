export interface Authenticator {
  authenticate(payload: any):Promise<boolean>;
}
