import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../infrastructure/config/config";

// Modified authentication middleware to accept required role
const authenticationToken = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log("Entered AUTHENTICATIONTOKEN", req.headers['authorization']);

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('Token not found');
      res.status(401).json({ success: false, message: 'Access denied, token not found' });
      return;
    }

    console.log('Token found, verifying...');

    jwt.verify(token, config.JWT_SECRET as string, (err, decoded) => {
      console.log("Error or valid token:", err, decoded);

      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('Token expired', err);
          res.status(401).json({ success: false, message: 'Token expired' });
          return;
        }
        console.log('Invalid token', err);
        res.status(403).json({ success: false, message: 'Invalid token' });
        return;
      }

      if (decoded && typeof decoded !== 'string') {
        const { userId, email } = decoded as { userId: string; email: string; };

        console.log('Token verified. User ID:', userId, 'Email:', email);


        req.body.userId = userId;
        req.body.email = email;

        next(); // Continue to the next middleware
      } else {
        console.log('Decoded token format is invalid');
        res.status(400).json({ success: false, message: 'Invalid token payload' });
      }
    });
  };
};

export default authenticationToken;
