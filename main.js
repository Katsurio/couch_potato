/**
 * Created by Katsurio on 5/10/17.
 */
/** @function - Function that shuffles the cards' images.
 * @name shuffleCards
 * @param {String} cardBackImg - A strings that contains the path to the cards' back image.
 * @param {String[]} cardFaceImgs - An array of strings that contain the paths to the card faces' images.
 */

// Booze API Call
var globalResult;
var drinkName = null;
var instructions = null;
var drinkImage = null;
var drinkIngredients = [];
var ingredientMeasures = [];

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

/**
 * @function - Initiates an AJAX call to The Movie DB for a movie choice
 * @name - TMDBajax
 * @param {Number}
 */
// Movie/TV API Call

// loop through each object in the array and find the corresponding id, return lookup table/array

var mediaRes;
var mood = '';
var mediaTitle = null;
var mediaDate = null;
var mediaPoster = null;
var mediaGenres = null;
var mediaDescr = null;
var mediaIDVideo = null;
var mediaID = null;
var TMDBurl = "http://image.tmdb.org/t/p/w185/";
var mediaGenreKey = [
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
];

function mediaMood() {
    switch($('input[name=radOption]:checked').val()) {
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


function TMDBajax () {
    mediaMood();
    $.ajax({
        dataType: 'json',
        url: "https://api.themoviedb.org/3/discover/movie?with_genres=" + mood + "&sort_by=popularity.desc&vote_count.gte=10&primary_release_date.gte=1927-09-15&primary_release_date.lte=2017-2-23&api_key=" + apiKeys.TMDB,
        api_key: apiKeys.TMDB,
        type: 'get',
        success: function(result) {
            mediaRes = result;
            var selectedMedia = Math.floor(Math.random() * 10) + 1;

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
                    console.log(mediaIDVideo);
                    // onPlayerReady();
                }
            });
            appendMedia();
        }

    });

}

/** @function - Creates DOM elements and attaches the information pulled from The Movie DB
 * @name - appendMedia
 */
function appendMedia () {
    mediaDate = "(" + (mediaDate.slice(0, 4)) + ")";

    var mediaPosterDiv = $('<img>').attr('src', TMDBurl + mediaPoster).addClass('posterDiv');
    var mediaTitleDiv = $('<div>').addClass('titleDiv').text(mediaTitle);
    var mediaDateDiv = $('<div>').addClass('dateDiv').text(mediaDate);
    var mediaDescrDiv = $('<div>').addClass('descrDiv').text(mediaDescr);
    var mediaGenreDiv = $('<div>').addClass('genreDiv').text(mediaGenre);
    var trailerBtn = $('<button type="button" class="btn btn-primary">Play Trailer</button>');
    var mediaDiv = $('<div>').append(mediaTitleDiv, mediaDateDiv,  mediaGenreDiv, mediaDescrDiv, mediaPosterDiv, trailerBtn);
    $('.mediaModalBody').append(mediaDiv);
}

/** @function - Creates DOM elements and attaches the information pulled from CocktailDB to them
 * @name - attachDrinkToDom
 */
function attachDrinkToDom() {
    // var randomDrinkDiv = $('<div>').addClass('container thumbnail').css({'text-align': 'center'});
    var drinkImageImg = $('<img>').attr('src', drinkImage).css({'height': '35vmin', 'width': '35vmin'});
    var captionDiv = $('<div>').addClass('caption');
    var drinkNameH3 = $('<h3>').text(drinkName);
    var howToMakeH3 = $('<h3>').text('How to make the drink:').css({'line-height': '3', 'font-weight': '500'});
    var drinkInstructionsH4 = $('<h4>').text(instructions);
    var drinkIngredientsH3 = $('<h3>').text('What you\'ll need:').css({'line-height': '3', 'font-weight': '500'});

    $('#drinkModalInfoDiv').append(drinkImageImg)
        .append(captionDiv)
        .append(drinkNameH3)
        .append(howToMakeH3)
        .append(drinkInstructionsH4)
        .append(drinkIngredientsH3);

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

function createModalFormButtons ()
{
    var i,
        temp,
        url,
        input_radio,
        img,
        label,
        text;
    var moods = [
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
            .attr("value", temp[0])
            .attr("id", temp[0])
            .attr("name", "radOption");
        img = $("<img>").attr('src', url);
        text = $('<span>').text(temp[0]);
        label = $('<label>').attr('for', temp[0]).append(img, '<br>', text);
        $('.mood-group-container').append(input_radio, label);
    }
    $('.mood-group-container input:radio').addClass('hidden');
    $('.mood-group-container label').click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');
    });

}

