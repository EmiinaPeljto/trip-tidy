require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");


app.use(express.json());

const userRoutes = require("./routes/api/v1/gen/users");
const hotelRoutes = require("./routes/api/v1/gen/hotels");
const flightRoutes = require("./routes/api/v1/gen/flights");
const placeRoutes = require("./routes/api/v1/gen/places");
const summaryRoutes = require("./routes/api/v1/gen/summary");
const dayByDayRoutes = require("./routes/api/v1/gen/itinerary");

app.use("/api/v1/gen/users", userRoutes);
app.use("/api/v1/gen/hotels", hotelRoutes);
app.use("/api/v1/gen/flights", flightRoutes);
app.use("/api/v1/gen/places", placeRoutes);
app.use("/api/v1/gen/summary", summaryRoutes);
app.use("/api/v1/gen/itinerary", dayByDayRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
