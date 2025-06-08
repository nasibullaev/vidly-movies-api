const winston = require("winston");
const express = require("express");
const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "test") {
  server = app.listen(); // ⬅️ No port = random available port
} else {
  server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
  });
}
module.exports = server;
