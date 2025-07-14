require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");
const session = require("express-session");
const passport = require("./config/passport");

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "cache-control",
      "pragma",
      "Accept",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Add additional headers for cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Enable trust proxy - CRITICAL for secure cookies behind a proxy
app.set("trust proxy", 1);

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "session_name",
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
    },
    proxy: true,
  })
);

app.use(
  session({ secret: "your_secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./routes/api/v1/gen/users");
const hotelRoutes = require("./routes/api/v1/gen/hotels");
const flightRoutes = require("./routes/api/v1/gen/flights");
const placeRoutes = require("./routes/api/v1/gen/places");
const summaryRoutes = require("./routes/api/v1/gen/summary");
const dayByDayRoutes = require("./routes/api/v1/gen/dayByDay");
const itineraryRoutes = require("./routes/api/v1/gen/itinerary");
const emailVerificationRoutes = require("./routes/api/v1/gen/email_verification");
const preferencesRoutes = require("./routes/api/v1/gen/preferences");
const favoriteRoutes = require("./routes/api/v1/gen/favorites");

app.use("/api/v1/gen/users", userRoutes);
app.use("/api/v1/gen/hotels", hotelRoutes);
app.use("/api/v1/gen/flights", flightRoutes);
app.use("/api/v1/gen/places", placeRoutes);
app.use("/api/v1/gen/summary", summaryRoutes);
app.use("/api/v1/gen/dayByDay", dayByDayRoutes);
app.use("/api/v1/gen/itinerary", itineraryRoutes);
app.use("/api/v1/gen/email_verification", emailVerificationRoutes);
app.use("/api/v1/gen/preferences", preferencesRoutes);
app.use("/api/v1/gen/favorites", favoriteRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
