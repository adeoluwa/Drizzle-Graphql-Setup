// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
