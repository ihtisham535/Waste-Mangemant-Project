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
  if (!rawUsername || !password) {
    throw new Error("ADMIN_SEED_USERNAME or ADMIN_SEED_PASSWORD is missing in server/.env");
  }

  const username = String(rawUsername).trim().toLowerCase();

  await mongoose.connect(mongoUri);

  const deleted = await Admin.deleteMany({});
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    username,
    passwordHash,
    displayName: "Super Admin",
  });

  console.log(`Deleted admins: ${deleted.deletedCount}`);
  console.log(`Created admin: ${admin.username}`);

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
