// Define Global Variables
var titleInput = $('#title-input');
var bodyInput = $('#body-input');
var saveButton = $('#save-button');
var ideaOutput = $('#idea-output');
var heading = $('#heading1');

//Create new array for ideas storing
var ideasArray = [];

// Initialize
$(document).ready(function() {

  // pull array out of local storage, populate DOM
  var ideasJson = localStorage.getItem('ideas');
  if (ideasJson) {
    var parsedIdeas = JSON.parse(ideasJson); //This is our array
    parsedIdeas.forEach(function(idea) {
      var ideaToPrepend = ideaBuilder(idea);
      ideaOutput.prepend(ideaToPrepend);
    })
    ideasArray = parsedIdeas;
  }

  // welcome message
  var introMessage;
  if (ideasArray.length > 0) {
    introMessage = `Welcome back! I found ${ideasArray.length} saved Ideas. Don't stop now!`;
  } else {
    introMessage = `Hello There. You have no saved Ideas. What's on your mind?`;
  }
  heading.notify(introMessage, {
    position: 'bottom center',
    className: 'success',
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 6000
  });
});

// one global event handler for save button
saveButton.on('click', saveIdea);

// Constructor function (blueprint) for our idea
function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.id = Math.floor(Math.random() * 999999);
  this.quality = "Swill";
}

// stringify and add array to local storage
function storeArray() {
  var ideasJson = JSON.stringify(ideasArray);
  localStorage.setItem('ideas', ideasJson);
}

// event listener for save button
function saveIdea() {
  //make sure both boxes have some input
  if (titleInput.val().length > 0 && bodyInput.val().length > 0) {

    // create the idea
    var newIdea = new Idea(titleInput.val(), bodyInput.val());
    // add it to the array
    ideasArray.push(newIdea);
    // push updated array to local storage
    storeArray();
    // add new idea to DOM
    var ideaToPrepend = ideaBuilder(newIdea);
    ideaOutput.prepend(ideaToPrepend);

    // clear inputs
    titleInput.val('');
    bodyInput.val('');

  } else {
    // invalid input
    heading.notify('Please enter something to save first', {
      position: 'bottom center',
      className: 'error',
      clickToHide: true,
      autoHide: true,
      autoHideDelay: 4000
    });
  }

}

// build a new article element, add all child html, and wire up related event listeners
function ideaBuilder(ideaToBuild) {
  var newArticle = document.createElement('article');
  newArticle.id = ideaToBuild.id;
  newArticle.innerHTML = `<h2 class="idea-heading"> ${ideaToBuild.title} </h2>
  <input class="idea-heading-input" style="display: none;">
  <img class="idea-delete-icon" src="FEE-ideabox-icon-assets/delete.svg" alt="Delete idea icon" height="20px" width="20px">
  <p class="idea-body"> ${ideaToBuild.body} </p>
  <input class="idea-body-input" style="display: none;">
  <img class="upvote-icon" src="FEE-ideabox-icon-assets/upvote.svg" alt="Upvote idea icon" height="20px" width="20px">
  <img class="downvote-icon" src="FEE-ideabox-icon-assets/downvote.svg" alt="Downvote idea icon" height="20px" width="20px">
  <p class="quality-rating">quality: <span class="quality-classification"> ${ideaToBuild.quality} </span></p>
  <hr>`;

  // click event listener for upvote button
  var upvoteElement = newArticle.querySelector('.upvote-icon');
  $(upvoteElement).on('click', function() {
    upVote(upvoteElement);
  });

  // click event listener for downvote button
  var downvoteElement = newArticle.querySelector('.downvote-icon');
  $(downvoteElement).on('click', function() {
    downVote(downvoteElement);
  });

  // click event listener for delete button
  var deleteElement = newArticle.querySelector('.idea-delete-icon');
  $(deleteElement).on('click', function() {
    deleteButton(deleteElement);
  });

  // START BLOCK[BODY]: handles swapping out a textbox for inplace editing
  var ideaBodyElement = newArticle.querySelector('.idea-body');
  var ideaBodyInputElement = newArticle.querySelector('.idea-body-input');
  $(ideaBodyElement).on('click', function() {
    convertToInput($(ideaBodyElement), $(ideaBodyInputElement));
  });
  // blur is when the textbox loses focus
  $(ideaBodyInputElement).on('blur', function() {
    blurMe(ideaBodyElement, ideaBodyInputElement, "body");
  });
  // this detects when the enter key is pressed
  $(ideaBodyInputElement).on('input keydown', function(event) {
    if (event.keyCode == 13) {
      blurMe($(ideaBodyElement), $(ideaBodyInputElement), "body");
    }
  });
  // END BLOCK[BODY]

  // START BLOCK[TITLE]: handles the swapping of textbox for inplace editing
  var ideaTitleElement = newArticle.querySelector('.idea-heading');
  var ideaTitleInputElement = newArticle.querySelector('.idea-heading-input');
  $(ideaTitleElement).on('click', function() {
    convertToInput($(ideaTitleElement), $(ideaTitleInputElement));
  });
  // blur is when the textbox loses focus
  $(ideaTitleInputElement).on('blur', function() {
    blurMe(ideaTitleElement, ideaTitleInputElement, "title");
  });
  // this detects when the enter key is pressed
  $(ideaTitleInputElement).on('input keydown', function(event) {
    if (event.keyCode == 13) {
      blurMe($(ideaTitleElement), $(ideaTitleInputElement), "title");
    }
  });
  // END BLOCK[TITLE]

  // finally, we want this function to return this <article> tag we made
  return newArticle;
}


