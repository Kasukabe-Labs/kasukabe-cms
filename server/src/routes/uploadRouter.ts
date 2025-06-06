import { Response, Router } from "express";
import { upload } from "../middlewares/multer";
import { uploadImageController } from "../controllers/uplpoadController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

export const ImageRouter = Router();

ImageRouter.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    uploadImageController(req, res);
  }
);
