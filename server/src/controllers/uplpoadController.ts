import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import cloudinary from "../utils/cloudinary";
import { UploadApiResponse } from "cloudinary";
import Image from "../models/image.schema";

export const uploadImageController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const streamifier = await import("streamifier");

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "uploads",
          public_id: `${userId}/${Date.now()}_${file.originalname}`,
          transformation: [{ width: 800, height: 800, crop: "limit" }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    const newImage = new Image({
      url: result.secure_url,
      user: userId,
      cloudinary_id: result.public_id,
    });

    await newImage.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      image: {
        url: newImage.url,
        cloudinary_id: newImage.cloudinary_id,
        createdAt: newImage.createdAt,
        updatedAt: newImage.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
