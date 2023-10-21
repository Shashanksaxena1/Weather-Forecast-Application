const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempeEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const API_KEY = 'SG0vDz6TMeVpAAuIun9OsTa2cflGJaV6';
var city = "Bangalore"
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hours = time.getHours();
    const hoursIn12HourFormat = hours >= 13 ? hours % 12 : hours
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HourFormat < 10 ? '0' + hoursIn12HourFormat : hoursIn12HourFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

getWeatherData(city)

function getWeatherData(city) {
    navigator.geolocation.getCurrentPosition((success) => {
        var key = "1-204108_1_AL";
        fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`).then(res => res.json()).then(data => {
            console.log(data[0].Key);
            key = data[0].Key
            getData(key)
            fiveDayweather(key)
        })
    })
}


function getData(key) {
    fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=${API_KEY}`).then(res => res.json()).then(data => {
        showWeatherData(data);
    })
}

function showWeatherData(data) {
    var Headline = data.Headline.Text;
    var min_temp = (((data.DailyForecasts[0].Temperature.Minimum.Value) - 32) * 0.555).toFixed(2);
    var max_temp = (((data.DailyForecasts[0].Temperature.Maximum.Value) - 32) * 0.555).toFixed(2);
    var daytime = data.DailyForecasts[0].Day.IconPhrase;
    var nighttime = data.DailyForecasts[0].Night.IconPhrase;
    var num = data.DailyForecasts[0].Day.Icon;
    if (num < 10) {
        num = "0" + String(num);
    }
    currentWeatherItemsEl.innerHTML =
        `
    <div class="main-container">
    <img class="w-icon" width="50%" src="https://developer.accuweather.com/sites/default/files/${num}-s.png">
    <div>
    <div class="weather-items">
        <div><b><h1><u>${city.slice(0,1).toUpperCase()+city.slice(1,)}</h1></b></u></div>
    </div>
    <br>
    <div class="weather-items">
        <div><b>Headline&nbsp;:-&emsp;</b></div>
        <div>${Headline}</div>
    </div>
    <div class="weather-items">
        <div><b>Minimum Temperature&nbsp;:-</b></div>
        <div>${min_temp}&#176; C</div>
    </div>
    <div class="weather-items">
        <div><b>Maximum Temperature&nbsp;:-</b></div>
        <div>${max_temp}&#176; C</div>
    </div>
    <div class="weather-items">
        <div><b>During Day&nbsp;:-</b></div>
        <div>${daytime}</div>
    </div>
    <div class="weather-items">
        <div><b>During Night&nbsp;:-</b></div>
        <div>${nighttime}</div>
    </div>
    </div>
    </div> 
    `;
}

function fiveDayweather(key) {
    fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=${API_KEY}`).then(res => res.json()).then((data) => {
        console.log(data.DailyForecasts);
        let otherDayForecast = '';
        data.DailyForecasts.forEach((ele, ind) => {
            var day = ele.Date.slice(0, 10)
            var min_temp = (((ele.Temperature.Minimum.Value) - 32) * 0.555).toFixed(2);;
            var max_temp = (((ele.Temperature.Maximum.Value) - 32) * 0.555).toFixed(2);;
            var num = ele.Day.Icon;
            if (num < 10) {
                num = "0" + String(num);
            }
            if (ind == 0) {
                currentTempeEl.innerHTML = `
            <img class="w-icon" width="25%" src="https://developer.accuweather.com/sites/default/files/${num}-s.png">
            <div class="other">
                <div class="day">Today</div>
                <div class="temp">Minumum Temperature - ${min_temp}&#176; C</div>
                <div class="temp">Maximum Temperature - ${max_temp}&#176; C</div>
            </div> `;
            }
            else {
                otherDayForecast += `
                <div class="weather-forecast-item">
                <div class="main-container">
                <img class="w-icon" width="20%" height="20%" src="https://developer.accuweather.com/sites/default/files/${num}-s.png">
                <div class="other">
                <div class="day">${day}</div>
                    <div class="temp">Minumum Temperature - ${min_temp}&#176; C</div>
                    <div class="temp">Maximum Temperature - ${max_temp}&#176; C</div>
                </div> </div> </div>`;
            }
            weatherForecastEl.innerHTML = otherDayForecast;
        })
    })
}


document.querySelector(".search-container button").addEventListener("click", () => {
    var input = document.getElementById("location-input").value
    city = input
    getWeatherData(city)
})
