import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  const rawUsername = process.env.ADMIN_SEED_USERNAME;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in server/.env");
  }

  await mongoose.connect(mongoUri);

  const admin = await Admin.findOne();
  if (!admin) {
    console.log("No admin found in database.");
    await mongoose.disconnect();
    return;
  }

  const normalizedUsername = rawUsername ? String(rawUsername).trim().toLowerCase() : null;
  const passwordOk = password ? await bcrypt.compare(password, admin.passwordHash) : false;

  console.log(`Admin in DB: ${admin.username}`);
  console.log(`Matches ADMIN_SEED_USERNAME: ${normalizedUsername === admin.username}`);
  console.log(`Matches ADMIN_SEED_PASSWORD: ${passwordOk}`);

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
