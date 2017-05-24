
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

  //adding our notify style
  $.notify.addStyle('happyblue', {
    html: "<div><span data-notify-text/></div>",
    classes: {
      base: {
        "font-weight": "bold",
        "font-size": "18px",
        "padding": "8px 15px 8px 14px",
        "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
        "border": "1px solid #86c978",
        "border-radius": "4px",
        "white-space": "nowrap",
        "padding-left": "25px",
        "background-repeat": "no-repeat",
        "background-position": "3px 7px",
        "color": "#468847",
        "background-color": "#DFF0D8",
        "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
      }
    }
  });



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
      style: 'happyblue'
    });
});

saveButton.on('click', saveIdea);

//Constructor function (blueprint)
function Idea (title, body) {
  this.title = title;
  this.body = body;
  this.id = Math.floor(Math.random() * 999999);
  this.quality = "Swill";
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

  titleInput.val('');
  bodyInput.val('');
  console.log(localStorage);
}

function ideaBuilder(ideaToBuild) {
  var newArticle = document.createElement('article');
  newArticle.id = ideaToBuild.id;
  newArticle.innerHTML = `<h2 class="idea-heading"> ${ideaToBuild.title} </h2>
  <img class="idea-delete-icon" src="FEE-ideabox-icon-assets/delete.svg" alt="Delete idea icon" height="20px" width="20px">
  <p class="idea-body"> ${ideaToBuild.body} </p>
  <img class="upvote-icon" src="FEE-ideabox-icon-assets/upvote.svg" alt="Upvote idea icon" height="20px" width="20px">
  <img class="downvote-icon" src="FEE-ideabox-icon-assets/downvote.svg" alt="Downvote idea icon" height="20px" width="20px">
  <p class="quality-rating">quality: <span class="quality-classification"> ${ideaToBuild.quality} </span></p>
  <hr>`;

  newArticle.querySelector('.upvote-icon').addEventListener('click', function() {
    upVote(newArticle.querySelector('.upvote-icon'));
  });

  newArticle.querySelector('.downvote-icon').addEventListener('click', function() {
    downVote(newArticle.querySelector('.downvote-icon'));
  })

  newArticle.querySelector('.idea-delete-icon').addEventListener('click', function() {
    deleteButton(newArticle.querySelector('.idea-delete-icon'));
  })

  return newArticle;
}

function upVote(upVoteButton) {
  var articleId = upVoteButton.closest('article').id;
  var newQuality;
  ideasArray.forEach(function(idea) {
    if (idea.id == articleId) {
      if (idea.quality ===  "Swill") {
        idea.quality = "Plausible";
        newQuality = idea.quality;
      } else if (idea.quality === "Plausible") {
        idea.quality = "Genius"
        newQuality = idea.quality;
      } else {
        heading.notify('Your idea is already genius!');
      }
    }
  })
  storeArray();
  $(upVoteButton).siblings('span').text(newQuality);//FIX ME!!!!!!!
}

function downVote(downVoteButton) {
  var articleId = downVoteButton.closest('article').id;
  ideasArray.forEach(function(idea) {
    if (idea.id == articleId) {
      if (idea.quality === "Genius") {
        idea.quality = "Plausible";
      } else if (idea.quality === "Plausible") {
        idea.quality = "Swill";
      } else {
        heading.notify('Your idea is swill, work on it and it may become genius quiality!');
      }
    }
  })
  console.log("END", ideasArray);
  storeArray();
}

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
