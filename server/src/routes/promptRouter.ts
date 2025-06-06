import { Request, Response, Router } from "express";
import {
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

export default PromptRouter;
