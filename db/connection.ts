import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const url: string = process.env.Mongo_Db_Url || "";
    await mongoose.connect(url);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
