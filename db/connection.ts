import mongoose from "mongoose";

const connectDB = async() => {
    await mongoose.connect(process.env.Mongo_Db_Url);
}

export default connectDB;