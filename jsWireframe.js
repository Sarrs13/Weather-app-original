// import axios from "axios";

console.log("outside of window load");
window.onload = function () {
  console.log("inside of window load");

  let now = new Date();
  let currentDate = document.getElementById("dateTime");
  currentDate.innerHTML = now;
  console.log(currentDate);
  let inputCity = document.querySelector("#inputCity");
  let currentCity = document.querySelector("#currentCity");
  let currentTemp = document.querySelector("#currentTemp");
  let windSpeed = document.querySelector("#windSpeed");
  let weatherDescription = document.querySelector("#weatherDescription");
  let icon = document.querySelector("#icon");
  let fahrenheitLink = document.querySelector("#changeUnit");
  fahrenheitLink.addEventListener("click", showFarTemp);
  let highTemp = document.querySelector("#highTemp");
  let lowTemp = document.querySelector("#lowTemp");

  let celsiusLink = document.querySelector("#changeCel");
  celsiusLink.addEventListener("click", showCelTemp);

  function cityDisplay(event) {
    event.preventDefault();

    console.log(inputCity.value);

    let appid = "804e94c01bf121b61d8a288389c833e7"; // get weather for berlin
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric&appid=` +
          appid
      )
      .then(function (response) {
        console.log(response);
        let weatherDiv = document.querySelector("#weather");
        let temperature = Math.round(response.data.main.temp);
        let cityName = response.data.name;
        let windSpeedValue = response.data.wind.speed;
        let weatherDescriptionValue = capitalizeFirstLetter(
          response.data.weather[0].description
        );
        let iconCode = response.data.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        let forecastURL =
          `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=` +
          appid;
        let highTempValue = Math.round(response.data.main.temp_max);
        let lowTempValue = Math.round(response.data.main.temp_min);
        console.log(highTempValue);

        let countryName = response.data.sys.country;
        currentCity.innerHTML = cityName + ", " + countryName;

        currentTemp.innerHTML = temperature;
        windSpeed.innerHTML = windSpeedValue + "km/h";
        weatherDescription.innerHTML = weatherDescriptionValue;
        icon.src = iconUrl;
        highTemp.innerHTML = highTempValue + "°C";
        lowTemp.innerHTML = lowTempValue + "°C";
        getForecast(forecastURL);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  let button = document.querySelector("#search");
  button.addEventListener("click", cityDisplay);

  let currentLocationButton = document.querySelector("#currentLocation");
  currentLocationButton.addEventListener("click", getPosition);

  inputCity.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) button.click();
  });

  function getForecast(forecastURL) {
    axios.get(forecastURL).then(function (response) {
      console.log(response);
      let forecastWeekday = response.data.daily[0].dt;
      console.log(new Date(forecastWeekday * 1000));
      let forecastIcon = response.data.daily[0].weather[0].icon;
      let forecastDaily = response.data.daily[0].feels_like.day;

      let days = ["one", "two", "three", "four", "five", "six"];
      let weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      response.data.daily.shift();
      let counter = 0;
      response.data.daily.forEach(function (day) {
        let forecastIconElement = document.querySelector(
          "#" + days[counter] + "Icon"
        );
        let forecastDailyElement = document.querySelector(
          "#" + days[counter] + "Forecast"
        );
        let forecastWeekdayElement = document.querySelector(
          "#" + days[counter] + "Day"
        );

        console.log(days[counter] + "Day");

        let date = new Date(day.dt * 1000);
        console.log(date.getDay());

        let weekdayIndex = date.getDay();
        console.log(weekDays[weekdayIndex]);

        let icon = day.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        let forecastDisplay = day.temp.day;

        forecastWeekdayElement.innerHTML = weekDays[weekdayIndex];
        forecastIconElement.src = iconUrl;
        forecastDailyElement.innerHTML = Math.round(forecastDisplay - 273.15);

        // let dayElement = document.querySelector(days[counter] + "Day")
        console.log(day);
        if (counter < 5) {
          counter += 1;
        }
      });
    });
  }

  function showFarTemp(event) {
    event.preventDefault();
    let currentTemp = document.querySelector("#currentTemp");
    // let temperatureElement = document.querySelector("#");
    let changeUnit = Math.round((currentTemp.innerHTML * 9) / 5 + 32);
    currentTemp.innerHTML = changeUnit;
    console.log(fahrenheitLink);
    fahrenheitLink.classList.add("isDisabled");
    celsiusLink.classList.remove("isDisabled");
  }
  function showCelTemp(event) {
    let currentTemp = document.querySelector("#currentTemp");
    let changeCel = Math.round(((currentTemp.innerHTML - 32) * 5) / 9);
    currentTemp.innerHTML = changeCel;
    fahrenheitLink.classList.remove("isDisabled");
    celsiusLink.classList.add("isDisabled");
  }

  function getPosition() {
    let currentPosition =
      navigator.geolocation.getCurrentPosition(currentCityDisplay);
    console.log(currentPosition);
  }

  function currentCityDisplay(position) {
    let appid = "804e94c01bf121b61d8a288389c833e7"; // get weather for berlin
    console.log(position);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=` +
          appid
      )
      .then(function (response) {
        let temperature = Math.round(response.data.main.temp);
        let cityName = response.data.name;
        let countryName = response.data.sys.country;
        currentCity.innerHTML = cityName + ", " + countryName;
        currentTemp.innerHTML = temperature;
      });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  inputCity.value = "bern";
  button.click();
};