//Google Places API
var userLocation = null;
var emotionKeyword = '';
var userLongLat = null;
var restaurantLoopList = null;
var restaurantFinalId = null;
var restaurantResults = [];

/** @function - Pulls data from the Emoji modal and puts in a specific query string into the Google Places search string
 * @name - foodTypePicker
 */
function foodTypePicker() {
    switch($('input[name=radOption]:checked').val()) {
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

/** @function - Initiates a series of AJAX calls to Google Places for the top three restaurant around the user that is currently open and delivers
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

/** @function - Creates DOM elements and attaches the information pulled from Google Places to them
 * @name - attachRestaurantsToDom
 */
function attachRestaurantsToDom() {
    var restaurantNameH3 = $('<h3>').text(restaurantResults[restaurantResults.length-1].name);
    var restaurantAddressH3 = $('<h3>').text(restaurantResults[restaurantResults.length-1].address);
    var restaurantPhoneH3 = $('<h3>').text(restaurantResults[restaurantResults.length-1].phone);
    var restaurantLinkAnchor = $('<a>').attr({'href': restaurantResults[restaurantResults.length-1].link, 'target': '_blank'});
    var restaurantLinkImg = $('<img src="images/googleMaps.png">').css({'height': '10vmin','width': '10vmin'});

    $('#foodModalInfoDiv').append(restaurantNameH3)
        .append(restaurantAddressH3)
        .append(restaurantPhoneH3)
        .append(restaurantLinkAnchor);
    $(restaurantLinkAnchor).append(restaurantLinkImg);
}

function locationSubmitBtn() {
    $('#locationSubmitBtn').on('click', function() {
        userLocation = $('#locationInput').val();
        restaurantAjaxCall();
        $('#locationInput').val('');
    });
    $('#locationInput').on('keypress', function(e) {
        var keyPressed = e.charCode;
        if(keyPressed === 13) {
            e.preventDefault();
            userLocation = $('#locationInput').val();
            $('#foodModalInfoDiv > h3').empty();
            $('#foodModalInfoDiv > a').empty();
            restaurantAjaxCall();
            $('#locationInput').val('');
        }
    });
}

function moodSubmitClick (){
    TMDBajax(mood);
}
function popupClickHandler(){
    $('.popup').toggle();
}

function applyClickHandlers()
{
    $("#myModal").modal('show');
    createModalFormButtons();
    locationSubmitBtn();
    $('.submitBtn').click(moodSubmitClick);
    $('.submitBtn').click(popupClickHandler);
    $('#pug').on('click', popupClickHandler);
    $('#google-icon').on('click', function() {
        $('#foodModal').modal('show');
    });
    // $('#google-icon').on('click', function() {
    //     $('#drinkModal').modal('show');
    // });
    drinkAjaxCall();

}

$(document).ready(applyClickHandlers);




// var player;
// // Callback for when the YouTube iFrame player is ready
// function onYouTubeIframeAPIReady()
// {
//     player = new YT.Player('yt-player', {
//         // Set Player height and width
//         height: '390',
//         width: '640',
//         // Set the id of the video to be played
//         videoId: 'Pukw8Ovl6Tc',
//         // Setup event handlers
//         events: {
//             // 'onReady': onPlayerReady,
//             'onError': onError
//         }
//     });
// }
// function onError(error)
// {
//     // Update errors on page
//     console.log('ERROR: ' + error);
// }
// function onPlayerReady()
// {
//     // Cue video after player is ready
//     player.cueVideoById(mediaIDVideo);
// }
