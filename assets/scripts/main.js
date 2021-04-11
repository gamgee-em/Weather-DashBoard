console.log('js connected');
 
let userSearch = $('#user-search');
let searchBtn = $('#search-btn');
let searchResults = $('#search-results');
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
        console.log(globalOneCallObj)
    };
   // ON CLICK search button event
    // get userSearch value for coordsRequest API
    searchBtn.on('click', () => {
        console.log(globalWeatherObj)
        console.log(globalOneCallObj);
        // format user input for url query 
        // make userSearch value all lowercase and trim any white space 
        let userInput = $(userSearch).val().toLowerCase().trim();
        // take userInput and capitalize first character for display
        userResults = userInput.charAt(0).toUpperCase().concat(userInput.slice(1));

        console.log(userResults);
        // add class & append addChild <li>
        searchResults.after((ulEl).addClass('list-group list-group-flush').append(liEl));
        liEl.addClass('list-group-item pl-1').text(userResults);
        // use toUpperCase on [0] index
        currentForecast.text(userResults);
        currentForecast.next().attr('id', 'current-forecast-list');
        const currentForecastList = $('#current-forecast-list');
        // add date using moment.js
        currentForecastList.prepend($('<li>').attr('class','list-group-item pl-1').html(getDate));
        // I need to be able to access the weatherObj & oneCallObj object keys & values
/*         currentForecastList.append((liEl).html(oneCallObj.humidity));
 */        //pass userInput to getCoords function and pass city param into coordsRequest url query
        getCoords(userInput);
    });

});