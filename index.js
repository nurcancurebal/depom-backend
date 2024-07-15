require("dotenv").config();

// ? Node modules.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ? Constants.
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// ? Database connection and conf.
mongoose.connection
  .on("error", (error) => {
    console.error("MongoDB", error);
  })
  .on("open", () => {
    console.log("MongoDB", "Database Connected");
  });

mongoose.connect(MONGODB_URI);

// ? Express application create.
const app = express();

// ? Middlewares.
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(require("./routes"));
app.use(require("./middlewares/error"));

// ? Server listen.
app.listen(PORT, () => {
  console.log("Listening api server", `http://localhost:${PORT}`);
});
