import Restaurant from "../models/Restaurant.js";

export const getRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOne();
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  return res.json(restaurant);
};

export const upsertRestaurant = async (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ message: "Name and address are required" });
  }

  const existing = await Restaurant.findOne();
  if (!existing) {
    const restaurant = await Restaurant.create({ name, address });
    return res.status(201).json(restaurant);
  }

  existing.name = name;
  existing.address = address;
  await existing.save();
  return res.json(existing);
};
