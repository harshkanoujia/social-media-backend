const config = require('config')
const mongoose = require('mongoose');
mongoose.set('debug', true)

const db = config.get('dbMlab')

//db connect
module.exports = async function () {
    mongoose.connect(db)
        .then( ()=> console.log(`Connected to ${db}...`) )
        .catch( (err)=> console.log('Error while connecting to MongoDb', err.message))
}
