// src/controllers/authController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; 

export const validateToken = (req: Request, res: Response): Response | void => {
  try {
    console.log("Validating token...", req.body);

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('Token expired', err);
          return res.status(401).json({ success: false, message: 'Token expired' });
        } else {
          console.log('Invalid token', err);
          return res.status(403).json({ success: false, message: 'Invalid token' });
        }
      }

      // Type assertion to ensure decoded contains the required properties
      const { email } = decoded;

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { email },
        JWT_SECRET,
        { expiresIn: '1d' } // Set access token expiration
      );

      // Send the new access token to the frontend
      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error in validateToken:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
