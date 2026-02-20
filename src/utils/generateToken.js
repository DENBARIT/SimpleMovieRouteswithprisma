import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  res.cookie("jwt", token, {
    // cannot be accessed by client-side JavaScript
    httpOnly: true,
    secure: process.env.node_env === "production",
    // prevents the cookie from being sent in cross-site requests, mitigating CSRF attacks
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
