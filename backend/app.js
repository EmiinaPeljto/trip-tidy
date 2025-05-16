const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");


app.use(express.json());

const userRoutes = require("./routes/api/v1/gen/users");
const hotelRoutes = require("./routes/api/v1/gen/hotels");

app.use("/api/v1/gen/users", userRoutes);
app.use("/api/v1/gen/hotels", hotelRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
