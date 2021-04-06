console.log('js connected');
let requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=39.9526&lon=75.1652&lang=en&appid=84d61ff029585a95fbd34cf405a10229';
// CONTAINER
let containerDiv = $('.custom-container');
containerDiv.addClass('d-flex col-12');
// NAV
let navEl = $('nav');
navEl.attr({
    id: 'nav-container',
    class: 'container d-flex custom-container row'
});
navEl.prepend('<input>');
// MAIN
let mainEl = $('main');
// INPUT
let searchInput = $('input');
searchInput.attr({
    type: 'text',
    // USER INPUT SEARCH BAR
    id: 'user-input',
    class: 'col-9',
    placeholder: 'Enter City'
});

// SEARCH BUTTON
navEl.append($('<div>')
.attr('class', 'container d-inline-flex search-btn col-2'));
let searchBtn = $('.search-btn');
searchBtn.append($('<span>').attr('class','d-flex justify-content-start input-btn btn row').text('Search'));
let inputBtn = $('.input-btn');
let resultList = [];
navEl.append($('<ul>').attr('id','result-list'));

// ON CLICK search button
// show ul with search results in li
searchBtn.on('click', function() {
    if(resultList.length === 0) {
    resultList = $('#result-list');
    resultList.append($('<li>').text('it works!'));


    console.log('user clicked search btn');
    }
})

mainEl.attr('class','row container')
mainEl.append($('<div>').attr('class', 'widget-container col-12'));

// API REQUEST
/* fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
 */
console.log(requestUrl);