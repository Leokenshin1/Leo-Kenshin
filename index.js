const express = require("express");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const pino = require("pino");

// Use the router from pair.js
const pairRouter = require("./pair");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the routes
app.use("/", pairRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
