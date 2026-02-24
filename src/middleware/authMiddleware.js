import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  console.log("authMiddleware reached");
  // Two actitvities the first one is reading the token from the request
  // check if the token is valid
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.cookie) {
    // fallback: parse cookie header if `cookie-parser` middleware is not used
    const cookieHeader = req.headers.cookie;
    const cookies = cookieHeader.split(";").reduce((acc, pair) => {
      const [k, v] = pair.split("=");
      if (!k || v === undefined) return acc;
      acc[k.trim()] = decodeURIComponent(v.trim());
      return acc;
    }, {});
    if (cookies.jwt) token = cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({ error: "Not authorized,no token provided" });
  }
  try {
    // Verify token and extract the user Id
    // the token contains payload,signature and header the algorithm decodes it

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ error: "Not authorized, token invalid" });
  }
};
