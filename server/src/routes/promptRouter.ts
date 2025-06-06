import { Request, Response, Router } from "express";
import { generateRandomPromptController } from "../controllers/promptController";
import { authMiddleware } from "../middleware/authMiddleware";

const PromptRouter = Router();

PromptRouter.post("/random", authMiddleware, (req: Request, res: Response) => {
  generateRandomPromptController(req, res);
});

export default PromptRouter;
