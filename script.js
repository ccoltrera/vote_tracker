$((function () {
  var tracker;

  //Photo() object constructor
  function Photo(link) {
    this.link = link;
    this.score = 0;
  }

  function Tracker() {
    this.photos = [];
  };

  Tracker.prototype.addPhoto = function(photo) {
    this.photos.push(photo);
  }

  Tracker.prototype.getRandomPhoto = function() {
    return this.photos[Math.floor(Math.random() * this.photos.length)];
  }

  Tracker.prototype.setPhotos = function(oldKittenOne, oldKittenTwo) {
    var $moreKittens, $kittenOne, $kittenTwo, $kittenOneButton, $kittenTwoButton, $kittenOneFigure, $kittenTwoFigure, $kittenOneImg, $kittenTwoImg, $userOpinions, kittenOne, kittenTwo, showOpinions, voteKittenOne, voteKittenTwo;

    //Queries and caches everything used more than once below.

    $kittenOne = $('#kitten_1');
    $kittenTwo = $('#kitten_2');

    $userOpinions = $('.user_opinion').hide();
    $moreKittens = $('#more_kittens').hide();

    $kittenOneButton = $kittenOne.find('button').show().off();
    $kittenTwoButton = $kittenTwo.find('button').show().off();

    $kittenOneFigure = $kittenOne.find('figure');
    $kittenTwoFigure = $kittenTwo.find('figure');

    $kittenOneImg = $kittenOne.find('img');
    $kittenTwoImg = $kittenTwo.find('img');

    $('figure').removeClass('chosen_kitty');
    $('figure').removeClass('unchosen_kitty');

    //Sets event handler for moreKittens button
    $moreKittens.on('click', $.proxy(function() {
      this.setPhotos(kittenOne, kittenTwo);
    }, this));


    //Gets two different random kittens, makes sure they are new, stores them in variables.
    do {
      kittenOne = this.getRandomPhoto();
    } while (kittenOne === oldKittenOne || kittenOne === oldKittenTwo)
    do {
      kittenTwo = this.getRandomPhoto();
    } while (kittenTwo === oldKittenOne || kittenTwo === oldKittenTwo || kittenOne === kittenTwo);

    showOpinions = function() {
      $kittenOneButton.hide();
      $kittenTwoButton.hide();

      $userOpinions.show();
      $kittenOne.find('span').text('Votes for this kitty: ' + kittenOne.score);
      $kittenTwo.find('span').text('Votes for this kitty: ' + kittenTwo.score);
    }

    voteKittenOne = function() {
      console.log(kittenOne);
      kittenOne.score ++;
      $kittenOneFigure.addClass('chosen_kitty');
      $kittenTwoFigure.addClass('unchosen_kitty');
      showOpinions();
      $moreKittens.show();
      $kittenOneImg.off();
      $kittenTwoImg.off();
    }

    voteKittenTwo = function() {
      console.log(kittenTwo);
      kittenTwo.score ++;
      $kittenTwoFigure.addClass('chosen_kitty');
      $kittenOneFigure.addClass('unchosen_kitty');
      showOpinions();
      $moreKittens.show()
      $kittenOneImg.off();
      $kittenTwoImg.off();
    }

    //Puts links to the photos in the proper places.
    $kittenOneImg.attr('src', kittenOne.link).on('click', voteKittenOne);
    $kittenTwoImg.attr('src', kittenTwo.link).on('click', voteKittenTwo);


    $kittenOneButton.on('click', voteKittenOne);
    $kittenTwoButton.on('click', voteKittenTwo);

  }

  tracker = new Tracker();

  //Loop to add all the Photo() objects holding the kittens to tracker.
  for (var i = 1; i <= 14; i++) {
    tracker.addPhoto(new Photo('kittens/'+ i + '.jpg'));
  }

  tracker.setPhotos();

})());


