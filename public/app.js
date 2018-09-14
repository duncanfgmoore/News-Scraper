//Scrapes the articles and puts them on the page
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    if(data[i].saved === false) {
      $("#articles").append("<div class='unsaved'><p class='showArticles' data-id='" + data[i]._id + "'>" + "<h3>" + data[i].title +"</h3>" + "<br/>" + data[i].summary + "<br/>" + data[i].link +  "<br/> <button class='saveArticle btn btn-warning' data-id='" + data[i]._id + "'> Save Article </button></p></div>");
     } 
     if (data[i].saved === true) {
      $("#savedArticles").append("<div class='articleSpace'><p class='showArticles' data-id='" + data[i]._id + "'>" + "<h3>" + data[i].title +"</h3>" + "<br>" + data[i].summary + "<br>" + data[i].link + " </br><button class='commentButton btn btn-info' data-id='" + data[i]._id + "' data-target='#myModal' data-toggle='modal'> Leave Comment </button> <button class='deleteButton btn btn-danger' data-id='" + data[i]._id + "'>Delete Article</button></p></div>");
    }
     
  }
});

//Onclick function that re generates the list of articles
$("#scrapeButton").on("click", function(){
  $.getJSON("/articles", function(data) { 
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class='articleSpace'><p class='showArticles' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href=" + data[i].link + ">" + data[i].link + "</a>" + "<button class='saveArticle btn btn-warning'> Save Article </button></p></div>"); }
    });
});

//Onclick function that clears out all the articles on the page
$(".clearButton").on("click", function() {
  $("#articles").empty();
  
});


$(document).ready(function() {
//This part will be for leaving comments on the articles

$(".commentButton").on("click", function() {
  // Empty the notes from the note section
 
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#noteArea").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#noteArea").append("<input id='titleinput' name='title' placeholder='Title of comment'>");
      // A textarea to add a new note body
      $("#noteArea").append("<textarea id='bodyinput' name='body' placeholder='Your comment goes here'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#noteArea").append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
  
});

$(document).on("click", "#saveNote", function() {

  
  //Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      //console.log(data);
      // Empty the notes section
      $("#noteArea").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Onclick function to update the article to saved
$(".saveArticle").on("click", function() {
  var thisId = $(this).attr("data-id");
 
  console.log(thisId);
  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: {
      saved: true
    }
  })
    .then(function(data) { 
      //console.log(data);
    });
  
    location.reload();
});


//Onclick function to delete articles posted
$(".deleteButton").on("click", function() {
  var thisDelete = $(this).attr("data-id");
 
  //console.log(thisDelete);
  $.ajax({
    method: "PUT",
    url: "/deleted/" + thisDelete,
    data: {
      saved: false
    }
  })
    .then(function(data) { 
      //console.log(data);
    });
  
    location.reload();
  
});

});