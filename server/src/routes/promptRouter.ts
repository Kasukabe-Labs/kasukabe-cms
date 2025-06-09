import { Request, Response, Router } from "express";
import {
  bookmarkPromptController,
  deletePromptController,
  generateRandomPromptController,
  getBookmarkedPromptsController,
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

PromptRouter.post(
  "/bookmark",
  authMiddleware,
  (req: Request, res: Response) => {
    bookmarkPromptController(req, res);
  }
);

PromptRouter.get(
  "/bookmarked",
  authMiddleware,
  (req: Request, res: Response) => {
    getBookmarkedPromptsController(req, res);
  }
);

PromptRouter.delete(
  "/:promptId",
  authMiddleware,
  async (req: Request, res: Response) => {
    deletePromptController(req, res);
  }
);

export default PromptRouter;
