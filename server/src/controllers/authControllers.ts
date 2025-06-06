import { Request, Response } from "express";
import { getGoogleAuthUrl, getGoogleUser } from "../utils/googleAuth";
import User from "../models/user.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken";
import { sendToken } from "../utils/sendToken";

export const googleAuthRedirect = (_req: Request, res: Response) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) return res.status(400).json({ message: "Code is missing" });

  try {
    const googleUser = await getGoogleUser(code);
    const existingUser = await User.findOne({ email: googleUser.email });

    let user = existingUser;

    if (!user) {
      user = await User.create({
        email: googleUser.email,
        pfp: googleUser.picture,
        google: true,
      });
    }

    const refreshToken = generateRefreshToken(user?.id.toString());
    const accessToken = generateAccessToken(user?.id.toString());

    sendToken(res, accessToken, refreshToken, "Google login successful");

    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="0; URL='${process.env.CLIENT_URL}/dashboard'" />
          <script>
            window.location.href = '${process.env.CLIENT_URL}/dashboard';
          </script>
        </head>
        <body>
          Redirecting...
        </body>
      </html>
    `);
    return;
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google auth failed" });
  }
};
