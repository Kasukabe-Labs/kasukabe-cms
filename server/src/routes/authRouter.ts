import { Request, Response, Router } from "express";
import { generateRandomPromptController } from "../controllers/promptController";
import {
  googleAuthCallback,
  googleAuthRedirect,
} from "../controllers/authControllers";

const AuthRouter = Router();

AuthRouter.get("/google", (req: Request, res: Response) => {
  googleAuthRedirect(req, res);
});

AuthRouter.get("/google/callback", (req: Request, res: Response) => {
  googleAuthCallback(req, res);
});

export default AuthRouter;
