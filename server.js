// BASE SETUP
// ================================================================================

// call the packages we need
var express         = require('express');       // call express
var app             = express();                // define our app using express
var bodyParser      = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       // set our PORT

var creds = require("./config/env/credentials.js");
var mongoose        = require('mongoose');
mongoose.connect(creds.db); // connect to database
// mongoose.connect('mongodb://user:pass@domain'); // connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Bear            = require('./app/models/bear');



// ROUTES FOR OUR API
// ================================================================================
var router = express.Router();            // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'API working!'});
});

// more routes for our API will happen here

// on routes that end in /bears
// ------------------------------------------------------
router.route('/bears')

    //create a bear (accessed at POST http://localhost:8080/api/bears)
      .post(function(req, res) {

        var bear = new Bear();            // create a new instance of the Bear models
        bear.name = req.body.name;        // set the bears name (comes from the request)
        bear.posX = req.body.posX;
        bear.posY = req.body.posY;
        bear.creator = creds.user;
        bear.dateCreated = Date();
        // save the bear and check for errors
        bear.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: bear.name + ' bear created at ' + bear.dateCreated + '!'});
        });

      })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
     .get(function(req, res) {

        Bear.find(function(err, bears) {
          if (err)
              res.send(err);

          res.json(bears);
        });
      });

// on routes that end in /bears/:bear_id
// ------------------------------------------------------
router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
        if (err)
            res.send(err);
        res.json(bear);
      });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        Bear.findById(req.params.bear_id, function(err, bear) {

          if (err)
            res.send(err);

          bear.name = req.body.name;      // update the bears info

          // save the bear
          bear.save(function(err) {
            if (err)
              res.send(err);

            res.json({ message: 'Bear updated!' });
          });
        });
    })

    .delete(function(req, res) {

        Bear.remove({
          _id: req.params.bear_id
        }, function(err, bear) {
          if (err)
            res.send(err);

          res.json({ message: 'Successfully deleted' });
        });
      });

// REGISTER OUR ROUTES ----------------------------------
// all of our routes will be prefixed with /api
app.use(express.static(__dirname + "/src"));
app.use('/api', router);
// START THE server
// ================================================================================
app.listen(port);
console.log('App active on port ' + port);
