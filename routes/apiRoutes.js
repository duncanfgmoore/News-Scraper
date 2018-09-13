let db = require("../models");
let axios = require('axios'); // HTTP Request
let cheerio = require('cheerio'); // Web Scrapper
let mongoose = require('mongoose'); // MongoDB ORM

mongoose.connect("mongodb://localhost/scrapingMongos");


module.exports = function (app) {

  app.get("/", function(req, res) {
    db.Article.find({saved:false}).sort({_id: -1}).then(function(articles) {
  
      var hbsObject = { articles: articles }
      res.render("index", hbsObject);
    }).catch(function(err) {
      res.json(err);
    })
  });

  // A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
  
    db.Article.find({})
    .then(function(dbarticle){
      res.json(dbarticle)
    })
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  
    db.Article.findById(req.params.id)
    .populate("note")
    .then(function(dbarticle){
      res.json(dbarticle);
    })
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    
    db.Note.create(req.body)
    .then(function(dbNote){
      return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbUser) {
      res.json(dbUser);
    })
  
  });


app.get("/marksaved/:id", (req, res) => {
    db.Article.findByIdAndUpdate(req.params.id, {$set: {saved: true}}, {new: true}, (err, edited) => {
        if (err) {res.send();} 
        console.log(edited);
        res.send(edited);
    });
  });

  app.put("/articles/:id", (req, res) => {
    // Using the id passed in the id parameter, prepare a query that updates the matching one in our db...
    db.Article.update({ _id: req.params.id}, {$set: {saved: true}})
  
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  app.put("/deleted/:id", (req, res) => {
    // Using the id passed in the id parameter, prepare a query that updates the matching one in our db...
    db.Article.update({ _id: req.params.id}, {$set: {saved: false}})
  
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  app.get("/notes/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("note")
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });

 
  app.post("/notes/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    var newNote = new Note(req.body);
    // And save the new comment the db
    newNote.save(function(error, newNote) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's comment
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: newNote._id }}, { new: true })
        // Execute the above query
        .exec(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            console.log("doc: ", doc);
            // Or send the document to the browser
            res.send(doc);
          }
        });
      }
    });
  });
};