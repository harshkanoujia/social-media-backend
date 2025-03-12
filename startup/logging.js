require("express-async-errors");
const winston = require('winston');


// logs stored
module.exports = function () {
    winston.exceptions.handle([                                       //uncaught exception
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/exception.log" })
    ]);

    process.on("unhandledRejection", (err) => {
        throw err;
    });

    winston.configure({ transports: [new winston.transports.File({ filename: 'logs/rejections.log' })] });
}