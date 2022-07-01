const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// the format of output
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level}: ${message}`;
});

// logger config
const logger = createLogger({
    transports: [
      new transports.File({ filename: 'combined.log' })
    ],
    format: combine(
        timestamp({format: "MM.DD.YY hh:mm:ss"}),
        myFormat
    ),
});

module.exports = logger;