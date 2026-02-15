import Shopkeeper from "../models/Shopkeeper.js";

export const getShopkeeperProfile = async (req, res) => {
  const shopkeeper = await Shopkeeper.findById(req.shopkeeper.id).populate(
    "shop",
    "name address status"
  );

  if (!shopkeeper) {
    return res.status(404).json({ message: "Shopkeeper not found." });
  }

  return res.json({
    id: shopkeeper._id,
    name: shopkeeper.name,
    email: shopkeeper.email,
    shop: shopkeeper.shop,
  });
};
