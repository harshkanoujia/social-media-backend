const Joi = require('joi');


module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);        // one time setup and it validate the objectId
}