const config = require('config');
const express = require("express");
const app = express();


app.set('view engine', 'ejs');
app.get('/home', ( req, res) => {
    res.render('home', {
        msg: 'This is Twilio calling api'
    })
});


require('./startup/config')();          // environement check 
require('./startup/logging')();         // logging handle error and crashes
require('./startup/db')();              // db connection
require('./startup/validation')();      // vaidate object id
require('./startup/cors')(app);         // cors middleware setup for external api call 
require('./startup/routes')(app);       // routes load
require('./startup/prod')(app);         // production level
require('./startup/logger');            // apiReq save


// Server
const port = process.env.PORT || config.get('port');
app.listen( port, () => {
    console.log(`Server is listening on ${port}...`);
});