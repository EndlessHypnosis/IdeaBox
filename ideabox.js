var titleInput = $('#title-input');
var bodyInput = $('#body-input');
var saveButton = $('#save-button');
var ideaOutput = $('#idea-output');

//Create new array for ideas storing
var ideasArray = [];

$( document ).ready(function() {
    var ideasJson = localStorage.getItem('ideas');
    var parsedIdeas = JSON.parse(ideasJson);//This is our array
    parsedIdeas.forEach(function(idea) {
      var ideaToPrepend = ideaBuilder(idea);
      ideaOutput.prepend(ideaToPrepend);
    })
    ideasArray = parsedIdeas;
    console.log(parsedIdeas);
});



saveButton.on('click', saveIdea);

//Constructor function (blueprint)
function Idea (title, body) {
  this.title = title;
  this.body = body;
  this.id = Math.floor(Math.random() * 999999);
  this.quality = 1; //default to swill
}

function saveIdea() {
  var newIdea = new Idea(titleInput.val(), bodyInput.val());
  ideasArray.push(newIdea);
  //Save new array items to local storage
  var ideasJson = JSON.stringify(ideasArray);
  localStorage.setItem('ideas', ideasJson);

  var ideaToPrepend = ideaBuilder(newIdea);
  ideaOutput.prepend(ideaToPrepend);

  console.log(localStorage);
}

function ideaBuilder(ideaToBuild) {
  var newArticle = document.createElement('article');
  newArticle.innerHTML = `<h2 class="idea-heading"> ${ideaToBuild.title} </h2>
  <img class="idea-delete-icon" src="FEE-ideabox-icon-assets/delete.svg" alt="Delete idea icon" height="20px" width="20px">
  <p class="idea-body"> ${ideaToBuild.body} </p>
  <img class="upvote-icon" src="FEE-ideabox-icon-assets/upvote.svg" alt="Upvote idea icon" height="20px" width="20px">
  <img class="downvote-icon" src="FEE-ideabox-icon-assets/downvote.svg" alt="Downvote idea icon" height="20px" width="20px">
  <p class="quality-rating">quality: <span class="quality-classification"> ${ideaToBuild.quality} </span></p>
  <hr>`;
  return newArticle;
}
