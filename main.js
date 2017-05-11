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

function ajaxCall() {
    $.ajax({
        dataType: 'json',
        url: 'http://www.thecocktaildb.com/api/json/v1/1/random.php',
        type: 'get',
        success: function(result) {
            console.log('AJAX Call Success!!!');
            globalResult = result;
            drinkName = globalResult.drinks[0].strDrink;
            instructions = globalResult.drinks[0].strInstructions;
            drinkImage = globalResult.drinks[0].strDrinkThumb;
            drinkIngredients = [];
            ingredientMeasures = [];

            for(var i = 1; i < 16; i++) {
                var ingredient = 'strIngredient' + i;
                if(globalResult.drinks[0][ingredient] !== '') {
                    drinkIngredients.push(globalResult.drinks[0][ingredient]);
                    var measure = 'strMeasure' + i;
                    ingredientMeasures.push(globalResult.drinks[0][measure]);
                }
            }
            console.log('DRINK NAME: ' +  drinkName + ' INSTRUCTIONS: ' + instructions + ' DRINK IMAGE: ' + drinkImage + ' DRINK INGREDIENTS: ' + drinkIngredients + ' INGREDIENT MEASURES: ' + ingredientMeasures);
        }
    });
}

// Movie/TV API Call

// loop through each object in the array and find the corresponding id, return lookup table/array

var mediaRes;
var mediaTitle = null;
var mediaDate = null;
var mediaPoster = null;
var mediaGenres = null;
var mediaDescr = null;
var mediaActors = [];
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

function TMDBAjax (genre) {
    $.ajax({
        dataType: 'json',
        url: "https://api.themoviedb.org/3/discover/movie?with_genres=" + genre + "&sort_by=vote_average.desc&vote_count.gte=10&api_key=72c2461a868b47b346d72e43036bfb70",
        api_key: '72c2461a868b47b346d72e43036bfb70',
        type: 'get',
        success: function(result) {
            console.log("In AJAX:", result);
            mediaRes = result;
            mediaTitle = mediaRes.results[0].title;
            mediaDate = mediaRes.results[0].release_date;
            mediaDescr = mediaRes.results[0].overview;
            mediaPoster = mediaRes.results[0].poster_path;

            for(var i = 0; i < mediaGenreKey.length; i++){
                if(mediaGenreKey[i]['id'] === genre){
                    mediaGenre = mediaGenreKey[i]['name'];
                }
            }

            appendMedia();
        }

    });

}

function appendMedia () {
    var mediaUrl = $('<img>').attr('src', TMDBurl + mediaPoster);
    var mediaDiv = $('<div>').append(mediaTitle, mediaDate, mediaDescr, mediaUrl, mediaGenre);
    $('body').append(mediaDiv);
}
