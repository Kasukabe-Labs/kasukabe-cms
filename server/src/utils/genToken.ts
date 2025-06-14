import jwt from "jsonwebtoken";

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
