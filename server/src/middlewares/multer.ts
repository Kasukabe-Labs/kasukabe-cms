import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  } else {
    cb(new Error("Please upload an image file"));
  }
};

export const upload = multer({ storage, fileFilter });
