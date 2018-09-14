//Express
var express = require('express');
var app = express();

//Configuration
var config = require('./config/config.js');

//Body-parser
//For parsing JSON and url-encoded data
var bodyParser = require('body-parser');

//For parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

//For parsing application/json
app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded' }));

//Mongodb
//For document Modeling in Node for MongoDB
var mongoose =require('mongoose');

//Mongodb database path
var databaseURI = config.database.url;
mongoose.connect(databaseURI).then(() => {

    console.log('Connected to MongoDB at', databaseURI);
}).catch(error => {

    console.log('Database connection error: '+ error.message);
})

//Created model load
var usersModel  = require('./api/models/users.js');

//Importing router
var usersRoute  = require('./api/routes/users.js');
usersRoute(app);

//An error handling middleware
app.use(function(error, request, response) {

    response.status(500);
    response.send("Oops! Something want wrong.");
});

app.use(function(error, request, response, next) {

    response.status(404);
    response.send("Invalid URL, Try with correct HTTP Method!");
});

app.listen(process.env.PORT || config.server.port, function(){

    console.log('"Get Coins" server listening on port '+ config.server.port);
});