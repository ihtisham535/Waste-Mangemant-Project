import Item from "../models/Item.js";

export const listItems = async (req, res) => {
  const items = await Item.find()
    .populate({
      path: "shop",
      select: "name address",
      populate: { path: "restaurant", select: "name" },
    })
    .sort({ createdAt: -1 });
  return res.json(items);
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    originalPrice,
    discountedPrice,
    quantityAvailable,
    discountActive,
    isActive,
  } = req.body;

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (name) item.name = name;
  if (typeof price === "number") item.price = price;
  if (typeof originalPrice === "number") item.originalPrice = originalPrice;
  if (typeof discountedPrice === "number") item.discountedPrice = discountedPrice;
  if (typeof quantityAvailable === "number") item.quantityAvailable = quantityAvailable;
  if (typeof discountActive === "boolean") item.discountActive = discountActive;
  if (typeof isActive === "boolean") item.isActive = isActive;

  await item.save();
  return res.json(item);
};
