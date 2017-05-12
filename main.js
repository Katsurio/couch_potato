/**
 * Created by Katsurio on 5/10/17.
 */
/**
 * @function - Blahs and whatnot...
 * @name - whimsicalHorseGallop
 * @param {String} saddle - A string that contains blah....
 * @param {String[]} reigns - An array of strings that uhbluhs...
 * @return {String[]} - Returns an array of strings that contain hullah bahloo...
 */

/**
 * @var
 * All the global variables
 */
// Booze API variables
var globalResult,
    drinkName = null,
    instructions = null,
    drinkImage = null,
    drinkIngredients = [],
    ingredientMeasures = [],
// Movie API variables
    mediaRes,
    mood = '',
    mediaTitle = null,
    mediaDate = null,
    mediaGenre = null,
    mediaPoster = null,
    mediaDescr = null,
    mediaIDVideo = null,
    mediaID = null,
    TMDBurl = "http://image.tmdb.org/t/p/w185/",
    mediaGenreKey = [
    {"id": 28, "name": "Action"},
    {"id": 12, "name": "Adventure"},
    {"id": 16, "name": "Animation"},
    {"id": 35, "name": "Comedy"},
    {"id": 80, "name": "Crime"},
    {"id": 99, "name": "Documentary"},
    {"id": 18, "name": "Drama"},
    {"id": 10751, "name": "Family"},
    {"id": 14, "name": "Fantasy"},
    {"id": 36, "name": "History"},
    {"id": 27, "name": "Horror"},
    {"id": 10402, "name": "Music"},
    {"id": 9648, "name": "Mystery"},
    {"id": 10749, "name": "Romance"},
    {"id": 878, "name": "Science Fiction"},
    {"id": 10770, "name": "TV Movie"},
    {"id": 53, "name": "Thriller"},
    {"id": 10752, "name": "War"},
    {"id": 37, "name": "Western"}
],
// Youtube API variables
    player,
// Mood select check variables
    _1stClicked = null,
    _2ndClicked = null,
//Google Places API ariables
    userLocation = null,
    emotionKeyword = '',
    userLongLat = null,
    restaurantLoopList = null,
    restaurantFinalId = null,
    restaurantResults = [];

/**
 * @function - Initiates an AJAX call to CocktailDB for a random drink
 * @name - drinkAjaxCall
 */
function drinkAjaxCall() {
    $.ajax({
        dataType: 'json',
        url: 'http://www.thecocktaildb.com/api/json/v1/' + apiKeys.cocktailDb + '/random.php',
        type: 'get',
        success: function(result) {
            console.log('CocktailDB AJAX Call Success!!!');
            globalResult = result;
            drinkName = globalResult.drinks[0].strDrink;
            instructions = globalResult.drinks[0].strInstructions;
            drinkImage = globalResult.drinks[0].strDrinkThumb;
            drinkIngredients = [];
            ingredientMeasures = [];

            for(var i = 1; i < 16; i++) {
                var ingredient = 'strIngredient' + i;
                if(globalResult.drinks[0][ingredient] !== '' && globalResult.drinks[0][ingredient] !== null) {
                    drinkIngredients.push(globalResult.drinks[0][ingredient]);
                    var measure = 'strMeasure' + i;
                    ingredientMeasures.push(globalResult.drinks[0][measure]);
                }
            }
            console.log('DRINK NAME: ' +  drinkName + ' INSTRUCTIONS: ' + instructions + ' DRINK IMAGE: ' + drinkImage + ' DRINK INGREDIENTS: ' + drinkIngredients + ' INGREDIENT MEASURES: ' + ingredientMeasures);
            attachDrinkToDom();
        }
    });
}


/** TODO: Finish JSDoc
 * @function - Checks the input value on submit from the mood select modal
 * @name - mediaMood
 */
function mediaMood() {
    var pugtato = $("label[class=selected]")[0].htmlFor;
    switch(pugtato) {
        case 'Happy':
            mood = 35;
            break;
        case 'Sad':
            mood = 18;
            break;
        case 'Angry':
            mood = 28;
            break;
        case 'Poo':
            mood = 10770;
            break;
        case 'Tired':
            mood = 99;
            break;
        case 'Unicorny':
            mood = 10749;
            break;
        case 'Goofy':
            mood = 12;
            break;
        case 'Scared':
            mood = 27;
            break;
        default:
            mood = '';
            break;
    }
}

/**
 * @function - Initiates an AJAX call to The Movie DB for a movie choice
 * @name - TMDBajax
 */
