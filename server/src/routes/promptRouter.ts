import { Request, Response, Router } from "express";
import {
  deletePromptController,
  generateRandomPromptController,
  polishPromptController,
} from "../controllers/promptController";
import { authMiddleware } from "../middlewares/authMiddleware";

const PromptRouter = Router();

PromptRouter.post("/random", authMiddleware, (req: Request, res: Response) => {
  generateRandomPromptController(req, res);
});

PromptRouter.post("/polish", authMiddleware, (req: Request, res: Response) => {
  polishPromptController(req, res);
});

PromptRouter.delete(
  "/:promptId",
  authMiddleware,
  async (req: Request, res: Response) => {
    deletePromptController(req, res);
  }
);

export default PromptRouter;
