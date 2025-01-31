import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { error as logError } from './logger';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export default class Helper {
  private static getSecretKey(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error('JWT_SECRET env not set!');

    return secret;
  }

  static signToken(payload: {
    id: string | undefined;
    email: string | undefined;
  }): string {
    const token = jwt.sign(payload, this.getSecretKey(), {
      expiresIn: '7d',
    });

    return token;
  }

  static verifyToken(payload: string): jwt.JwtPayload {
    try {
      const decodedToken = jwt.verify(payload, this.getSecretKey());

      if (typeof decodedToken === 'object') {
        return decodedToken;
      }

      throw new Error('Invalid Token Format, expected an object');
    } catch (error) {
      if (error instanceof Error) {
        logError({
          message: 'Token verification failed',
          params: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        });
      }

      throw new Error('Token verification failed');
    }
  };

  static hash(value:string, saltvalue =10){
    const hashedPassword = bcrypt.hashSync(value, saltvalue);
    return hashedPassword
  };

  static correctPassword(inputPassword:string, userPassword:string){
    const isMatch = bcrypt.compareSync(inputPassword, userPassword);

    return isMatch;
  };

  
  static generateUniqueFilename(filename: string) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${filename.split('.')[0]}-${uniqueSuffix}${path.extname(filename)}`;
  }
}
