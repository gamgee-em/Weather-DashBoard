console.log('js connected');
 
let userSearch = $('#user-search');
let searchBtn = $('#search-btn');
searchBtn.addClass('bg-secondary').html('Search');
let currentForecast = $('#current-forecast');
// SEARCH RESULT LIST
let searchResults = $('#search-results');
let globalWeatherObj;
let globaloneCallCurrentObj;
let ulEl = $('<ul>');
let liEl = $('<li>');
// use moment.js to get current Day/Date/Year/Time
let getDate = moment().format('LLLL');
console.log(getDate)
// doc ready function
$(document).ready(() => {
    searchResults.append($('<ul>').addClass('list-group list-group-flush saved-search'));
    
    $('.saved-search').append($('<p>').addClass('list-group-item pl-1 city-name rounded'));
    $('.city-name').html('Search Results:');

    // use async await to avoid needing to use mulitple promise chains
    // allows for more concise syntax 😍 
     async function getCoords(city) {
        // concat cityInput w/ obj literal to url query
        const coordsRequest = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=84d61ff029585a95fbd34cf405a10229`;
        // combined varibales for single variable call I enjoy this syntax
        const coordsData = await (await fetch(coordsRequest)).json();
        let coords = coordsData.coord;
        let coordsObj = {
            lat: coords.lat,
            lon: coords.lon
        };
        console.log(coordsObj);

        const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordsObj.lat}&lon=${coordsObj.lon}&units=imperial&exclude=minutely,hourly&appid=84d61ff029585a95fbd34cf405a10229`;
        const oneCallData = await (await fetch(oneCallRequest)).json();
        // deconstruct 'oneCallCurrentKey' to access the 'current' key in oneCallData
        const oneCallCurrentKey = oneCallData.current;
        console.log(oneCallData);
        const oneCallCurrentObj = {
            windSpeed: oneCallCurrentKey.wind_speed,
            humidity: oneCallCurrentKey.humidity,
            temp: oneCallCurrentKey.temp,
            uvi: oneCallCurrentKey.uvi
        };
        globaloneCallCurrentObj = oneCallCurrentObj;
        console.log(oneCallCurrentObj);

        const oneCallDailyKey = oneCallData.daily;
        const oneCallDailyObj = {
            humidity: oneCallDailyKey[0].humidity,
            temp: oneCallDailyKey[0].temp,
            uvi: oneCallDailyKey[0].uvi
        };
        console.log(oneCallDailyObj.temp);

        // deconstruct 'oneCallCurrentKey' object to access 'weather' key in oneCallCurrentKey
        const weatherKey = oneCallCurrentKey.weather[0];
        const weatherObj = {
            description: weatherKey.description,
            icon: weatherKey.icon,
            main: weatherKey.main
        };
        globalWeatherObj = weatherObj;
        globaloneCallCurrentObj = oneCallCurrentObj;
        console.log(globaloneCallCurrentObj)

        renderPage()
    };

    // build html
    function renderPage() {
        //save value to localstorage later on
        // LIST ITEMS
        $('.city-name').append($('<li>').addClass('list-group-item pl-1 city-name btn bg-secondary rounded').html(userResults));
        // use toUpperCase on [0] index
        currentForecast.append($('<ul>').attr({
            id: 'current-forecast-list',
            class: 'list-group list-group-flush'
        }));

        //current weather card
        $('.current-weather-card').prepend($('<div>').attr('class','card-body card col-12 current-weather-items'));
        $('.current-weather-items').append($('<h4>').attr('class','date').html(getDate));
        //add city to card
        $('.date').after($('<h6>').attr('class', 'pl-1 image').html(`${userResults}`));
        // add icon to card
        $('.image').append($('<img>').attr({
            class: 'current-weather-icon',
            src: `https://openweathermap.org/img/wn/${globalWeatherObj.icon}.png`,
            alt: 'Weather icon representing the current weather'
        }));
        // add weather elements to card
        $('.image').after($('<p>').attr('class','pl-1').html(`Temp: ${globaloneCallCurrentObj.temp}&degF <br> Humidity: ${globaloneCallCurrentObj.humidity}% <br> Wind Speed: ${globaloneCallCurrentObj.windSpeed}mph <br> UV Index: ${globaloneCallCurrentObj.uvi}`));

    }
    // ON CLICK search button event
        // get userSearch value for coordsRequest API
        searchBtn.on('click', () => {
            // format user input for url query 
            // make userSearch value all lowercase and trim any white space 
            let userInput = $(userSearch).val().toLowerCase().trim();
            // take userInput and capitalize first character for display
            userResults = userInput.charAt(0).toUpperCase().concat(userInput.slice(1));
            // call getCoords and pass userInput in as a parameter
            getCoords(userInput);
        });
    
    function getLocalFunc() {

    }

});