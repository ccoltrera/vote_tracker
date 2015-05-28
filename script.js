$((function () {
  var tracker, imgurSettings;

  //Kitten() object constructor
  function Kitten(link) {
    this.link = link;
    this.score = 0;
  }

  function Tracker() {
    this.kittens = [];
  };

  Tracker.prototype.addKitten = function(kitten) {
    this.kittens.push(kitten);
  }

  Tracker.prototype.getRandomKitten = function() {
    return this.kittens[Math.floor(Math.random() * this.kittens.length)];
  }

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
      kittenRef.set(JSON.stringify(tracker["kittens"]), function(error) {
        this.setKittens(kittenOne, kittenTwo);
        syncDownFirebase();
      });
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

    //Adds vote for kittenOne, attempts to sync it to Firebase, highlights photo, shows votes, and shows moreKittens button.
    voteKittenOne = function() {
      kittenOne.score ++;
      // kittenRef.set(JSON.stringify(tracker["kittens"]), function(error) {
        $kittenOneFigure.addClass('chosen_kitty');
        $kittenTwoFigure.addClass('unchosen_kitty');
        showOpinions();
        $moreKittens.css('visibility','visible');
        $kittenOneFigure.off();
        $kittenTwoFigure.off();

      // });

    }

    //Adds vote for kittenTwo, attempts to sync it to Firebase, highlights photo, shows votes, and shows moreKittens button.
    voteKittenTwo = function() {
      kittenTwo.score ++;
      // kittenRef.set(JSON.stringify(tracker["kittens"]), function(error) {

        $kittenTwoFigure.addClass('chosen_kitty');
        $kittenOneFigure.addClass('unchosen_kitty');
        showOpinions();
        $moreKittens.css('visibility','visible');
        $kittenOneFigure.off();
        $kittenTwoFigure.off();

      // });

    }


    syncDownFirebase = function() {

      kittenRef.on("value", function(snapshot) {
        var kittens = JSON.parse(snapshot.val());
        tracker.kittens = kittens;
        tracker.setKittens();
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
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

  }

  tracker = new Tracker();

  imgurSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.imgur.com/3/album/IlrZO/images",
    "method": "GET",
    "headers": {
      "authorization": "Client-ID 94a39a9de3f3274"
    }
  }

  var myFirebaseRef = new Firebase("http://boiling-torch-5679.firebaseIO.com");
  var kittenRef = myFirebaseRef.child("kittenTracker");

  kittenRef.on("value", function(snapshot) {
    var kittens = JSON.parse(snapshot.val());
    tracker.kittens = kittens;
    tracker.setKittens();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $("#firebase_reset").on("click", function() {

    tracker = new Tracker();

    $.ajax(imgurSettings)
      .done(function (response) {
        var imageJSON = response;
        if (imageJSON["data"].length > 0) {
          for (var i = 0; i < imageJSON["data"].length; i++) {
            tracker.addKitten(new Kitten(imageJSON["data"][i]["link"]));
          }
          kittenRef.set(JSON.stringify(tracker["kittens"]));
        }
      }).fail(function (error) {
        console.log(error);
      });

  })


})());


