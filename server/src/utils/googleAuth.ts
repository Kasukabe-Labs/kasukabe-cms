import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

export const getGoogleUser = async (code: string) => {
  try {
    console.log("🔍 Attempting to exchange code for tokens...");
    console.log("Code received:", code);
    console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Redirect URI:", process.env.GOOGLE_REDIRECT_URI);

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken({
      code: code,
      // Explicitly don't send code_verifier since we're not using PKCE
    });

    console.log("✅ Tokens received successfully");
    console.log("Access token exists:", !!tokens.access_token);
    console.log("Refresh token exists:", !!tokens.refresh_token);

    // Set credentials
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    console.log("🔍 Fetching user info...");
    const { data } = await oauth2.userinfo.get();
    console.log("✅ User info received:", {
      email: data.email,
      name: data.name,
    });

    return data;
  } catch (error) {
    console.error("❌ Google Auth Error Details:");
    console.error("Error:", error);

    throw error;
  }
};
