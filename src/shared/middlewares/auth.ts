import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader)
      return res.status(401).json({
        success: false,
        message: 'Authorization is missing',
      });

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token)
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided',
      });

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || typeof jwtSecret !== 'string')
      return res.status(500).json({
        success: false,
        message: 'JWT secret is not configured on the server',
      });

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded)
      return res.status(403).json({
        success: false,
        message: 'Invalid token payload',
      });

    (req as any).user = { id: decoded };
    next();
  } catch (err: any) {
    console.error('Error:', err.message);
    res.status(err.status | 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
};