// loops through each object in the array,finds the corresponding id, and returns lookup table/array
function TMDBajax () {
    mediaMood();
    $.ajax({
        dataType: 'json',
        url: "https://api.themoviedb.org/3/discover/movie?with_genres=" + mood + "&sort_by=popularity.desc&primary_release_date.gte=1927-09-15&primary_release_date.lte=2017-2-23&api_key=" + apiKeys.TMDB,
        api_key: apiKeys.TMDB,
        type: 'get',
        success: function(result) {
            mediaRes = result;
            var selectedMedia = Math.floor(Math.random() * 20) + 1;

            mediaTitle = mediaRes.results[selectedMedia].title;
            mediaDate = mediaRes.results[selectedMedia].release_date;
            mediaDescr = mediaRes.results[selectedMedia].overview;
            mediaPoster = mediaRes.results[selectedMedia].poster_path;
            mediaID = mediaRes.results[selectedMedia].id;

            for(var i = 0; i < mediaGenreKey.length; i++){
                if(mediaGenreKey[i]['id'] === mood){
                    mediaGenre = mediaGenreKey[i]['name'];
                }
            }
            $.ajax({
                data: 'json',
                url: "https://api.themoviedb.org/3/movie/" + mediaID + "/videos?language=en-US&api_key=" + apiKeys.TMDB,
                type: "get",
                success: function (res) {
                    mediaIDVideo = res.results[0]['key'];
                }
            });
            appendMedia();
        }
    });
}

/**
 * @function - Creates DOM elements and attaches the information pulled from The Movie DB
 * @name - appendMedia
 */

var mediaDivArr = [];
function appendMedia () {
    mediaDate = "(" + (mediaDate.slice(0, 4)) + ")";
    var mediaPosterDiv = $('<img>').attr('src', TMDBurl + mediaPoster).addClass('posterDiv'),
        mediaTitleDiv = $('<div>').addClass('titleDiv').text(mediaTitle),
        mediaDateDiv = $('<div>').addClass('dateDiv').text(mediaDate),
        mediaDescrDiv = $('<div>').addClass('descrDiv').text(mediaDescr),
        mediaGenreDiv = $('<div>').addClass('genreDiv').text(mediaGenre),
        trailerBtn = $('<button type="button" class="btn btn-primary trailerBtn"><span class="glyphicon glyphicon-play"></span>  Play Trailer</button>');
        mediaDivArr.push(mediaTitleDiv, mediaDateDiv, mediaGenreDiv, mediaDescrDiv, mediaPosterDiv, trailerBtn);
        mediaDiv = $('<div>').append(mediaDivArr);
    $('.mediaModalBody').append(mediaDiv);
    $('.trailerBtn').click(showAndPlayYtVid);
    // $('#mediaModal .close').on('click', function () {
    //     $('#pug').addClass('tada');
    // });
}

/**
 * @function - Automagically invoked by YT API. Acts as a callback for when the YT iFrame's ready.
 * @name - attachDrinkToDom
 */
function onYouTubeIframeAPIReady()
{
    player = new YT.Player('yt-player', {
        height: '390',
        width: '640',
        // Set the id of the video to be played
        videoId: 'Pukw8Ovl6Tc',
        // Setup event handlers
        events: {
            'onError': onError
        }
    });
}

/**
 * @function - Handles YT API error(s)
 * @name onError
 * @param {Object} error
 */
function onError(error)
{
    // Update errors on page
    console.log('ERROR: ' + error);
}

/**
 * @function - Shows YT player and plays vid when invoked
 * @name - showAndPlayYtVid
 */
function showAndPlayYtVid()
{
    $(mediaDiv).empty();
    console.log("Line 206: function showAndPlayYtVid() invoked");
    $('.yt-player-container').toggleClass('hidden_vid');
    player.loadVideoById(mediaIDVideo);
}

/**
 * @function - Creates DOM elements and attaches the information pulled from CocktailDB to them
 * @name - attachDrinkToDom
 */
