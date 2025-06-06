import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pfp: {
      type: String,
      default: "",
    },
    google: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export default User;
