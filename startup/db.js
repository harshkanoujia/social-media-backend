require('dotenv').config()
const mongoose = require('mongoose');
mongoose.set('debug', true)
const db = process.env.dbMlab

//db connect
module.exports = function () {
    mongoose.connect(db)
        .then( ()=> console.log(`Connected to ${db}...`) )
        .catch( (err)=> console.log('Error while connecting to MongoDb', err.message))
}
