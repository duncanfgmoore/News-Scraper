var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


// Require all models
var db = require("./models");

var PORT = process.env.PORT || 4000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/News-Scraper");

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/News-Scraper";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
