//Express
var express = require('express');
var app = express();

//Configuration
var configuration = require('./config/config.js');

//Body-parser
//For parsing JSON and url-encoded data
var bodyParser = require('body-parser');

//For parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

//For parsing application/json
app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded' }));

//Static files
app.use(express.static('public'));

//Mongodb
//For document Modeling in Node for MongoDB
var mongoose =require('mongoose');

//Mongodb database path
var databaseURI = configuration.database.url;
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

//Messages
var message = require('./api/messages.js');

//An error handling middleware
app.use(function(error, request, response) {

    console.log(error);
    response.status(500);
    response.json({

        "error" : true,
        "message" : message.somethingWrong
    });
});

app.use(function(error, request, response, next) {

    console.log(error);
    response.status(404);
    response.json({

        "error" : true,
        "message" : message.invalidURL
    });
});

app.listen(process.env.PORT || configuration.server.port, function(){

    console.log('"Get Coins" server listening on port '+ configuration.server.port);
});