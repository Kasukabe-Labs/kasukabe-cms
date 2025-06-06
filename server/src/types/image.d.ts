import { Document, Mongoose } from "mongoose";

export interface IImage extends Document {
  url: string;
  cloudinary_id: string;
  createdAt: Date;
  updatedAt: Date;
  user: Mongoose.Types.ObjectId;
}
