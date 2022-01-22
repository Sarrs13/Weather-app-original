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
        let weatherDescriptionValue = response.data.weather[0].description;

        let countryName = response.data.sys.country;
        currentCity.innerHTML = cityName + ", " + countryName;

        currentTemp.innerHTML = temperature;
        windSpeed.innerHTML = windSpeedValue + "km/h";
        weatherDescription.innerHTML = weatherDescriptionValue;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  let button = document.querySelector("#search");
  button.addEventListener("click", cityDisplay);

  let fahrenheitLink = document.querySelector("#changeUnit");
  fahrenheitLink.addEventListener("click", showFarTemp);

  let currentLocationButton = document.querySelector("#currentLocation");
  currentLocationButton.addEventListener("click", getPosition);

  inputCity.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) button.click();
  });
};

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

function showFarTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#currentTemp");
  // let temperatureElement = document.querySelector("#");
  let changeUnit = Math.round((currentTemp.innerHTML * 9) / 5 + 32);
  currentTemp.innerHTML = changeUnit;
}
