const winston = require('winston');
require("express-async-errors");

// module.exports = function () {
//     winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp({ format: ' YYYY-MM-DD   HH:mm:ss ' }),
//         winston.format.json(),
//     ),
//     transports:[
//         new winston.transports.Console({ colorize: true, prettyPrint: true }),
//         new winston.transports.File({ filename: 'logs/app.log'}),
//         new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
//     ],
//     // exceptionHandlers: [
//     //     new winston.transports.File({ filename: 'logs/exception.log' }),
//     // ],
//     // rejectionHandlers: [
//     //     new winston.transports.File({ filename: 'logs/rejections.log' }),
//     // ],
// })}

module.exports = function () {
  winston.exceptions.handle([                                       //uncaught exception
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/exception.log" })
  ]);

  process.on("unhandledRejection", (err) => {
    throw err;
  });
  winston.configure({ transports: [ new winston.transports.File({ filename: 'logs/rejections.log' }) ] });

  // const logger = winston.createLogger({
  //   level: "info",
  //   format: winston.format.combine(
  //       winston.format.timestamp({ format: ' YYYY-MM-DD   HH:mm:ss ' }),
  //       winston.format.json(),
  //   ),
  //   transports: [
  //     new winston.transports.Console({
  //       format: winston.format.combine(
  //         winston.format.colorize(),  
  //         winston.format.simple()      
  //       )
  //     }),
  //     new winston.transports.File({ filename: "logs/rejections.log" })
  //   ]
  // });
};

/*
const logger = winston.createLogger({
  level: 'info',        // Set the minimum logging level
  // level: 'debug',    //with this debug will be log else it does not log
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});
logger.info('This is an info log');
logger.error('This is an error log');
logger.warn('Hello, There is minor warning!')
logger.debug('Debugging start..!')

// logger.exitOnError = false;
*/