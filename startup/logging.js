const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.configure({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.prettyPrint(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.File({ filename: "logfile.log" }),
      new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" }),
      new winston.transports.Console(),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: "exceptions.log" }),
      new winston.transports.Console(),
    ],
  });
};
