import Shop from "../models/Shop.js";

export const listShops = async (req, res) => {
  const shops = await Shop.find().populate("restaurant", "name address").sort({ createdAt: -1 });
  return res.json(shops);
};

export const createShop = async (req, res) => {
  const { name, address, status, restaurantId } = req.body;
  if (!name || !address || !restaurantId) {
    return res.status(400).json({ message: "Name, address, and restaurant are required" });
  }

  const shop = await Shop.create({
    name,
    address,
    status: status || "Active",
    restaurant: restaurantId,
  });

  return res.status(201).json(shop);
};

export const updateShop = async (req, res) => {
  const { id } = req.params;
  const { name, address, status } = req.body;

  const shop = await Shop.findById(id);
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  if (name) shop.name = name;
  if (address) shop.address = address;
  if (status) shop.status = status;
  await shop.save();

  return res.json(shop);
};

export const deleteShop = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findByIdAndDelete(id);
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }
  return res.json({ message: "Shop deleted" });
};
