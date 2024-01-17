export {};

declare global {
  namespace Express {
    export interface Request {
      databaseName: string;
    }
  }
}
