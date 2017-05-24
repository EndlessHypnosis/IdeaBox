
// Define Global Variables
var titleInput = $('#title-input');
var bodyInput = $('#body-input');
var saveButton = $('#save-button');
var ideaOutput = $('#idea-output');
var heading = $('#heading1');

//Create new array for ideas storing
var ideasArray = [];

// Initialize
$( document ).ready(function() {

    var ideasJson = localStorage.getItem('ideas');
    if (ideasJson)
    {
      var parsedIdeas = JSON.parse(ideasJson); //This is our array
      parsedIdeas.forEach(function(idea) {
        var ideaToPrepend = ideaBuilder(idea);
        ideaOutput.prepend(ideaToPrepend);
      })
      ideasArray = parsedIdeas;
    }

    var introMessage;
    if (ideasArray.length > 0) {
      introMessage = `Welcome back! I found ${ideasArray.length} saved Ideas. Don't stop now!`;
    } else {
      introMessage = `Hello There. You have no saved Ideas. What's on your mind?`;
    }
    heading.notify(introMessage,
    { position: 'bottom center',
      className: 'success',
      clickToHide: true,
      autoHide: false,
      autoHideDelay: 100,
      arrowShow: true,
      arrowSize: 6,
      style: 'bootstrap'
    });
});



saveButton.on('click', saveIdea);


//Constructor function (blueprint)
function Idea (title, body) {
  this.title = title;
  this.body = body;
  this.id = Math.floor(Math.random() * 999999);
  this.quality = 1;
  //default to swill = 1
  //plausible = 2
  //genius = 3
}

function storeArray() {
  var ideasJson = JSON.stringify(ideasArray);
  localStorage.setItem('ideas', ideasJson);
}

function saveIdea() {
  var newIdea = new Idea(titleInput.val(), bodyInput.val());
  ideasArray.push(newIdea);
  //Save new array items to local storage
  storeArray();

  var ideaToPrepend = ideaBuilder(newIdea);
  ideaOutput.prepend(ideaToPrepend);

  console.log(localStorage);
}

function ideaBuilder(ideaToBuild) {
  var newArticle = document.createElement('article');
  newArticle.id = ideaToBuild.id;
  newArticle.innerHTML = `<h2 class="idea-heading"> ${ideaToBuild.title} </h2>
  <img class="idea-delete-icon" src="FEE-ideabox-icon-assets/delete.svg" alt="Delete idea icon" height="20px" width="20px">
  <p class="idea-body"> ${ideaToBuild.body} </p>
  <input class="idea-body-input" style="display: none;">
  <img class="upvote-icon" src="FEE-ideabox-icon-assets/upvote.svg" alt="Upvote idea icon" height="20px" width="20px">
  <img class="downvote-icon" src="FEE-ideabox-icon-assets/downvote.svg" alt="Downvote idea icon" height="20px" width="20px">
  <p class="quality-rating">quality: <span class="quality-classification"> ${ideaToBuild.quality} </span></p>
  <hr>`;

  // adding event listeners to elements within our new article
  var upvoteElement = newArticle.querySelector('.upvote-icon');
  $(upvoteElement).on('click', function() {
    upVote(upvoteElement);
  });

  var ideaBodyElement = newArticle.querySelector('.idea-body');
  var ideaBodyInputElement = newArticle.querySelector('.idea-body-input');
  $(ideaBodyElement).on('click', function() {
    convertToInput($(ideaBodyElement), $(ideaBodyInputElement));
  });

  $(ideaBodyInputElement).on('blur', function() {
    blurMe(ideaBodyElement, ideaBodyInputElement);
  });

  $(ideaBodyInputElement).on('input keydown', function(event){
    if (event.keyCode == 13){
      blurMe($(ideaBodyElement), $(ideaBodyInputElement));
    }
  });

  return newArticle;
}

// when the user hits enter or selects off the box
function blurMe(readOnly, editable){
  var newBody = $(editable).val();
  $(editable).css('display', 'none');
    $(readOnly)
        .text(newBody)
        .css('display', '');

    //find and save this text
    var articleId = editable.closest('article').id;
    ideasArray.forEach(function(idea) {
      if (articleId == idea.id){
        console.log(newBody);
        idea.body = newBody;
      }
    });
    storeArray();
}

// on clicking
function convertToInput(readOnly, editable) {
  readOnly.css('display', 'none');
    editable
        .val(readOnly.text())
        .css('display', 'block')
        .focus();
}



function upVote(upVoteButton) {
  var articleId = upVoteButton.closest('article').id;
  ideasArray.forEach(function(idea) {
    if (idea.id == articleId) {
      if (idea.quality < 3) {
        idea.quality++;
      } else {
        $(upVoteButton).notify('Your idea is already genius!');
      }
    }
  })
  storeArray();
}
















// function search(button) {
  // var articleId = button.closest('article').id;
//   var filteredArray = ideasArray.filter(function(idea){
//     console.log(idea.id, articleId);
//     return idea.id == articleId;
//   })
//   filteredArray[0].quality++;
//   console.log(filteredArray);
//
// }
