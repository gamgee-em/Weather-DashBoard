console.log('js connected');
// MAIN.JS
let userSearch = $('#user-search');
let searchBtn = $('#search-btn');
searchBtn.addClass('bg-secondary').html('Search');
searchBtn.after($('<span>').attr('class','btn bg-light clear-results').html('Clear'));
let currentForecast = $('#current-forecast');

// SEARCH RESULT LIST
let searchResults = $('#search-results');
$('.bg-primary').addClass('hide');
let ulEl = $('<ul>');
let liEl = $('<li>');

// use moment.js to get current Day/Date/Year/Time
let getDate = moment().format('LLLL');
console.log(getDate)

// doc ready function
$(document).ready(() => {
    searchResults.append($('<ul>').addClass('list-group list-group-flush saved-search'));
    $('.saved-search').append($('<p>').addClass('list-group-item pl-1 city-name rounded'));
    $('.saved-search').html('Results:');
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
        console.log(coordsObj);

        const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordsObj.lat}&lon=${coordsObj.lon}&units=imperial&exclude=minutely,hourly&appid=84d61ff029585a95fbd34cf405a10229`;
        const oneCallData = await (await fetch(oneCallRequest)).json();
        // deconstruct 'oneCallCurrentKey' to access the 'current' key in oneCallData
        console.log(oneCallData);

        // CURRENT OBJ
        const oneCallCurrentKey = oneCallData.current;
        const oneCallCurrentObj = {
            windSpeed: oneCallCurrentKey.wind_speed,
            humidity: oneCallCurrentKey.humidity,
            temp: oneCallCurrentKey.temp,
            uvi: oneCallCurrentKey.uvi
        };
        console.log(oneCallCurrentObj);
        
        // DAILY OBJ
        const oneCallDailyKey = oneCallData.daily;
        const oneCallDailyObj = {
            humidity: oneCallDailyKey,
        };
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

        console.log(globalOneCallDailyObj)
        renderPage()
    };

    // build html
    function renderPage() {
        // LIST ITEMS / HISTORY
        if (localStorage.length > 0) {
            console.log('ls present');
            console.log();
            $('.saved-search').append($('<button>').addClass('bg-secondary btn rounded').html(userResults));
        }
   
        currentForecast.append($('<h6>').attr({
            id: 'current-forecast-list',
            class: 'list-group list-group-flush'
        }));

        // current weather card
        $('.current-weather-card').prepend($('<div>').attr('class','card-body card col-12 current-weather-items'));
        $('.current-weather-items').append($('<h4>').attr('class','date').html(getDate));
        //add city to card
        $('.date').after($('<h6>').attr('class', 'pl-1 image').html(userResults));
        // add icon to card
        $('.image').append($('<img>').attr({
            class: 'current-weather-icon',
            src: `https://openweathermap.org/img/wn/${globalWeatherObj.icon}.png`,
            alt: 'Weather icon representing the current weather'
        }));

        // add weather elements to card
        $('.image').append($('<p>').attr('class','pl-1').html(`Temp: ${globalOneCallCurrentObj.temp}&degF <br> Humidity: ${globalOneCallCurrentObj.humidity}% <br> Wind Speed: ${globalOneCallCurrentObj.windSpeed}mph <br> UV Index: ${globalOneCallCurrentObj.uvi}`));

        // 5 day forcast card
        $('.city-5-day').text(userResults);
        $('.day0-weather').html(`Temps: ${globalOneCallDailyObj[0].temp.day}&degF <br> Humidity: ${globalOneCallDailyObj[0].humidity}`);
        $('.day1-weather').html(`Temps: ${globalOneCallDailyObj[1].temp.day}&degF <br> Humidity: ${globalOneCallDailyObj[1].humidity}`);
        $('.day2-weather').html(`Temps: ${globalOneCallDailyObj[2].temp.day}&degF <br> Humidity: ${globalOneCallDailyObj[2].humidity}`);
        $('.day3-weather').html(`Temps: ${globalOneCallDailyObj[3].temp.day}&degF <br> Humidity: ${globalOneCallDailyObj[3].humidity}`);
        $('.day4-weather').html(`Temps: ${globalOneCallDailyObj[4].temp.day}&degF <br> Humidity: ${globalOneCallDailyObj[4].humidity}`);

    }
        // ON CLICK search button event
        // get userSearch value for coordsRequest API
        searchBtn.on('click', () => {
            $('.bg-primary').removeClass('hide');
            
                let name = $(userSearch).val();
                console.log(name)
                
                localStorage.setItem('location', name);     
            
            // format user input for url query 
            // make userSearch value all lowercase and trim any white space 
            let userInput = $(userSearch).val().toLowerCase().trim();
            // take userInput and capitalize first character for display
            userResults = userInput.charAt(0).toUpperCase().concat(userInput.slice(1));
            // call getCoords and pass userInput in as a parameter
            getCoords(userInput);

            $('.clear-results').on('click', () => {
                /* $('.container').empty();
 */         
            });
        });
});

