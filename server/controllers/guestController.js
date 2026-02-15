import Restaurant from "../models/Restaurant.js";
import Shop from "../models/Shop.js";
import Item from "../models/Item.js";
import Scan from "../models/Scan.js";
import QRCode from "qrcode";

/**
 * GET DISCOUNT OFFERS
 * Fetch restaurant info and all available discount items from active shops
 */
export const getDiscountOffers = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    // Get restaurant info (assume single restaurant for now)
    const restaurant = restaurantId 
      ? await Restaurant.findById(restaurantId)
      : await Restaurant.findOne();

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Get all active shops for this restaurant
    const shops = await Shop.find({ 
      restaurant: restaurant._id,
      status: "Active" 
    }).sort({ name: 1 });

    // Get all active discount items from these shops
    const shopIds = shops.map(shop => shop._id);
    const items = await Item.find({
      shop: { $in: shopIds },
      isActive: true,
      discountActive: true,
      quantityAvailable: { $gt: 0 }
    }).populate('shop', 'name address');

    // Group items by shop
    const shopItemsMap = {};
    shops.forEach(shop => {
      shopItemsMap[shop._id.toString()] = {
        shop: {
          id: shop._id,
          name: shop.name,
          address: shop.address,
          status: shop.status
        },
        items: []
      };
    });

    items.forEach(item => {
      const shopId = item.shop._id.toString();
      if (shopItemsMap[shopId]) {
        shopItemsMap[shopId].items.push({
          id: item._id,
          name: item.name,
          originalPrice: item.originalPrice,
          discountedPrice: item.discountedPrice,
          quantityAvailable: item.quantityAvailable,
          discountAmount: item.originalPrice - item.discountedPrice,
          discountPercentage: Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)
        });
      }
    });

    // Convert to array and filter out shops with no items
    const offersData = Object.values(shopItemsMap).filter(data => data.items.length > 0);

    return res.json({
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address
      },
      shops: offersData,
      totalOffers: items.length
    });

  } catch (error) {
    console.error("Get discount offers error:", error);
    return res.status(500).json({ message: "Failed to fetch offers" });
  }
};

/**
 * CREATE SCAN RECORD
 * When guest selects an item, create scan record
 */
export const createScanReward = async (req, res) => {
  try {
    const { restaurantId, shopId, itemId, guestName, deviceFingerprint } = req.body;

    if (!restaurantId || !shopId || !itemId) {
      return res.status(400).json({ 
        message: "Restaurant, shop, and item are required" 
      });
    }

    // Check if user already scanned (24-hour limit)
    if (deviceFingerprint) {
      const recentScan = await Scan.findOne({ 
        deviceFingerprint,
        verificationStatus: "approved",
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (recentScan) {
        return res.status(429).json({ 
          message: "You have already claimed a reward in the last 24 hours",
          nextAvailableAt: recentScan.nextScanAvailableAt
        });
      }
    }

    // Get item details
    const item = await Item.findById(itemId).populate('shop');
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.discountActive || item.quantityAvailable <= 0) {
      return res.status(400).json({ message: "This item is no longer available" });
    }

    // Create scan record
    const scan = await Scan.create({
      restaurant: restaurantId,
      shop: shopId,
      item: itemId,
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      discountAmount: item.originalPrice - item.discountedPrice,
      guestName: guestName || "Guest",
      deviceFingerprint,
      verificationStatus: "approved", // Auto-approve QR scans
      rewardUnlocked: true,
      verifiedAt: new Date(),
      nextScanAvailableAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Decrease item quantity
    item.quantityAvailable -= 1;
    await item.save();

    return res.status(201).json({
      message: "Reward claimed successfully!",
      scan: {
        id: scan._id,
        item: item.name,
        shop: item.shop.name,
        originalPrice: scan.originalPrice,
        discountedPrice: scan.discountedPrice,
        discountAmount: scan.discountAmount,
        scannedAt: scan.scannedAt
      }
    });

  } catch (error) {
    console.error("Create scan reward error:", error);
    return res.status(500).json({ message: "Failed to create scan reward" });
  }
};

/**
 * GENERATE QR CODE FOR RESTAURANT
 * Admin uses this to get QR code for the restaurant
 */
export const generateRestaurantQR = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Get restaurant to validate it exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Generate QR code URL pointing to discount offers page
    const qrBaseUrl = process.env.QR_BASE_URL || "http://localhost:5173";
    const normalizedBaseUrl = qrBaseUrl.replace(/\/+$/, "");
    const qrTargetUrl = `${normalizedBaseUrl}/qr/offers?restaurantId=${restaurantId}`;

    // Generate QR code as Data URL
    const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 400,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    });

    return res.json({
      qr: qrDataUrl,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address
      },
      targetUrl: qrTargetUrl
    });

  } catch (error) {
    console.error("Generate restaurant QR error:", error);
    return res.status(500).json({ message: "Failed to generate QR code" });
  }
};
