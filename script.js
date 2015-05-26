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

  Tracker.prototype.setPhotos = function() {
    var $moreKittens, $kittenOne, $kittenTwo, $userOpinions, kittenOne, kittenTwo, showOpinions;

    $kittenOne = $('#kitten_1');
    $kittenTwo = $('#kitten_2');

    $userOpinions = $('.user_opinion').hide();
    $moreKittens = $('#more_kittens').hide();

    $kittenOne.find('button').show().off();
    $kittenTwo.find('button').show().off();

    $('figure').removeClass('chosen_kitty');

    $moreKittens.on('click', $.proxy(function() {
      this.setPhotos();
    }, this));

    kittenOne = this.getRandomPhoto();
    do {
      kittenTwo = this.getRandomPhoto();
    } while (kittenOne === kittenTwo);

    //Puts links to the photos in the proper places.

    $kittenOne.find('img').attr('src', kittenOne.link);
    $kittenTwo.find('img').attr('src', kittenTwo.link);

    showOpinions = function() {
      $kittenOne.find('button').hide();
      $kittenTwo.find('button').hide();

      $userOpinions.show();
      $kittenOne.find('span').text('Votes for this kitty: ' + kittenOne.score);
      $kittenTwo.find('span').text('Votes for this kitty: ' + kittenTwo.score);
    }

    $kittenOne.find('button').on('click', function() {
      console.log(kittenOne);
      kittenOne.score ++;
      $kittenOne.find('figure').addClass('chosen_kitty');
      showOpinions();
      $moreKittens.show();
    });

    $kittenTwo.find('button').on('click', function() {
      console.log(kittenTwo);
      kittenTwo.score ++;
      $kittenTwo.find('figure').addClass('chosen_kitty');
      showOpinions();
      $moreKittens.show()
    });

  }

  tracker = new Tracker();

  //Loop to add all the Photo() objects holding the kittens to tracker.
  for (var i = 1; i <= 14; i++) {
    tracker.addPhoto(new Photo('kittens/'+ i + '.jpg'));
  }

  tracker.setPhotos();

})());


