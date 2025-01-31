// import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { error as logError } from '../helpers/logger';
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('')[1];
  console.log('Authorization header:', req.headers['authorization']);


  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    
    return;
  }

  try {
    // const decoded = Helper.verifyToken(token);
    const decoded = jwt.verify(token,JWT_SECRET);

    req.user = decoded as { id: number; email: string };

    next();
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: 'Error decoding token',
        params: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      });
    }

    // req.user = undefined;
    res.status(401).json({error:"Invalid Token"})

    return;
  }
};
