(function() {
  var tracker, imgurSettings, firebaseRef, kittensRef;

  //Kitten() object constructor
  function Kitten(id, link) {
    this.id = id;
    this.link = link;
    this.score = 0;
  }

  function Tracker() {
    this.kittens = {};
  }

  Tracker.prototype.getRandomKitten = function() {
    var keys = Object.keys(this["kittens"])
    return this["kittens"][keys[ keys.length * Math.random() << 0]];
  };

  Tracker.prototype.setKittens = function(oldKittenOne, oldKittenTwo) {
    var $moreKittens, $kittenOne, $kittenTwo, $kittenOneButton, $kittenTwoButton, $kittenOneFigure, $kittenTwoFigure, $kittenOneImg, $kittenTwoImg, $userOpinions, kittenOne, kittenTwo, showOpinions, voteKittenOne, voteKittenTwo;

    //Queries and caches everything used more than once below.
    $kittenOne = $('#kitten_1');
    $kittenTwo = $('#kitten_2');

    //Additionally changes visibility and removes event handlers, where necessary.
    $userOpinions = $('.user_opinion').hide();
    $moreKittens = $('#more_kittens').css('visibility','hidden');

    $kittenOneButton = $kittenOne.find('button').show().off();
    $kittenTwoButton = $kittenTwo.find('button').show().off();

    $kittenOneFigure = $kittenOne.find('figure').off();
    $kittenTwoFigure = $kittenTwo.find('figure').off();

    $kittenOneImg = $kittenOne.find('img');
    $kittenTwoImg = $kittenTwo.find('img');


    //Resets classes on figures.
    $('figure').removeClass('chosen_kitty');
    $('figure').removeClass('unchosen_kitty');

    //Sets event handler for moreKittens button.
    $moreKittens.on('click', $.proxy(function() {
        this.setKittens(kittenOne, kittenTwo);
    }, this));


    //Gets two different random kittens, makes sure they are new, stores them in variables.
    do {
      kittenOne = this.getRandomKitten();
    } while (kittenOne === oldKittenOne || kittenOne === oldKittenTwo)
    do {
      kittenTwo = this.getRandomKitten();
    } while (kittenTwo === oldKittenOne || kittenTwo === oldKittenTwo || kittenOne === kittenTwo);


    //Hides vote buttons, and displays kitten votes.
    showOpinions = function() {
      $kittenOneButton.hide();
      $kittenTwoButton.hide();

      $userOpinions.show();
      $kittenOne.find('span').text('Votes for this kitty: ' + kittenOne.score);
      $kittenTwo.find('span').text('Votes for this kitty: ' + kittenTwo.score);

    }

    //Adds vote for kittenOne, attempts to sync it to Firebase, highlights photo,
    //shows votes, and shows moreKittens button.
    voteKittenOne = function() {
      kittenOne.score ++;
      kittensRef.child(kittenOne.id).update(kittenOne, function(error) {
        $kittenOneFigure.addClass('chosen_kitty');
        $kittenTwoFigure.addClass('unchosen_kitty');
        showOpinions();
        $moreKittens.css('visibility','visible');
        $kittenOneFigure.off();
        $kittenTwoFigure.off();

      });

    }

    //Adds vote for kittenTwo, attempts to sync it to Firebase, highlights photo,
    //shows votes, and shows moreKittens button.
    voteKittenTwo = function() {
      kittenTwo.score ++;
      kittensRef.child(kittenTwo.id).update(kittenTwo, function(error) {

        $kittenTwoFigure.addClass('chosen_kitty');
        $kittenOneFigure.addClass('unchosen_kitty');
        showOpinions();
        $moreKittens.css('visibility','visible');
        $kittenOneFigure.off();
        $kittenTwoFigure.off();

      });

    }

    //Puts links to the images in the proper places.
    $kittenOneImg.attr('src', kittenOne.link);
    $kittenTwoImg.attr('src', kittenTwo.link);

    //Set event handling on buttons and figures.
    $kittenOneFigure.on('click', voteKittenOne);
    $kittenTwoFigure.on('click', voteKittenTwo);

    $kittenOneButton.on('click', voteKittenOne);
    $kittenTwoButton.on('click', voteKittenTwo);

  };

  imgurSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.imgur.com/3/album/IlrZO/images",
    "method": "GET",
    "headers": {
      "authorization": "Client-ID 94a39a9de3f3274"
    }
  };

  firebaseRef = new Firebase("http://boiling-torch-5679.firebaseIO.com");
  kittensRef = firebaseRef.child("kittenTracker");

  //Asyncronous function called at startup, which creates a Tracker() object and populates it with Firebase kittens
  kittensRef.once('value', function(kittensSnapshot) {
    //Creates new tracker object kittensSnapshot for use in below examples.
    tracker = new Tracker();

    //Loops through the children of the kittens snapshop, adding the Kitten() objects to the tracker.
    kittensSnapshot.forEach(function(kittenSnapshot) {
      tracker["kittens"][kittenSnapshot.key()] = kittenSnapshot.val();
    });

    //Initializes the game.
    tracker.setKittens();

  });

  //Listens for changes in Kitten() objects on the Firebase server, updates local scores to match.
  kittensRef.on("child_changed", function(kittenSnapshot) {
    //console.log(tracker["kittens"][kittenSnapshot.key()]["score"]);
    tracker["kittens"][kittenSnapshot.key()]["score"] = kittenSnapshot.val()["score"];
    //console.log(tracker["kittens"][kittenSnapshot.key()]["score"]);
  });


  $(function () {
    //Attach event listener to reset button. Callback function puts a request to the Imgur API, gets
    //info about kitten photos, generates Kitten() objects locally, and pushes them to Firebase.
    $("#firebase_reset").on("click", function() {

      tracker = new Tracker();

      $.ajax(imgurSettings)
        .done(function (response) {
          var imgurObject = response;

          if (imgurObject["data"].length > 1) {
            for (var i = 0; i < imgurObject["data"].length; i++) {
              tracker["kittens"][imgurObject["data"][i]["id"]] = new Kitten(imgurObject["data"][i]["id"], imgurObject["data"][i]["link"]);
              kittensRef.child(imgurObject["data"][i]["id"]).set(tracker["kittens"][imgurObject["data"][i]["id"]]);
            }

            tracker.setKittens();
          }
        }).fail(function (error) {
          console.log(error);
        });
    });
  });

})();




