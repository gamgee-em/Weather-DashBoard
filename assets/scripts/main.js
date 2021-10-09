console.log('js connected');
// MAIN.JS
let userSearch = $('#user-search');
let searchBtn = $('#search-btn');
let ulEl = $('<ul>');
let liEl = $('<li>');
let historyBtn = $('history-btn');
let currentForecast = $('#current-forecast');
let clearBtn = $('.clear-results');
let searchResults = $('#search-results');

// use moment.js to get current Day/Date/Year/Time
let getDate =  moment().format('LLLL');
let userResults = 'Atlanta';
let userHistorySearch;
let searchHistory = [];

// doc ready function
$(document).ready(() => {
    // append search results as history 
    // if local storage
    console.log(localStorage.location)
    $('.current-city-name').html(userResults);

    if (localStorage) $('.search-history').append($('<br><span>')
    .attr('class', 'btn rounded history-list')
    .html(localStorage.location.value));


    // use async await to avoid needing to use mulitple promise chains
    // allows for more concise syntax 😍 
     async function getCoords(city) {
        // concat cityInput w/ obj literal to url query
        const coordsRequest = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=84d61ff029585a95fbd34cf405a10229`;
        // combined varibales for single variable call I enjoy this syntax
        const coordsData = await (await fetch(coordsRequest)).json();
        let coords = coordsData.coord;
        // COORDS OBJ
        let coordsObj = {
            lat: coords.lat,
            lon: coords.lon
        };
        const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordsObj.lat}&lon=${coordsObj.lon}&units=imperial&exclude=minutely,hourly&appid=84d61ff029585a95fbd34cf405a10229`;
        const oneCallData = await (await fetch(oneCallRequest)).json();
        // CURRENT OBJ
        const oneCallCurrentKey = oneCallData.current;
        // WINDSPEED / HUMIDITY / TEMP / UVI
        const oneCallCurrentObj = {
            windSpeed: oneCallCurrentKey.wind_speed,
            humidity: oneCallCurrentKey.humidity,
            temp: oneCallCurrentKey.temp,
            uvi: oneCallCurrentKey.uvi
        };
        
        // DAILY OBJ
        const oneCallDailyKey = oneCallData.daily;
        const oneCallDailyObj = {
            humidity: oneCallDailyKey,
            icon: oneCallDailyKey
        };
        // deconstruct 'oneCallCurrentKey' object to access 'weather' key in oneCallCurrentKey
        // WEATHER OBJ
        const weatherKey = oneCallCurrentKey.weather[0];
        const weatherObj = {
            description: weatherKey.description,
            icon: weatherKey.icon,
            main: weatherKey.main
        };

        // WEATHER
        globalWeatherObj = weatherObj;
        // CURRENT
        globalOneCallCurrentObj = oneCallCurrentObj;
        // DAILY
        globalOneCallDailyObj = oneCallDailyKey;

        renderPage()
    };
    getCoords('atlanta');
    // build html
    function renderPage() {
   
 
        // current weather card
        // add city to card
        // add icon to card
        $('.current-icon').attr({
            src: `https://openweathermap.org/img/wn/${globalWeatherObj.icon}@2x.png`,
            alt: 'Weather icon representing the current weather conditions'
        });

        // add weather elements to card
        $('.current-icon').html(userResults);
        $('.current-temp').html(`Temp: ${globalOneCallCurrentObj.temp}&degF`);
        $('.current-humidity').html(`Humidity: ${globalOneCallCurrentObj.humidity}%`);
        $('.current-wind-speed').html(`Wind Speed: ${globalOneCallCurrentObj.windSpeed}mph`);
        $('.current-uvi').html(`UVI: ${globalOneCallCurrentObj.uvi.toFixed(1)}`);
        
        if (globalOneCallCurrentObj.uvi <= 2.99) {
            $('.current-uvi').css('background-color', 'green');
        } else if (globalOneCallCurrentObj.uvi >= 3 && globalOneCallCurrentObj.uvi <= 5.99){
            $('.current-uvi').css('background-color', 'yellow');
        } else if (globalOneCallCurrentObj.uvi >= 6 && globalOneCallCurrentObj.uvi <= 7.99) {
            $('.current-uvi').css('background-color', 'orange');
        } else {
            $('.current-uvi').css('background-color', 'red');
        }
        // 5 day forcast card
        globalOneCallDailyObj.forEach((hour, i) => {
            $(`.day${i}`).html(moment([]).add(i, 'days').format('MM/DD/YY'));
            $(`.icon${i}`).attr('src', `https://openweathermap.org/img/wn/${globalOneCallDailyObj[i].weather[0].icon}@2x.png`);
            $(`.day${i}-temp`).html(`Temps: ${globalOneCallDailyObj[i].temp.day}&degF`);
            $(`.day${i}-humidity`).html(`Humidity: ${globalOneCallDailyObj[i].humidity}%`);
        })
        $('.city-5-day').text(userResults);
    }
    // ON CLICK search button event
    // get userSearch value for coordsRequest API


    searchBtn.on('click', (e) => {
        e.preventDefault();

        // format user input for url query 
        const userInput = $(userSearch).val().toLowerCase().trim();
        // make userSearch value all lowercase and trim any white space 
        // take userInput and capitalize first character for display
        userResults = userInput.charAt(0).toUpperCase().concat(userInput.slice(1));

        searchHistory.push(userInput);
        console.log(userInput)
        console.log(localStorage.location)
        if (searchHistory.length < 3) {
        $('.current-city-name').html(userResults)
        $('.search-history').append($('<br><span>').html(searchHistory[searchHistory.length - 1])
        .attr('class', 'btn rounded history-list'));
        }

        function setlocalStor(getLocation) {
            if (localStorage.length < 5) {
            localStorage.setItem('location',userResults);
            } 
        }
        
        function getLocalStor() {
            const getLocation = localStorage.getItem('location')
            setlocalStor(getLocation);
         }
        // call getLocalStor() to update value in search history when user refreshes page
        getLocalStor();
        // call getCoords and pass userInput in as a parameter
        getCoords(userInput);
    });

    //after search clear localstorage
    $('.clear-results').on('click', (e) => {
        e.preventDefault();
        localStorage.clear();

        $('.search-history').empty();

    });

    // HISTORY BUTTON EVENT
    $('.search-history').on('click', function(e) {
        e.preventDefault();
        console.log(searchHistory)
        let historyRequest = $('.search-history').val;
        console.log(historyRequest);
        getCoords(searchHistory);
    });
});