function attachDrinkToDom() {
    // var randomDrinkDiv = $('<div>').addClass('container thumbnail').css({'text-align': 'center'});
    var drinkImageImg = $('<img>').attr('src', drinkImage).css({'height': '35vmin', 'width': '35vmin'}),
        captionDiv = $('<div>').addClass('caption'),
        drinkNameH3 = $('<h3>').text(drinkName),
        howToMakeH3 = $('<h4>').text('How to make the drink:').css({'line-height': '3', 'font-weight': '500'}),
        drinkInstructionsH4 = $('<h4>').text(instructions),
        drinkIngredientsH3 = $('<p>').text('What you\'ll need:').css({'line-height': '3', 'font-weight': '500'});
    $('#drinkModalInfoDiv').append(drinkImageImg, captionDiv, drinkNameH3, howToMakeH3, drinkInstructionsH4, drinkIngredientsH3);

    for(var i = 0; i < drinkIngredients.length; i++) {
        var newIngredientH4 = $('<h4>');
        if(ingredientMeasures[i] === "" || ingredientMeasures[i].length <= 1) {
            newIngredientH4.text(drinkIngredients[i]);
        } else {
            newIngredientH4.text(ingredientMeasures[i] + " " + drinkIngredients[i]);
        }
        $('#drinkModalInfoDiv').append(newIngredientH4);
    }
}

/**
 * @function - Creates mood select modal elements and attaches to the DOM
 * @name - createModalFormButtons
 */
function createModalFormButtons ()
{
    var i, temp, url, input_radio, img, label, text,
        moods = [
        ["Happy", "images/happyEmoji.png"],
        ["Sad", "images/sadEmoji.png"],
        ["Angry", "images/angryEmoji.png"],
        ["Poo", "images/pooEmoji.png"],
        ["Tired", "images/tiredEmoji.png"],
        ["Unicorny", "images/unicornEmoji.png"],
        ["Goofy", "images/goofyEmoji.png"],
        ["Scared", "images/scaredEmoji.png"]
    ];
    for (i = 0; i < moods.length; i++)
    {
        temp = moods[i];
        url = moods[i][1];
        input_radio = $("<input type='radio'/>")
            .attr({"value" : temp[0]}, {"id" : temp[0]}, {"name" : "radOption"});
        img = $("<img>").attr('src', url);
        text = $('<span>').text(temp[0]);
        label = $('<label>').attr('for', temp[0]).append(img, '<br>', text);
        $('.mood-group-container').append(input_radio, label);
    }
    $('.mood-group-container input:radio').addClass('hidden');
}

/**
 * @function - Ensures that only 1 mood radio button is selected
 * @name - selectMoodClickHandler
 */
function selectMoodClickHandler ()
{
    // $('.mood-group-container label').click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');
    // });
    $("#google-icon").show();
}

/**
 * @function - Pulls data from the Emoji modal to pass into the Google Places query string
 * @name - foodTypePicker
 */
function foodTypePicker() {
    var pugtato = $("label[class=selected]")[0].htmlFor;
    switch(pugtato)
    {
        case 'Happy':
            emotionKeyword = 'mexican';
            break;
        case 'Sad':
            emotionKeyword = 'chinese';
            break;
        case 'Angry':
            emotionKeyword = 'thai';
            break;
        case 'Poo':
            emotionKeyword = 'fast food';
            break;
        case 'Tired':
            emotionKeyword = 'pizza';
            break;
        case 'Unicorny':
            emotionKeyword = 'italian';
            break;
        case 'Goofy':
            emotionKeyword = 'desserts';
            break;
        case 'Scared':
            emotionKeyword = 'korean';
            break;
        default:
            emotionKeyword = '';
            break;
    }
}

/**
 * @function - Initiates a series of AJAX calls to Google Places for the top three restaurant around the user that is currently open and delivers
 * @name - restaurantAjaxCall
 */
function restaurantAjaxCall() {
    var userLongLatUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + userLocation + '&key=' + apiKeys.googlePlace;
    $.ajax({
        dataType: 'json',
        url: userLongLatUrl,
        api_key: apiKeys.googlePlace,
        type: 'get',
        success: function(result) {
            console.log('LongLat Success!!!');
            foodTypePicker();
            userLongLat = result.results[0].geometry.location.lat + "," + result.results[0].geometry.location.lng;
            var newGooglePlacesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + userLongLat + '&radius=3000&opennow&keyword=restaurant, ' + emotionKeyword + ', delivery, takeout&key=' + apiKeys.googlePlace;
            $.ajax({
                dataType: 'json',
                url: newGooglePlacesUrl,
                api_key: apiKeys.googlePlace,
                type: 'get',
                success: function(result) {
                    console.log('Google Places Success!!!');
                    restaurantLoopList = result;
                    for(var i = 0; i < 3; i++) {
                        var googlePlaceId = restaurantLoopList.results[i].place_id;
                        var newGooglePlaceId = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + googlePlaceId + '&key=' + apiKeys.googlePlace;
                        $.ajax({
                            dataType: 'json',
                            url: newGooglePlaceId,
                            api_key: apiKeys.googlePlace,
                            type: 'get',
                            success: function(result) {
                                restaurantFinalId = result;
                                var restaurantInfo = {
                                    name: restaurantFinalId.result.name,
                                    address: restaurantFinalId.result.formatted_address,
                                    phone: restaurantFinalId.result.formatted_phone_number,
                                    link: restaurantFinalId.result.url
                                };
                                restaurantResults.push(restaurantInfo);
                                console.log('Google PlaceID Success!');
                                attachRestaurantsToDom();
                            },
                            error: function() {
                                console.log('Google PlaceID fail')
                            }
                        })
                    }
                },
                error: function() {
                    console.log('Google Fail')
                }
            });
        },
        error: function() {
            console.log('LongLat Fail!!!');
        }
    });
}

