import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const loginAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  const rawIdentity = username || email;

  if (!rawIdentity || !password) {
    return res.status(400).json({ message: "Username/email and password are required." });
  }

  const normalizedIdentity = String(rawIdentity).trim().toLowerCase();

  const admin = await Admin.findOne({ username: normalizedIdentity });
  if (!admin || !admin.isActive) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      displayName: admin.displayName,
    },
  });
};

export const registerAdmin = async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const existingAdmin = await Admin.findOne();
  if (existingAdmin) {
    return res.status(403).json({ message: "Admin registration is disabled." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const duplicate = await Admin.findOne({ username: normalizedEmail });
  if (duplicate) {
    return res.status(409).json({ message: "Admin already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const nameFromEmail = normalizedEmail.split("@")[0] || "Administrator";

  const admin = await Admin.create({
    username: normalizedEmail,
    passwordHash,
    displayName: displayName?.trim() || nameFromEmail,
  });

  return res.status(201).json({
    message: "Admin created",
    admin: { id: admin._id, username: admin.username, displayName: admin.displayName },
  });
};

export const logoutAdmin = async (req, res) => {
  return res.json({ message: "Logged out" });
};
