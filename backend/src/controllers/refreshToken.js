import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_SECRET
    );

    const newAccessToken =
      generateAccessToken(decoded.id);

    const newRefreshToken =
      generateRefreshToken(decoded.id);

    res.cookie(
      "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};