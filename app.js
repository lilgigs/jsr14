// Initialize Firebase
var config = {
   apiKey: "AIzaSyCcbS-aoC4PdUALbRo-j7ZLotx6T6p9S-U",
   authDomain: "js-tg-1d638.firebaseapp.com",
   databaseURL: "https://js-tg-1d638.firebaseio.com",
   projectId: "js-tg-1d638",
   storageBucket: "js-tg-1d638.appspot.com",
   messagingSenderId: "544445640025"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {
  $('#myModal').hide();
  $('#message-form').submit(function (event) {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault()

    // grab user message input
    var message = $('#message').val()

    // clear message input (for UX purposes)
    $('#message').val('')

    // create a section for messages data in your db
    var messagesReference = database.ref('messages');

    // use the set method to save data to the messages
    messagesReference.push({
      message: message,
      votes: 0
    })

  });

  // // on initialization of app (when document is ready) get fan messages
  messageClass.getFanMessages();
});

var messageClass = (function () {
  function getFanMessages() {
    // retrieve messages data when .on() initially executes
    // and when its data updates
    database.ref('messages').on('value', function (results) {
      var $messageBoard = $('.message-board')
      var messages = []

      var allMessages = results.val();

      // iterate through results coming from database call; messages
      for (var msg in allMessages) {
        // get method is supposed to represent HTTP GET method
        var message = allMessages[msg].message;
        var votes = allMessages[msg].votes;
        console.log('votes from for in', votes);
        // create message element
        var $messageListElement = $('<li></li>')

        // create delete element
        var $deleteElement = $('<i class="fa fa-trash pull-right delete"></i>')
        $deleteElement.on('click', function (e) {
          var id = $(e.target.parentNode).data('id');
          deleteMessage(id);
          $(e.target.parentNode).remove();
        });

        // create update element
        var $updateElement = $('<i class="fa fa-pencil pull-right pencil"></i>')
        $updateElement.on('click', function (e) {
          var id = $(e.target.parentNode).data('id');
          updateMessage(id);
          //$(e.target.parentNode).remove();
        });


//         // create up vote element
//         var $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>');
//         $upVoteElement.on('click', function (e) {

//           var id = $(e.target.parentNode).data('id');
//           votes++;
//           console.log('upvotes',votes);

//           updateMessage(id, votes);

//         });

//         // create down vote element
//         var $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>')
//         $downVoteElement.on('click', function (e) {
//           var id = $(e.target.parentNode).data('id')
//           updateMessage(id, --votes)
//         })

        // add id as data attribute so we can refer to later for updating
        $messageListElement.attr('data-id', msg)

        // add message to li
        $messageListElement.html(message);

        // add delete element
        $messageListElement.append($deleteElement);
        $messageListElement.append($updateElement);

        // add voting elements
        //$messageListElement.append($upVoteElement);
        //$messageListElement.append($downVoteElement);

        // show votes
        //$messageListElement.append('<div class="pull-right">' + votes + '</div>')

        // push element to array of messages
        messages.push($messageListElement)

        // remove lis to avoid dupes
        $messageBoard.empty()
      }

      for (var i in messages) {
        $messageBoard.append(messages[i]);
      }
    })

  }

  function updateMessage(id) {
    var messageReference = database.ref('messages/' + id)
    
    var message = prompt("What is your message");

    messageReference.update({
      message: message
    });
  }

  function deleteMessage(id) {
    // find message whose objectId is equal to the id we're searching with
    var messageReference = database.ref('messages/' + id)

    messageReference.remove()
  }

  return {
    getFanMessages: getFanMessages
  }

})();