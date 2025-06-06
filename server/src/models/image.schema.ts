import { model, Schema, Types } from "mongoose";
import { IImage } from "../types/image";

const ImageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Image = model<IImage>("Image", ImageSchema);

export default Image;
