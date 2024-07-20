interface ExpirationOptions {
  EX?: number;
}

export interface DataClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: ExpirationOptions): Promise<string | null>;
}
