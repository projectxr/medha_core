import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { clientModel } from "../models/client.model.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyJWTclient = asyncHandler(async (req, _, next) => {
  try {
    console.log(req);
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
    console.log(req.cookies);
    console.log("Retrieved token:", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Use the environment variable

    const client = await clientModel
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!client) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.client = client;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); // Log error for debugging
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
