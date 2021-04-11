console.log('js connected');
 
let userSearch = $('#user-search');
let searchBtn = $('#search-btn');
searchBtn.addClass('bg-secondary').html('Search');
let currentForecast = $('#current-forecast');
let globalWeatherObj;
let globalOneCallObj;
let ulEl = $('<ul>');
let liEl = $('<li>');
// use moment.js to get current Day/Date/Year/Time
let getDate = moment().format('LLLL');
console.log(getDate)
// doc ready function
$(document).ready(() => {

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

        const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordsObj.lat}&lon=${coordsObj.lon}&units=imperial&exclude=minutely,hourly,daily&appid=84d61ff029585a95fbd34cf405a10229`;
        const oneCallData = await (await fetch(oneCallRequest)).json();
        // deconstruct 'oneCallKey' to access the 'current' key in oneCallData
        const oneCallKey = oneCallData.current;
        console.log(oneCallKey);

        const oneCallObj = {
            windSpeed: oneCallKey.wind_speed,
            humidity: oneCallKey.humidity,
            temp: oneCallKey.temp,
            uvi: oneCallKey.uvi
        };
        globalOneCallObj = oneCallObj;
        console.log(oneCallObj);

        // deconstruct 'oneCallKey' object to access 'weather' key in OneCallKey
        const weatherKey = oneCallKey.weather[0];
        const weatherObj = {
            description: weatherKey.description,
            icon: weatherKey.icon,
            main: weatherKey.main
        };
        globalWeatherObj = weatherObj;
        globalOneCallObj = oneCallObj;
        console.log(globalOneCallObj)

        renderPage()
    };

     function renderPage() {
        // add class & append <li>
        let searchResults = $('#search-results');

        searchResults.append($('<ul>').addClass('list-group list-group-flush saved-search'));
        //save value to localstorage later on
        $('.saved-search').prepend($('<li>').addClass('list-group-item pl-1 city-name btn bg-secondary rounded').html(userResults));
        // use toUpperCase on [0] index
        currentForecast.append($('<ul>').attr({
            id: 'current-forecast-list',
            class: 'list-group list-group-flush'
        }));

        // recreate current weather card from dom
        /* $('.search-area').append($('<div>').attr('class')) */

        $('#current-forecast-list').append($('<h4>').attr('class','list-group-item pl-1 date').html(getDate));

        $('#current-forecast-list').append($('<li>').attr('class', 'list-group-item pl-1 image').html(`${userResults}`));
        // add icon need to fix position later
        $('.image').append($('<img>').attr({
            class: 'current-weather-icon',
            src: `https://openweathermap.org/img/wn/${globalWeatherObj.icon}.png`,
            alt: 'Weather icon representing the current weather'
        }));

        $('.current-weather-icon').after($('<p>').attr('class','pl-1').html(`Temp: ${globalOneCallObj.temp} <br> Humidity: ${globalOneCallObj.humidity}% <br> Wind Speed: ${globalOneCallObj.windSpeed}mph <br> UV Index: ${globalOneCallObj.uvi}`));

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