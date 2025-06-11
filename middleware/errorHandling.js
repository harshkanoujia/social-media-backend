const winston = require("winston");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: ' YYYY-MM-DD   HH:mm:ss ' }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

module.exports = function ( err, req, res, next ) {
    
    logger.error( err.message, err )

    console.log(err);
    res.errorMessage = err.message

    if (err.code === 11000 ) {
        return res.status(400).send({ apiId: req.apiId, statusCode: 400, message: "Mongoose Validation Error! Duplicate Key not allowed" , Error: err.message })
    }
    
    res.status(500).send({ apiId: req.apiId, statusCode: 500, message: "Something not working Properly" })
}