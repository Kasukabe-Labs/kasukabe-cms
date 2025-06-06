import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.DATABASE_URL as string
    );
    console.log(`Mongodb connected ✅: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB❌:", error);
    process.exit(1);
  }
};

export default connectDB;
