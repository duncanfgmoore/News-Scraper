//Scrapes the articles and puts them on the page
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    if(data[i].saved === false) {
      $("#articles").append("<div class='articleSpace'><p class='showArticles' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + " <button class='saveArticle btn btn-warning' data-id='" + data[i]._id + "'> Save Article </button></p></div>");
     } 
     if (data[i].saved === true) {
      $("#savedArticles").append("<div class='articleSpace'><p class='showArticles' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + " <button class='commentButton btn btn-info' data-id='" + data[i]._id + "' data-target='#myModal' data-toggle='modal'> Leave Comment </button> <button class='deleteButton btn btn-danger' data-id='" + data[i]._id + "'>Delete Article</button></p></div>");
    }
     
  }
});

//Onclick function that re generates the list of articles
$("#scrapeButton").on("click", function(){
  $.getJSON("/articles", function(data) { 
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class='articleSpace'><p class='showArticles' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + " <button class='saveArticle btn btn-warning'> Save Article </button></p></div>"); }
    });
});

//Onclick function that clears out all the articles on the page
$(".clearButton").on("click", function() {
  $("#articles").empty();
  
});


$(document).ready(function() {
//This part will be for leaving comments on the articles

$(".commentButton").on("click", function() {
  // Get article by article ID
  $("#myModal").modal("toggle");
  var articleID = $(this).attr("data-id");
  console.log(articleID);
 // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/notes/" + articleID
  }).done(function(data) {
    // Update modal header
    console.log(data);
    $("#comments-header").html("Article Comments (ID: " + data._id + ")");
    // If the article has comments
    if (data.note.length !== 0) {
      // Clear out the comment div
      $("#comments-list").empty();
      for (i = 0; i < data.note.length; i++) {
        // Append all article comments
        $("#comments-list").append("<div class='comment-div'><p class='comment'>" + data.comments[i].body + "</p></div>");
      }
    }
    // Append save comment button with article's ID saved as data-id attribute
    $("footer.modal-card-foot").html("<button id='save-comment' class='button is-success' data-id='" + data._id + "'>Save Comment</button>")
  });
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
      console.log(data);
    });
  
    location.reload();
});


//Onclick function to delete articles posted
$(".deleteButton").on("click", function() {
  var thisDelete = $(this).attr("data-id");
 
  console.log(thisDelete);
  $.ajax({
    method: "PUT",
    url: "/deleted/" + thisDelete,
    data: {
      saved: false
    }
  })
    .then(function(data) { 
      console.log(data);
    });
  
    location.reload();
  
});

});