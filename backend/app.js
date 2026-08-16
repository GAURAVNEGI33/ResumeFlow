const express = require("express");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "2mb" }));

// Enable CORS for all requests
app.use(cors());

// Parse JSON request body
app.use(express.json());

// All API routes start from /api
app.use("/api", routes);

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port`, process.env.PORT);
});