/**
 * @function - Creates DOM elements and attaches the information pulled from Google Places to them
 * @name - attachRestaurantsToDom
 */
function attachRestaurantsToDom() {
    var restaurantNameH3 = $('<h3>').text(restaurantResults[restaurantResults.length-1].name),
        restaurantAddressH3 = $('<h3>').text(restaurantResults[restaurantResults.length-1].address),
        restaurantPhoneH3 = $('<h3>').text(restaurantResults[restaurantResults.length-1].phone),
        restaurantLinkAnchor = $('<a>').attr({'href': restaurantResults[restaurantResults.length-1].link, 'target': '_blank'}),
        restaurantLinkImg = $('<img src="images/googleMaps.png">').css({'height': '10vmin','width': '10vmin'});

    $('#foodModalInfoDiv').append(restaurantNameH3, restaurantAddressH3, restaurantPhoneH3, restaurantLinkAnchor);
    $(restaurantLinkAnchor).append(restaurantLinkImg);
}

//TODO: Finish JSDoc
/**
 * @function -
 * @name - locationSubmitBtn
 */
function locationSubmitBtn() {
    $('#locationSubmitBtn').on('click', function() {
        userLocation = $('#locationInput').val();
        console.log(userLocation);
        if(userLocation === "dandalf") {
            window.open("https://www.youtube.com/watch?v=ZRJfrwnvbCs");
            $('#locationInput').val('');
            return;
        }
        restaurantAjaxCall();
        $('#locationInput').val('');
    });
    $('#locationInput').on('keypress', function(e) {
        var keyPressed = e.charCode;
        if(keyPressed === 13) {
            e.preventDefault();
            userLocation = $('#locationInput').val();
            if(userLocation === "dandalf") {
                window.open("https://www.youtube.com/watch?v=ZRJfrwnvbCs");
                $('#locationInput').val('');
                return;
            }
            $('#foodModalInfoDiv > h3').empty();
            $('#foodModalInfoDiv > a').empty();
            restaurantAjaxCall();
            $('#locationInput').val('');
        }
    });
}

function resetApp() {
    $("#reset").click(function () {
        window.location.reload();
    });
}

/**
 * @function - click handler for TMDB Ajax call, passes in mood variable as genre id number
 * @name - moodSubmitClick
 */
function moodSubmitClick (){
    TMDBajax(mood);
}

//TODO: Finish JSDoc
/**
 * @function -
 * @name - popupClickHandler
 */
function popupClickHandler(){
    $('.popup').toggle();
}

/**
 * @function - Applies click handlers, creates DOM elements, and basically calls all the functions when invoked in the $(document).ready()
 * @name - applyClickHandlers
 */
function applyClickHandlers()
{
    $("#myModal").modal('show');
    createModalFormButtons();
    locationSubmitBtn();
    $('.mood-group-container label').click(selectMoodClickHandler);
    $('.submitBtn').click(moodSubmitClick).click(popupClickHandler);
    $('#pug').on('click', popupClickHandler);
    $('#google-icon').on('click', function() {
        $('#foodModal').modal('show');
    });
    resetApp();
    $('#dratini-glass').on('click', function() {
        $('#drinkModal').modal('show');
    });

    $('#mediaModal').on('hidden.bs.modal', function () {
        $("#mediaModalBody").empty();
    });
    // $('#mood-container').on('hidden.bs.modal', function () {
    //     $("").removeClass('selected');
    // });
    resetApp();
    drinkAjaxCall();
}

$(document).ready(applyClickHandlers);
