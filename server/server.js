const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/extract-schedule", require("./routes/scheduleRoutes"));
app.use("/api/fetch-pois", require("./routes/poiRoutes"));
app.use("/api/optimize-itinerary", require("./routes/itineraryRoutes"));

app.get("/", (req, res) => {
  res.json({
    name: "Travel Nest API",
    status: "running",
    freeApis: ["Gemini API", "Overpass API", "OSRM", "Nominatim", "Browser Geolocation"],
    endpoints: [
      "POST /api/extract-schedule",
      "GET /api/fetch-pois",
      "POST /api/optimize-itinerary",
    ],
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
