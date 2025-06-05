/*import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization)  return next(createError(401, "You are not authenticated!"));
    // Get the token from the header
    const token = req.headers.authorization.split(" ")[1];
    // Check if token exists
    if (!token)  return next(createError(401, "You are not authenticated!"));

    const decode = await jwt.verify(token, process.env.JWT);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error)
    res.status(402).json({ error: error.message })
  }
};*/

import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "You are not authenticated!"));
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return next(createError(403, "Token is invalid or expired!"));
  }
};
