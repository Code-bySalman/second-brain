import jwt from 'jsonwebtoken';
import { JWTPASS } from './config';
//@ts-ignore
export const userMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWTPASS);
    //@ts-ignore
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Forbidden" });
  }
};
