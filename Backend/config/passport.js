import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { clientModel } from "../src/models/client.model.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5217/api/v1/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Check if user exists
        let user = await clientModel.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          // Create new user if doesn't exist
          user = await clientModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            refreshToken: "",
            password: "",
            // Add any other fields you need
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
