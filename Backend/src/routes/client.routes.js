import { Router } from "express";
import {
  loginClient,
  registerClient,
  logoutClient,
  registerClientUsingGoogle,
  getName,
  googleCallback,
} from "../controller/client.controller.js";
import { verifyJWTclient } from "../middlewares/authClient.middleware.js";

const router = Router();

router.route("/register").post(registerClient);
router.route("/registerClientUsingGoogle").post(registerClientUsingGoogle);
router.route("/login").post(loginClient);
router.route("/logout").post(logoutClient);
router.route("/name").get(getName);
router.get("/auth/google/callback", googleCallback);

export default router;
