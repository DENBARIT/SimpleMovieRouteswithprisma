import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //1. check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }
  // Hash the password before storing it in the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  // generate jwt and set cookie on response
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: {
      id: user.id,
      name: user.name,
      // password: user.password,
      email: user.email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  // check password
  const isPasswordValid = await bcrypt.compare(
    password.toString(),
    user.password,
  );
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  // generate token
  const token = generateToken(user.id, res);
  res.status(201).json({
    status: "success",
    data: {
      id: user.id,
      // name: user.name,
      // password: user.password
      email: user.email,
    },
    token,
  });
};
const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    // secure: process.env.node_env === "production",
    expires: new Date(0),
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export { register, login, logout };
