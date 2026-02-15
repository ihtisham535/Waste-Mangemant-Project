import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Shopkeeper from "../models/Shopkeeper.js";
import Shop from "../models/Shop.js";

export const loginShopkeeper = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const normalizedEmail = email.toLowerCase();
  const shopkeeper = await Shopkeeper.findOne({ email: normalizedEmail });
  if (!shopkeeper || !shopkeeper.isActive) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, shopkeeper.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // Check if shopkeeper has a shop assigned
  if (!shopkeeper.shop) {
    return res.status(403).json({ 
      message: "No shop assigned. Please contact the administrator to assign you to a shop." 
    });
  }

  const shop = await Shop.findById(shopkeeper.shop);
  if (!shop) {
    return res.status(403).json({ message: "Assigned shop not found. Please contact the administrator." });
  }

  if (shop.status !== "Active") {
    return res.status(403).json({ message: "Your assigned shop is currently inactive." });
  }

  const token = jwt.sign(
    { id: shopkeeper._id, shopId: shop._id, email: shopkeeper.email },
    process.env.SHOPKEEPER_JWT_SECRET,
    { expiresIn: "12h" }
  );

  return res.json({
    token,
    shopkeeper: {
      id: shopkeeper._id,
      name: shopkeeper.name,
      email: shopkeeper.email,
    },
    shop: {
      id: shop._id,
      name: shop.name,
      address: shop.address,
    },
  });
};

export const logoutShopkeeper = async (req, res) => {
  return res.json({ message: "Logged out" });
};
