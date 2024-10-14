import { clientModel } from "../models/client.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import passport from "../../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const client = await clientModel.findById(userId);
    console.log(client);
    if (
      typeof client.generateAccessToken !== "function" ||
      typeof client.generateRefreshToken !== "function"
    ) {
      throw new ApiError(500, "Token generation functions not defined");
    }

    console.log("Client found, generating tokens");
    const accessToken = await client.generateAccessToken();
    console.log(accessToken);
    const refreshToken = await client.generateRefreshToken();
    console.log(refreshToken);
    console.log(2);
    client.refreshToken = refreshToken;
    await client.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(400, "Failed to create access and refresh token");
  }
};

const registerClient = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if ([name, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if client already exists
  const existingClient = await clientModel.findOne({ email });
  if (existingClient) {
    throw new ApiError(
      400,
      "Client already registered. Please go to the login page."
    );
  }

  // Create a new client
  const newClient = await clientModel.create({ name, email, password });

  // Generate a refresh token
  const refreshToken = jwt.sign(
    { _id: newClient._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Make sure you have these variables in your .env
  );

  // Update the client with the refresh token
  newClient.refreshToken = refreshToken; // Assuming your client model has a refreshToken field
  await newClient.save(); // Save the client with the refresh token

  // Get the created client without sensitive data
  const createdClient = await clientModel
    .findById(newClient._id)
    .select("-password -refreshToken");
  if (!createdClient) {
    throw new ApiError(400, "Failed to create client");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdClient, "Client created successfully"));
});

const registerClientUsingGoogle = (req, res) => {
  try {
    const authenticate = passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    });

    // Create a mock next function since the route doesn't provide one
    const next = () => {};

    return authenticate(req, res, next);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Authentication failed" });
  }
};
const googleCallback = (req, res) => {
  passport.authenticate("google", {
    successRedirect: "/", // Change this to your success page
    failureRedirect: "/login", // Change this to your login page
  })(req, res);
};
const loginClient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim) === "") {
    throw new ApiError(500, "All fields are required");
  }
  const checkClient = await clientModel.findOne({ email });
  if (!checkClient) {
    throw new ApiError(500, "client is not registered");
  }
  const correctPass = await checkClient.isPasswordCorrect(password);
  if (!correctPass) {
    throw new ApiError(500, "Invalid password");
  }
  const clientName = checkClient.name;
  const clientID = checkClient._id;
  const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
    checkClient._id
  );
  const loggedinClient = await clientModel
    .findById(checkClient._id)
    .select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: "Strict", // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    path: "/", // Cookie available across the entire site
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 }) // 15 mins for accessToken
    .json(
      new ApiResponse(
        200,
        {
          checkClient: loggedinClient,
          refreshToken,
          accessToken,
          clientName: checkClient.name,
          clientID: checkClient._id,
        },
        "Client logged in successfully"
      )
    );
});

const logoutClient = asyncHandler(async (req, res) => {
  await clientModel.findByIdAndUpdate(
    req.client._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Client logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Failed to fetch refresh token");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const client = await clientModel.findById(decodedToken?._id);
    if (!client) {
      throw new ApiError(401, "Invalid refrsh token");
    }
    if (incomingRefreshToken !== client?.refreshToken) {
      throw new ApiError(401, "Refresh tken is either used or expired");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateAccessAndRefereshTokens(client._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(400, "Invalid refersh token" || error?.message);
  }
});

const getName = asyncHandler(async (req, res) => {
  const client = req.client._id;
  console.log(client);
  const name = await clientModel.findById(client).select("name");
  if (!name) {
    throw new ApiError(200, "failed to fetch name form database");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user.name, "Fetched name successfully"));
});

export {
  loginClient,
  registerClient,
  logoutClient,
  generateAccessAndRefereshTokens,
  refreshAccessToken,
  getName,
  registerClientUsingGoogle,
  googleCallback,
};
