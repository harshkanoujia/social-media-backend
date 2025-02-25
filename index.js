const config = require('config')
const express = require("express");
const app = express();


require('./startup/logging')()
require('./startup/logger')
require('./startup/db')()
require('./startup/routes')(app)


// Server
const port = config.get('port')
app.listen( port, () => console.log(`Server is listening on ${port}...`) )