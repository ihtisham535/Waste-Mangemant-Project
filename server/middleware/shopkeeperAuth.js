import jwt from "jsonwebtoken";

const shopkeeperAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing shopkeeper token" });
  }

  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.SHOPKEEPER_JWT_SECRET);
    req.shopkeeper = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default shopkeeperAuth;