// when the user hits enter or selects off the input this is ran
function blurMe(readOnly, editable, target) {
  // toggle the elemnts display and make sure to copy the value back from the input
  var newValue = $(editable).val();
  $(editable).css('display', 'none');
  $(readOnly)
    .text(newValue)
    .css('display', '');

  // find the related idea and save the new text
  var articleId = editable.closest('article').id;
  ideasArray.forEach(function(idea) {
    if (articleId == idea.id) {
      if (target === "body") {
        idea.body = newValue;
      }
      if (target === "title") {
        idea.title = newValue;
      }
    }
  });
  // update local storage with new array
  storeArray();
}

// when the user clicks on the text, display an input field instead
function convertToInput(readOnly, editable) {
  readOnly.css('display', 'none');
  editable
    .val(readOnly.text().trim())
    .css('display', 'block')
    .focus();
}


// event listener for upvote button
function upVote(upVoteButton) {
  var articleId = upVoteButton.closest('article').id;
  var newQuality;
  ideasArray.forEach(function(idea) {
    if (idea.id == articleId) {
      if (idea.quality === "Swill") {
        idea.quality = "Plausible";
        newQuality = idea.quality;
      } else if (idea.quality === "Plausible") {
        idea.quality = "Genius"
        newQuality = idea.quality;
      } else {
        $(upVoteButton).notify('Your idea is already genius!', {
          position: 'bottom center',
          className: 'info',
          clickToHide: true,
          autoHide: true,
          autoHideDelay: 3000
        });
      }
    }
  })

  storeArray();
  $(upVoteButton).siblings().find('.quality-classification').text(newQuality); //it's fixed
}

// event listener for downvote button
function downVote(downVoteButton) {
  var articleId = downVoteButton.closest('article').id;
  var newQuality;
  ideasArray.forEach(function(idea) {
    if (idea.id == articleId) {
      if (idea.quality === "Genius") {
        idea.quality = "Plausible";
        newQuality = idea.quality;
      } else if (idea.quality === "Plausible") {
        idea.quality = "Swill";
        newQuality = idea.quality;
      } else {
        $(downVoteButton).notify('Your idea is swill, work on it and it may become genius!', {
          position: 'bottom center',
          className: 'info',
          clickToHide: true,
          autoHide: true,
          autoHideDelay: 3000
        });
      }
    }
  })
  storeArray();
  $(downVoteButton).siblings().find('.quality-classification').text(newQuality); //it's fixed
}

// event listener for delete button
function deleteButton(deleteButton) {
  var articleId = deleteButton.closest('article').id;
  ideasArray.forEach(function(idea, index) {
    if (idea.id == articleId) {
      var article = document.getElementById(articleId);
      $(article).remove();
      ideasArray.splice(index, 1);
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
