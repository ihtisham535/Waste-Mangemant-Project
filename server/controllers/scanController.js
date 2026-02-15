import Scan from "../models/Scan.js";

export const listScans = async (req, res) => {
  const scans = await Scan.find()
    .populate("restaurant", "name address")
    .populate("shop", "name address")
    .populate("item", "name price")
    .sort({ scannedAt: -1 });
  return res.json(scans);
};

export const dashboardMetrics = async (req, res) => {
  const [totalScans, totalRewardsAgg, recentScans] = await Promise.all([
    Scan.countDocuments(),
    Scan.aggregate([
      { $group: { _id: null, total: { $sum: "$discountAmount" } } },
    ]),
    Scan.find()
      .populate("shop", "name")
      .populate("item", "name")
      .sort({ scannedAt: -1 })
      .limit(10),
  ]);

  const totalRewards = totalRewardsAgg[0]?.total || 0;

  const recent = recentScans.map((scan) => ({
    id: scan._id,
    scannedAt: scan.scannedAt,
    shopName: scan.shop?.name || "Unknown",
    itemName: scan.item?.name || "Unknown",
    discountApplied: scan.discountAmount,
  }));

  return res.json({ totalScans, totalRewards, recent });
};
