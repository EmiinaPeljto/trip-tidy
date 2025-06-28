const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModels");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/v1/gen/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by google_id
        let user = await userModel.getUserByEmail(profile.emails[0].value);
        if (!user) {
          // Register new user
          const username = profile.emails[0].value.split("@")[0];
          await userModel.register({
            first_name: profile.name.givenName || "",
            last_name: profile.name.familyName || "",
            username,
            email: profile.emails[0].value,
            password_hash: null,
            google_id: profile.id,
          });
          user = await userModel.getUserByEmail(profile.emails[0].value);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.getUserById(id);
  done(null, user);
});

module.exports = passport;
