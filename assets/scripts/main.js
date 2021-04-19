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
let getDate = moment().format('LLLL');
let userResults = 'Atlanta';
let userInput;
let searchHistory = [];

// doc ready function
$(document).ready(() => {
    // append search results as history 
    // if local storage
    console.log(localStorage)
    $('.search-history').append($('<span>').attr('class', 'btn-primary').html(location));


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
        console.log(oneCallDailyKey)
        console.log(oneCallDailyKey[0].humidity)
        console.log(oneCallDailyKey[0].temp.day);

        // deconstruct 'oneCallCurrentKey' object to access 'weather' key in oneCallCurrentKey
        // WEATHER OBJ
        const weatherKey = oneCallCurrentKey.weather[0];
        console.log(weatherKey)
        const weatherObj = {
            description: weatherKey.description,
            icon: weatherKey.icon,
            main: weatherKey.main
        };
        console.log(weatherObj);

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
        // LIST ITEMS / HISTORY
        // this sets local storage 
        // now i need to get local storage and append to
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
 
        // current weather card
        // add city to card
        // add icon to card
        $('.current-icon').attr({
            src: `https://openweathermap.org/img/wn/${globalWeatherObj.icon}@2x.png`,
            alt: 'Weather icon representing the current weather conditions'
        });

        // add weather elements to card
        $('.current-city-name').html(userResults);
        $('.current-icon').html(userResults);
        $('.current-temp').html(`Temp: ${globalOneCallCurrentObj.temp}&degF`);
        $('.current-humidity').html(`Humidity: ${globalOneCallCurrentObj.humidity}%`);
        $('.current-wind-speed').html(`Wind Speed: ${globalOneCallCurrentObj.windSpeed}mph`);
        $('.current-uvi').html(`Index: ${globalOneCallCurrentObj.uvi.toFixed(1)}`);
        console.log(typeof(globalOneCallCurrentObj.uvi))
        
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
        console.log(globalOneCallDailyObj)

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
        userInput = $(userSearch).val().toLowerCase().trim();
        // make userSearch value all lowercase and trim any white space 
        // take userInput and capitalize first character for display
        userResults = userInput.charAt(0).toUpperCase().concat(userInput.slice(1));
        // call getCoords and pass userInput in as a parameter

        searchHistory.length <= 5 ?
        searchHistory.push(userResults) :
        console.log('search history full!')

        searchHistory.forEach((search, i) => { 
            console.log(search);
            if (!search.includes(userResults)) $('.search-history').append($('<span>').attr('class', 'btn ').html(search));

        });

        getCoords(userInput);
    });

    //after search clear localstorage
    $('.clear-results').on('click', () => {
        localStorage.clear();
    });

    // HISTORY BUTTON EVENT
    $('.history-btn').on('click', function() {
        userHistory = localStorage.getItem('location');
        userHistoryResults = userHistory.charAt(0).toUpperCase().concat(userHistory.slice(1));
        getCoords(userHistory);
    });
});