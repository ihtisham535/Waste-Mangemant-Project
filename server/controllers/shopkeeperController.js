import bcrypt from "bcryptjs";
import Shopkeeper from "../models/Shopkeeper.js";

export const listShopkeepers = async (req, res) => {
  const shopkeepers = await Shopkeeper.find()
    .populate("shop", "name address status")
    .sort({ createdAt: -1 });
  return res.json(shopkeepers);
};

export const createShopkeeper = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const shopkeeper = await Shopkeeper.create({
    name,
    email,
    passwordHash,
    shop: null, // Shopkeepers are created without shop assignment
  });

  return res.status(201).json(shopkeeper);
};

export const updateShopkeeper = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, isActive, shop } = req.body;

  const shopkeeper = await Shopkeeper.findById(id);
  if (!shopkeeper) {
    return res.status(404).json({ message: "Shopkeeper not found" });
  }

  if (name) shopkeeper.name = name;
  if (email) shopkeeper.email = email;
  if (typeof isActive === "boolean") shopkeeper.isActive = isActive;
  if (password) {
    shopkeeper.passwordHash = await bcrypt.hash(password, 10);
  }
  // Handle shop assignment (allow null to unassign)
  if (shop !== undefined) {
    shopkeeper.shop = shop || null;
  }

  await shopkeeper.save();
  return res.json(shopkeeper);
};

export const deleteShopkeeper = async (req, res) => {
  const { id } = req.params;
  const shopkeeper = await Shopkeeper.findByIdAndDelete(id);
  if (!shopkeeper) {
    return res.status(404).json({ message: "Shopkeeper not found" });
  }
  return res.json({ message: "Shopkeeper deleted" });
};
