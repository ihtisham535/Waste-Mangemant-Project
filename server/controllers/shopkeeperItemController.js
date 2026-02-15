import Item from "../models/Item.js";

export const listShopItems = async (req, res) => {
  const items = await Item.find({ shop: req.shopkeeper.shopId }).sort({ createdAt: -1 });
  return res.json(items);
};

export const createShopItem = async (req, res) => {
  const { name, originalPrice, discountedPrice, quantityAvailable, discountActive } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Item name is required." });
  }

  const item = await Item.create({
    name,
    originalPrice: Number(originalPrice) || 0,
    discountedPrice: Number(discountedPrice) || 0,
    quantityAvailable: Number(quantityAvailable) || 0,
    discountActive: discountActive === true || discountActive === "true",
    isActive: true,
    price: Number(originalPrice) || 0,
    shop: req.shopkeeper.shopId,
  });

  return res.status(201).json(item);
};

export const updateShopItem = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findOne({ _id: id, shop: req.shopkeeper.shopId });

  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  const { name, originalPrice, discountedPrice, quantityAvailable, discountActive } = req.body;

  if (name !== undefined) item.name = name;
  if (originalPrice !== undefined) {
    item.originalPrice = Number(originalPrice) || 0;
    item.price = item.originalPrice;
  }
  if (discountedPrice !== undefined) item.discountedPrice = Number(discountedPrice) || 0;
  if (quantityAvailable !== undefined) item.quantityAvailable = Number(quantityAvailable) || 0;
  if (discountActive !== undefined) {
    item.discountActive = discountActive === true || discountActive === "true";
  }

  await item.save();
  return res.json(item);
};

export const deleteShopItem = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findOneAndDelete({ _id: id, shop: req.shopkeeper.shopId });
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }
  return res.json({ message: "Item deleted" });
};
