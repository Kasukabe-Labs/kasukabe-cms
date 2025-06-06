import { Document } from "mongoose";

export interface IUser extends Document {
  pfp: string;
  google: boolean;
  email: string;
}
