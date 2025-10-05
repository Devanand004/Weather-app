// ==============================================
// DOM Elements
// ==============================================
const elements = {
  // Loading
  loadingScreen: document.getElementById("loading-screen"),
  progressFill: document.getElementById("progress-fill"),
  loadingText: document.getElementById("loading-text"),
  weatherAnimation: document.getElementById("weather-animation"),

  // Header
  themeToggle: document.getElementById("theme-toggle"),
  searchBtn: document.getElementById("search-btn"),
  citySearch: document.getElementById("city-search"),
  locationIndicator: document.getElementById("location-indicator"),
  refreshBtn: document.getElementById("refresh-btn"),
  settingsBtn: document.getElementById("settings-btn"),

  // Current Weather
  currentLocation: document.getElementById("current-location"),
  currentDateTime: document.getElementById("current-date-time"),
  currentTemp: document.getElementById("current-temp"),
  currentCondition: document.getElementById("current-condition"),
  currentWeatherIcon: document.getElementById("current-weather-icon"),
  feelsLike: document.getElementById("feels-like"),
  tempHigh: document.getElementById("temp-high"),
  tempLow: document.getElementById("temp-low"),
  locationBtn: document.getElementById("location-btn"),

  // Weather Alert
  weatherAlert: document.getElementById("weather-alert"),
  alertTitle: document.getElementById("alert-title"),
  alertMessage: document.getElementById("alert-message"),
  alertClose: document.getElementById("alert-close"),

  // Stats
  windSpeed: document.getElementById("wind-speed"),
  humidity: document.getElementById("humidity"),
  pressure: document.getElementById("pressure"),
  visibility: document.getElementById("visibility"),
  uvIndex: document.getElementById("uv-index"),
  precipitation: document.getElementById("precipitation"),

  // Trends
  windTrend: document.getElementById("wind-trend"),
  humidityTrend: document.getElementById("humidity-trend"),
  pressureTrend: document.getElementById("pressure-trend"),
  visibilityTrend: document.getElementById("visibility-trend"),
  uvTrend: document.getElementById("uv-trend"),
  precipTrend: document.getElementById("precip-trend"),

  // Charts
  temperatureChart: document.getElementById("temperature-chart"),
  precipitationChart: document.getElementById("precipitation-chart"),

  // Forecast
  hourlyForecast: document.getElementById("hourly-forecast"),
  dailyForecast: document.getElementById("daily-forecast"),
  hourlyTimeToggle: document.getElementById("hourly-time-toggle"),
  hourlyScrollLeft: document.getElementById("hourly-scroll-left"),
  hourlyScrollRight: document.getElementById("hourly-scroll-right"),

  // Maps
  temperatureMap: document.getElementById("temperature-map"),
  precipitationMap: document.getElementById("precipitation-map"),

  // Air Quality
  airQuality: document.getElementById("air-quality"),
  aqiLevel: document.getElementById("aqi-level"),
  aqiDescription: document.getElementById("aqi-description"),
  aqiIndicator: document.getElementById("aqi-indicator"),
  healthIndex: document.getElementById("health-index"),
  healthDescription: document.getElementById("health-description"),

  // Sun & Moon
  sunriseTime: document.getElementById("sunrise-time"),
  sunsetTime: document.getElementById("sunset-time"),
  dayLength: document.getElementById("day-length"),

  // Footer
  lastUpdated: document.getElementById("last-updated"),

  // Settings
  closeSettings: document.getElementById("close-settings"),
  settingsPanel: document.getElementById("settings-panel"),
  unitToggle: document.getElementById("unit-toggle"),
  timeFormat: document.getElementById("time-format"),
  windUnit: document.getElementById("wind-unit"),
  themePreference: document.getElementById("theme-preference"),
  animationsToggle: document.getElementById("animations-toggle"),
  weatherEffects: document.getElementById("weather-effects"),
  refreshRate: document.getElementById("refresh-rate"),
  geolocationToggle: document.getElementById("geolocation-toggle"),
  notificationsToggle: document.getElementById("notifications-toggle"),
  resetSettings: document.getElementById("reset-settings"),
  saveSettings: document.getElementById("save-settings"),

  // Modals
  mapModal: document.getElementById("map-modal"),
  mapModalTitle: document.getElementById("map-modal-title"),
  mapModalClose: document.getElementById("map-modal-close"),
  modalMapContainer: document.getElementById("modal-map-container"),

  // Notifications
  notificationContainer: document.getElementById("notification-container"),
};

// ==============================================
// Global Variables
// ==============================================
const config = {
  apiKey: "cf22d91901a84ba5a8d061b933e74bd1",
  currentCity: "London",
  unit: "metric",
  timeFormat: "12",
  windUnit: "kmh",
  theme: "auto",
  animations: true,
  weatherEffects: true,
  refreshInterval: 30,
  useGeolocation: true,
  notifications: false,
  userLocation: null,
  refreshTimer: null,
  charts: {},
  previousData: null,
};

// Safe configuration for saving (excludes circular references)
const getSafeConfig = () => {
  return {
    currentCity: config.currentCity,
    unit: config.unit,
    timeFormat: config.timeFormat,
    windUnit: config.windUnit,
    theme: config.theme,
    animations: config.animations,
    weatherEffects: config.weatherEffects,
    refreshInterval: config.refreshInterval,
    useGeolocation: config.useGeolocation,
    notifications: config.notifications,
    userLocation: config.userLocation,
  };
};

// ==============================================
// Initialization
// ==============================================
async function initApp() {
  showLoadingScreen();

  try {
    // Load saved preferences
    await loadPreferences();

    // Set up event listeners
    setupEventListeners();

    // Initialize components
    initializeCharts();

    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);

    // Check for geolocation permission and load data
    await initializeLocation();

    // Set up auto-refresh
    setupAutoRefresh();

    // Hide loading screen after a short delay
    setTimeout(() => {
      hideLoadingScreen();
    }, 1500);
  } catch (error) {
    console.error("App initialization error:", error);
    handleInitializationError(error);
  }
}

function showLoadingScreen() {
  if (elements.loadingScreen) {
    elements.loadingScreen.classList.remove("hidden");
    simulateProgress();
  }
}

function simulateProgress() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    if (elements.progressFill) {
      elements.progressFill.style.width = `${progress}%`;
    }

    if (elements.loadingText) {
      if (progress < 30) {
        elements.loadingText.textContent = "Initializing weather engine...";
      } else if (progress < 60) {
        elements.loadingText.textContent = "Loading location services...";
      } else if (progress < 90) {
        elements.loadingText.textContent = "Fetching weather data...";
      } else {
        elements.loadingText.textContent = "Almost ready...";
      }
    }

    if (progress === 100) {
      clearInterval(interval);
    }
  }, 200);
}

function hideLoadingScreen() {
  if (elements.loadingScreen) {
    elements.loadingScreen.style.opacity = "0";
    elements.loadingScreen.style.visibility = "hidden";

    setTimeout(() => {
      if (elements.loadingScreen && elements.loadingScreen.parentNode) {
        elements.loadingScreen.remove();
      }
      showNotification(
        "Welcome to Weather Horizon!",
        "Your personalized weather dashboard is ready.",
        "success"
      );
    }, 500);
  }
}

function handleInitializationError(error) {
  console.error("Initialization failed:", error);
  if (elements.loadingText) {
    elements.loadingText.textContent =
      "Failed to initialize. Please refresh the page.";
  }
  showNotification(
    "Initialization Error",
    "Failed to load the weather app. Please refresh.",
    "error"
  );
}

// ==============================================
// Chart Functions
// ==============================================
function initializeCharts() {
  // Temperature Chart
  if (elements.temperatureChart) {
    const tempCtx = elements.temperatureChart.getContext("2d");
    config.charts.temperature = new Chart(tempCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Temperature",
            data: [],
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Feels Like",
            data: [],
            borderColor: "#f39c12",
            backgroundColor: "rgba(243, 156, 18, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    });
  }

  // Precipitation Chart
  if (elements.precipitationChart) {
    const precipCtx = elements.precipitationChart.getContext("2d");
    config.charts.precipitation = new Chart(precipCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Precipitation",
            data: [],
            backgroundColor: "rgba(52, 152, 219, 0.6)",
            borderColor: "#3498db",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    });
  }
}

function updateCharts(forecastData) {
  const hourlyData = forecastData.slice(0, 8);

  // Update Temperature Chart
  if (config.charts.temperature) {
    const tempLabels = hourlyData.map((hour) =>
      formatTime(new Date(hour.dt * 1000), "12").replace(" ", "")
    );
    const tempData = hourlyData.map((hour) => Math.round(hour.main.temp));
    const feelsLikeData = hourlyData.map((hour) =>
      Math.round(hour.main.feels_like)
    );

    config.charts.temperature.data.labels = tempLabels;
    config.charts.temperature.data.datasets[0].data = tempData;
    config.charts.temperature.data.datasets[1].data = feelsLikeData;
    config.charts.temperature.update();
  }

  // Update Precipitation Chart (using humidity as proxy)
  if (config.charts.precipitation) {
    const precipLabels = hourlyData.map((hour) =>
      formatTime(new Date(hour.dt * 1000), "12").replace(" ", "")
    );
    const precipData = hourlyData.map((hour) =>
      hour.pop ? hour.pop * 100 : hour.main.humidity
    );

    config.charts.precipitation.data.labels = precipLabels;
    config.charts.precipitation.data.datasets[0].data = precipData;
    config.charts.precipitation.update();
  }
}

// ==============================================
// Location & Geolocation Functions
// ==============================================
async function initializeLocation() {
  updateLoadingText("Detecting your location...");

  if (config.useGeolocation && navigator.geolocation) {
    await getCurrentLocation();
  } else {
    console.log("Geolocation not available, using default city");
    await fetchWeatherData(config.currentCity);
  }
}

async function getCurrentLocation() {
  if (elements.locationIndicator) {
    elements.locationIndicator.classList.add("active");
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60 * 60 * 1000,
  };

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

    const { latitude, longitude } = position.coords;
    config.userLocation = { lat: latitude, lon: longitude };

    const cityName = await getCityFromCoords(latitude, longitude);
    if (cityName) {
      config.currentCity = cityName;
      if (elements.citySearch) {
        elements.citySearch.value = cityName;
      }
      await fetchWeatherData(cityName);
    } else {
      await fetchWeatherByCoords(latitude, longitude);
    }

    showNotification(
      "Location Found",
      "Your location has been detected successfully.",
      "success"
    );
  } catch (error) {
    handleGeolocationError(error);
  }
}

async function getCityFromCoords(lat, lon) {
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${config.apiKey}`;
    const response = await fetch(geoUrl);

    if (!response.ok) throw new Error("Geocoding failed");

    const geoData = await response.json();

    if (geoData && geoData.length > 0) {
      const location = geoData[0];
      let cityName = location.name;

      if (location.state && location.country) {
        return `${cityName}, ${location.state}`;
      } else if (location.country) {
        return `${cityName}, ${location.country}`;
      }

      return cityName;
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

function handleGeolocationError(error) {
  let errorMessage = "Location detection failed. Using default location.";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = "Location access denied. Using default location.";
      config.useGeolocation = false;
      updateSetting("geolocationToggle", false);
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = "Location information unavailable.";
      break;
    case error.TIMEOUT:
      errorMessage = "Location request timed out.";
      break;
    default:
      errorMessage = "An unknown error occurred.";
      break;
  }

  console.log(errorMessage);
  showNotification("Location Error", errorMessage, "warning");
  fetchWeatherData(config.currentCity);
}

// ==============================================
// Weather Data Fetching
// ==============================================
async function fetchWeatherData(city) {
  try {
    showLoadingState();
    updateLoadingText(`Fetching weather for ${city}...`);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${config.unit}&appid=${config.apiKey}`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `City "${city}" not found`);
    }

    const weatherData = await weatherResponse.json();

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${config.unit}&appid=${config.apiKey}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      throw new Error("Forecast data unavailable");
    }

    const forecastData = await forecastResponse.json();

    let airQualityData = null;
    try {
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${config.apiKey}`;
      const aqiResponse = await fetch(aqiUrl);
      if (aqiResponse.ok) airQualityData = await aqiResponse.json();
    } catch (e) {
      console.error("AQI fetch error:", e);
    }

    // Calculate trends before updating UI
    calculateTrends(weatherData);

    updateWeatherUI(weatherData, forecastData, airQualityData);

    const now = new Date();
    if (elements.lastUpdated) {
      elements.lastUpdated.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    config.currentCity = city;
    savePreferences();

    showNotification(
      "Data Updated",
      `Weather data for ${city} has been updated.`,
      "success"
    );
  } catch (error) {
    handleWeatherError(error);
  } finally {
    hideLoadingState();
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    showLoadingState();
    updateLoadingText("Fetching weather for your location...");

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${config.unit}&appid=${config.apiKey}`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Weather data unavailable for your location");
    }

    const weatherData = await weatherResponse.json();

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${config.unit}&appid=${config.apiKey}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      throw new Error("Forecast unavailable for your location");
    }

    const forecastData = await forecastResponse.json();

    let airQualityData = null;
    try {
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${config.apiKey}`;
      const aqiResponse = await fetch(aqiUrl);
      if (aqiResponse.ok) airQualityData = await aqiResponse.json();
    } catch (e) {
      console.error("AQI fetch error:", e);
    }

    calculateTrends(weatherData);
    updateWeatherUI(weatherData, forecastData, airQualityData);

    if (elements.citySearch) {
      elements.citySearch.value = weatherData.name;
    }
    config.currentCity = weatherData.name;

    const now = new Date();
    if (elements.lastUpdated) {
      elements.lastUpdated.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    savePreferences();
  } catch (error) {
    handleWeatherError(error);
  } finally {
    hideLoadingState();
  }
}

function calculateTrends(currentData) {
  if (!config.previousData) {
    config.previousData = currentData;
    return;
  }

  // Simple trend calculation based on previous data
  const trends = {
    wind:
      currentData.wind.speed > config.previousData.wind.speed ? "up" : "down",
    humidity:
      currentData.main.humidity > config.previousData.main.humidity
        ? "up"
        : "down",
    pressure:
      currentData.main.pressure > config.previousData.main.pressure
        ? "up"
        : "down",
    visibility:
      currentData.visibility > config.previousData.visibility ? "up" : "down",
  };

  // Update trend indicators
  updateTrendIndicator(elements.windTrend, trends.wind);
  updateTrendIndicator(elements.humidityTrend, trends.humidity);
  updateTrendIndicator(elements.pressureTrend, trends.pressure);
  updateTrendIndicator(elements.visibilityTrend, trends.visibility);

  config.previousData = currentData;
}

function updateTrendIndicator(element, trend) {
  if (!element) return;

  element.textContent = trend === "up" ? "↗" : "↘";
  element.className = `stat-trend ${trend}`;
}

// ==============================================
// UI Updates
// ==============================================
function updateWeatherUI(weatherData, forecastData, airQualityData) {
  try {
    // Update current weather
    if (elements.currentLocation) {
      elements.currentLocation.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    }
    if (elements.currentTemp) {
      elements.currentTemp.textContent = `${Math.round(
        weatherData.main.temp
      )}°`;
    }
    if (elements.currentCondition) {
      elements.currentCondition.textContent =
        weatherData.weather[0].description;
    }
    if (elements.feelsLike) {
      elements.feelsLike.textContent = `${Math.round(
        weatherData.main.feels_like
      )}°`;
    }
    if (elements.tempHigh) {
      elements.tempHigh.textContent = `${Math.round(
        weatherData.main.temp_max
      )}°`;
    }
    if (elements.tempLow) {
      elements.tempLow.textContent = `${Math.round(
        weatherData.main.temp_min
      )}°`;
    }

    // Update weather icon with animation
    const weatherIcon = getWeatherIcon(
      weatherData.weather[0].id,
      weatherData.dt,
      weatherData.sys.sunrise,
      weatherData.sys.sunset
    );
    if (elements.currentWeatherIcon) {
      elements.currentWeatherIcon.innerHTML = `<i class="fas fa-${weatherIcon}"></i>`;
    }

    // Update weather stats
    updateWeatherStats(weatherData);

    // Update forecasts
    updateHourlyForecast(forecastData.list);
    updateDailyForecast(forecastData.list);

    // Update charts
    updateCharts(forecastData.list);

    // Update air quality
    if (airQualityData) {
      updateAirQuality(airQualityData.list[0]);
    }

    // Update sun times
    updateSunTimes(weatherData.sys.sunrise, weatherData.sys.sunset);

    // Update health index
    updateHealthIndex(weatherData, airQualityData);

    // Apply weather-specific styling and animations
    applyWeatherTheme(
      weatherData.weather[0].id,
      weatherData.dt,
      weatherData.sys.sunrise,
      weatherData.sys.sunset
    );

    // Update map placeholders
    updateMapPlaceholders(weatherData.coord.lat, weatherData.coord.lon);

    // Check for weather alerts
    checkWeatherAlerts(weatherData);

    // Mark as loaded for animations
    setTimeout(() => {
      const currentWeatherSection = document.querySelector(
        ".current-weather-section"
      );
      if (currentWeatherSection) {
        currentWeatherSection.classList.add("loaded");
      }
    }, 500);
  } catch (error) {
    console.error("Error updating UI:", error);
    showNotification(
      "UI Update Error",
      "There was a problem displaying the weather data.",
      "error"
    );
  }
}

function updateWeatherStats(weatherData) {
  // Wind speed with unit conversion
  let windSpeed = weatherData.wind.speed;
  let windUnit = "m/s";

  if (config.windUnit === "kmh") {
    windSpeed = (weatherData.wind.speed * 3.6).toFixed(1);
    windUnit = "km/h";
  } else if (config.windUnit === "mph") {
    windSpeed = (weatherData.wind.speed * 2.237).toFixed(1);
    windUnit = "mph";
  }

  if (elements.windSpeed)
    elements.windSpeed.textContent = `${windSpeed} ${windUnit}`;
  if (elements.humidity)
    elements.humidity.textContent = `${weatherData.main.humidity}%`;
  if (elements.pressure)
    elements.pressure.textContent = `${weatherData.main.pressure} hPa`;
  if (elements.visibility)
    elements.visibility.textContent = `${(
      weatherData.visibility / 1000
    ).toFixed(1)} km`;

  // Set default values for unavailable data
  if (elements.uvIndex) elements.uvIndex.textContent = "--";
  if (elements.precipitation) elements.precipitation.textContent = "--%";
}

function updateHourlyForecast(hourlyData) {
  if (!elements.hourlyForecast) return;

  elements.hourlyForecast.innerHTML = "";

  hourlyData.slice(0, 8).forEach((hour, index) => {
    const date = new Date(hour.dt * 1000);
    const time = formatTime(date, config.timeFormat);
    const icon = getWeatherIcon(hour.weather[0].id, hour.dt, 0, 0);
    const temp = Math.round(hour.main.temp);

    const hourCard = document.createElement("div");
    hourCard.className = "hour-card";
    hourCard.innerHTML = `
      <div class="hour-time">${time}</div>
      <div class="hour-icon"><i class="fas fa-${icon}"></i></div>
      <div class="hour-temp">${temp}°</div>
    `;

    // Add animation delay
    hourCard.style.animationDelay = `${index * 0.1}s`;

    elements.hourlyForecast.appendChild(hourCard);
  });

  // Initialize scroll functionality
  initHourlyScroll();
}

function updateDailyForecast(dailyData) {
  if (!elements.dailyForecast) return;

  elements.dailyForecast.innerHTML = "";

  // Group by day and get 7-day forecast
  const days = {};
  dailyData.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const shortDayName = date.toLocaleDateString("en-US", { weekday: "short" });

    if (!days[dayName]) {
      days[dayName] = {
        temps: [],
        weather: item.weather[0],
        date: date,
        shortName: shortDayName,
      };
    }
    days[dayName].temps.push(item.main.temp);
  });

  // Show next 7 days
  Object.keys(days)
    .slice(0, 7)
    .forEach((dayName, index) => {
      const dayData = days[dayName];
      const maxTemp = Math.round(Math.max(...dayData.temps));
      const minTemp = Math.round(Math.min(...dayData.temps));
      const icon = getWeatherIcon(
        dayData.weather.id,
        dayData.date.getTime() / 1000,
        0,
        0
      );

      const dayCard = document.createElement("div");
      dayCard.className = "day-card";
      dayCard.innerHTML = `
        <div class="day-name">${index === 0 ? "Today" : dayData.shortName}</div>
        <div class="day-weather">
          <div class="day-icon"><i class="fas fa-${icon}"></i></div>
          <div class="day-desc">${dayData.weather.description}</div>
        </div>
        <div class="day-temps">
          <div class="day-high">${maxTemp}°</div>
          <div class="day-low">${minTemp}°</div>
        </div>
      `;

      dayCard.style.animationDelay = `${index * 0.1}s`;
      elements.dailyForecast.appendChild(dayCard);
    });
}

function updateAirQuality(aqiData) {
  if (!elements.airQuality) return;

  const aqi = aqiData.main.aqi;

  elements.airQuality.className = "air-quality-card";
  elements.airQuality.classList.add(`aqi-${getAqiClass(aqi)}`);

  const aqiValue = elements.airQuality.querySelector(".aqi-value");
  if (aqiValue) aqiValue.textContent = aqi;

  if (elements.aqiLevel) elements.aqiLevel.textContent = getAqiLevel(aqi);
  if (elements.aqiDescription)
    elements.aqiDescription.textContent = getAqiDescription(aqi);

  // Update AQI progress indicator
  const aqiPercentage = Math.min((aqi / 6) * 100, 100);
  if (elements.aqiIndicator) {
    elements.aqiIndicator.style.width = `${aqiPercentage}%`;
    elements.aqiIndicator.style.background = getComputedStyle(
      elements.airQuality
    ).color;
  }
}

function updateHealthIndex(weatherData, airQualityData) {
  if (!elements.healthIndex || !elements.healthDescription) return;

  // Calculate simple health index based on multiple factors
  let healthScore = 75; // Base score

  // Temperature factor (ideal range 18-24°C)
  const temp = weatherData.main.temp;
  if (temp >= 18 && temp <= 24) healthScore += 15;
  else if (temp >= 15 && temp <= 27) healthScore += 10;
  else if (temp >= 10 && temp <= 30) healthScore += 5;

  // Humidity factor (ideal range 40-60%)
  const humidity = weatherData.main.humidity;
  if (humidity >= 40 && humidity <= 60) healthScore += 10;
  else if (humidity >= 30 && humidity <= 70) healthScore += 5;

  // Air quality factor
  if (airQualityData) {
    const aqi = airQualityData.list[0].main.aqi;
    if (aqi <= 2) healthScore += 10;
    else if (aqi === 3) healthScore -= 5;
    else if (aqi >= 4) healthScore -= 15;
  }

  // UV factor (simplified)
  if (weatherData.weather[0].id === 800) {
    // Clear sky
    healthScore -= 5; // Sun exposure risk
  }

  healthScore = Math.max(0, Math.min(100, healthScore));

  elements.healthIndex.textContent = healthScore;

  if (healthScore >= 80) {
    elements.healthDescription.textContent =
      "Excellent conditions for outdoor activities";
  } else if (healthScore >= 60) {
    elements.healthDescription.textContent =
      "Good conditions, generally safe for most activities";
  } else if (healthScore >= 40) {
    elements.healthDescription.textContent =
      "Moderate conditions, sensitive groups should take care";
  } else {
    elements.healthDescription.textContent =
      "Poor conditions, consider limiting outdoor exposure";
  }
}

function updateSunTimes(sunrise, sunset) {
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  if (elements.sunriseTime) {
    elements.sunriseTime.textContent = formatTime(
      sunriseDate,
      config.timeFormat
    );
  }
  if (elements.sunsetTime) {
    elements.sunsetTime.textContent = formatTime(sunsetDate, config.timeFormat);
  }

  // Calculate day length
  const dayLengthMs = sunsetDate - sunriseDate;
  const hours = Math.floor(dayLengthMs / (1000 * 60 * 60));
  const minutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));

  if (elements.dayLength) {
    elements.dayLength.textContent = `${hours}h ${minutes}m`;
  }
}

// ==============================================
// Weather Utilities
// ==============================================
function getWeatherIcon(weatherId, timestamp = 0, sunrise = 0, sunset = 0) {
  const isDay = timestamp > sunrise && timestamp < sunset;

  if (weatherId < 300) return "bolt"; // Thunderstorm
  if (weatherId < 400) return "cloud-rain"; // Drizzle
  if (weatherId < 600)
    return weatherId < 502 ? "cloud-rain" : "cloud-showers-heavy"; // Rain
  if (weatherId < 700) return "snowflake"; // Snow
  if (weatherId < 800) return "smog"; // Atmosphere
  if (weatherId === 800) return isDay ? "sun" : "moon"; // Clear
  if (weatherId === 801) return isDay ? "cloud-sun" : "cloud-moon"; // Few clouds
  if (weatherId < 805) return "cloud"; // Clouds

  return "question";
}

function getAqiClass(aqi) {
  if (aqi <= 1) return "good";
  if (aqi <= 2) return "moderate";
  if (aqi <= 3) return "unhealthy-sensitive";
  if (aqi <= 4) return "unhealthy";
  if (aqi <= 5) return "very-unhealthy";
  return "hazardous";
}

function getAqiLevel(aqi) {
  const levels = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous",
  };
  return levels[aqi] || "Unknown";
}

function getAqiDescription(aqi) {
  const descriptions = {
    1: "Air quality is satisfactory, and air pollution poses little or no risk.",
    2: "Air quality is acceptable. However, there may be a risk for some people.",
    3: "Members of sensitive groups may experience health effects.",
    4: "Some members of the general public may experience health effects.",
    5: "Health alert: The risk of health effects is increased for everyone.",
    6: "Health warning of emergency conditions.",
  };
  return descriptions[aqi] || "Air quality data not available";
}

function applyWeatherTheme(weatherId, timestamp = 0, sunrise = 0, sunset = 0) {
  const isDay = timestamp > sunrise && timestamp < sunset;
  const appContainer = document.querySelector(".app-container");
  const animationLayer = elements.weatherAnimation;

  if (!appContainer) return;

  // Reset all classes
  appContainer.className = "app-container";
  if (animationLayer) {
    animationLayer.className = "weather-animation";
  }

  let weatherClass = "";
  let animationClass = "";

  if (weatherId < 300) {
    weatherClass = "weather-background-stormy";
    animationClass = "stormy";
  } else if (weatherId < 600) {
    weatherClass = "weather-background-rainy";
    animationClass = "rainy";
  } else if (weatherId < 700) {
    weatherClass = "weather-background-snowy";
    animationClass = "snowy";
  } else if (weatherId === 800) {
    weatherClass = isDay
      ? "weather-background-sunny"
      : "weather-background-night";
    animationClass = isDay ? "sunny" : "night";
  } else if (weatherId < 805) {
    weatherClass = "weather-background-cloudy";
    animationClass = "cloudy";
  } else {
    weatherClass = "weather-background-foggy";
    animationClass = "foggy";
  }

  appContainer.classList.add(weatherClass);

  if (config.weatherEffects && animationLayer) {
    animationLayer.classList.add(animationClass);
    animationLayer.style.opacity = "0.1";
  }
}

function checkWeatherAlerts(weatherData) {
  if (!elements.weatherAlert || !elements.alertTitle || !elements.alertMessage)
    return;

  const weatherId = weatherData.weather[0].id;
  const windSpeed = weatherData.wind.speed;
  const temp = weatherData.main.temp;

  let alertTitle = "";
  let alertMessage = "";
  let showAlert = false;

  // Thunderstorm alert
  if (weatherId < 300) {
    alertTitle = "⛈️ Thunderstorm Alert";
    alertMessage =
      "Thunderstorm conditions detected. Stay indoors if possible.";
    showAlert = true;
  }
  // Heavy rain alert
  else if (weatherId >= 502 && weatherId < 600) {
    alertTitle = "🌧️ Heavy Rain Alert";
    alertMessage = "Heavy rainfall expected. Be cautious while traveling.";
    showAlert = true;
  }
  // High wind alert
  else if (windSpeed > 10) {
    // 10 m/s ~ 36 km/h
    alertTitle = "💨 High Wind Alert";
    alertMessage = "Strong winds detected. Secure outdoor objects.";
    showAlert = true;
  }
  // Temperature alerts
  else if (temp > 35) {
    alertTitle = "🔥 Heat Alert";
    alertMessage =
      "Extreme heat conditions. Stay hydrated and avoid prolonged exposure.";
    showAlert = true;
  } else if (temp < -10) {
    alertTitle = "❄️ Extreme Cold Alert";
    alertMessage =
      "Freezing temperatures. Dress warmly and limit outdoor exposure.";
    showAlert = true;
  }

  if (showAlert) {
    elements.alertTitle.textContent = alertTitle;
    elements.alertMessage.textContent = alertMessage;
    elements.weatherAlert.classList.add("active");
  } else {
    elements.weatherAlert.classList.remove("active");
  }
}

// ==============================================
// Utility Functions
// ==============================================
function formatTime(date, format = "12") {
  if (format === "24") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

function updateClock() {
  const now = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: config.timeFormat === "12",
  };

  if (elements.currentDateTime) {
    elements.currentDateTime.textContent = now.toLocaleDateString(
      "en-US",
      options
    );
  }
}

function updateMapPlaceholders(lat, lon) {
  if (elements.temperatureMap) {
    elements.temperatureMap.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://via.placeholder.com/600x300/3498db/ffffff?text=Temperature+Map+${lat},${lon}')`;
  }
  if (elements.precipitationMap) {
    elements.precipitationMap.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://via.placeholder.com/600x300/2980b9/ffffff?text=Precipitation+Map+${lat},${lon}')`;
  }
}

function initHourlyScroll() {
  const container = elements.hourlyForecast;
  if (!container || !elements.hourlyScrollLeft || !elements.hourlyScrollRight)
    return;

  elements.hourlyScrollLeft.addEventListener("click", () => {
    container.scrollLeft -= 200;
  });

  elements.hourlyScrollRight.addEventListener("click", () => {
    container.scrollLeft += 200;
  });
}

function showLoadingState() {
  if (elements.refreshBtn) {
    elements.refreshBtn.classList.add("rotating");
  }
  if (elements.currentWeatherIcon) {
    elements.currentWeatherIcon.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i>';
  }
  if (elements.currentLocation) {
    elements.currentLocation.textContent = "Loading...";
  }
}

function hideLoadingState() {
  if (elements.refreshBtn) {
    elements.refreshBtn.classList.remove("rotating");
  }
}

function updateLoadingText(text) {
  if (elements.loadingText) {
    elements.loadingText.textContent = text;
  }
}

// ==============================================
// Notification System
// ==============================================
function showNotification(title, message, type = "info") {
  if (!config.notifications || !elements.notificationContainer) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
    </div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;

  elements.notificationContainer.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);

  // Close button
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => hideNotification(notification));
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    warning: "exclamation-triangle",
    error: "exclamation-circle",
    info: "info-circle",
  };
  return icons[type] || "info-circle";
}

function hideNotification(notification) {
  notification.classList.add("hiding");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// ==============================================
// Settings & Preferences
// ==============================================
async function loadPreferences() {
  try {
    const savedPrefs = localStorage.getItem("weatherAppPreferences");
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);

      // Only load safe properties (exclude charts and other circular references)
      const safeProperties = [
        "currentCity",
        "unit",
        "timeFormat",
        "windUnit",
        "theme",
        "animations",
        "weatherEffects",
        "refreshInterval",
        "useGeolocation",
        "notifications",
        "userLocation",
      ];

      safeProperties.forEach((prop) => {
        if (prefs[prop] !== undefined) {
          config[prop] = prefs[prop];
        }
      });
    }

    // Apply loaded preferences to UI
    updateSetting("unitToggle", config.unit === "metric");
    updateSetting("timeFormat", config.timeFormat);
    updateSetting("windUnit", config.windUnit);
    updateSetting("themePreference", config.theme);
    updateSetting("animationsToggle", config.animations);
    updateSetting("weatherEffects", config.weatherEffects);
    updateSetting("refreshRate", config.refreshInterval);
    updateSetting("geolocationToggle", config.useGeolocation);
    updateSetting("notificationsToggle", config.notifications);

    applyTheme();
  } catch (error) {
    console.error("Error loading preferences:", error);
    // Reset to defaults if preferences are corrupted
    resetToDefaults();
  }
}

function savePreferences() {
  try {
    const safeConfig = getSafeConfig();
    localStorage.setItem("weatherAppPreferences", JSON.stringify(safeConfig));
  } catch (error) {
    console.error("Error saving preferences:", error);
    showNotification(
      "Save Error",
      "Could not save preferences to browser storage.",
      "error"
    );
  }
}

function updateSetting(elementId, value) {
  const element = elements[elementId];
  if (!element) return;

  if (element.type === "checkbox") {
    element.checked = value;
  } else {
    element.value = value;
  }
}

function resetToDefaults() {
  const defaults = {
    currentCity: "London",
    unit: "metric",
    timeFormat: "12",
    windUnit: "kmh",
    theme: "auto",
    animations: true,
    weatherEffects: true,
    refreshInterval: 30,
    useGeolocation: true,
    notifications: false,
    userLocation: null,
  };

  Object.assign(config, defaults);
  savePreferences();
  loadPreferences();

  showNotification(
    "Settings Reset",
    "All settings have been reset to defaults.",
    "success"
  );
}

// ==============================================
// Event Listeners
// ==============================================
function setupEventListeners() {
  // Theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener("click", toggleTheme);
  }

  // Search functionality
  if (elements.searchBtn) {
    elements.searchBtn.addEventListener("click", handleSearch);
  }
  if (elements.citySearch) {
    elements.citySearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

  // Refresh button
  if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener("click", () => {
      if (config.userLocation) {
        fetchWeatherByCoords(config.userLocation.lat, config.userLocation.lon);
      } else {
        fetchWeatherData(config.currentCity);
      }
    });
  }

  // Location button
  if (elements.locationBtn) {
    elements.locationBtn.addEventListener("click", () => {
      getCurrentLocation();
    });
  }

  // Settings panel
  if (elements.settingsBtn) {
    elements.settingsBtn.addEventListener("click", () => {
      if (elements.settingsPanel) {
        elements.settingsPanel.classList.add("active");
      }
    });
  }

  if (elements.closeSettings) {
    elements.closeSettings.addEventListener("click", () => {
      if (elements.settingsPanel) {
        elements.settingsPanel.classList.remove("active");
      }
    });
  }

  // Alert close
  if (elements.alertClose) {
    elements.alertClose.addEventListener("click", () => {
      if (elements.weatherAlert) {
        elements.weatherAlert.classList.remove("active");
      }
    });
  }

  // Time format toggle
  if (elements.hourlyTimeToggle) {
    elements.hourlyTimeToggle.addEventListener("click", (e) => {
      if (e.target.classList.contains("time-btn")) {
        document
          .querySelectorAll(".time-btn")
          .forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        config.timeFormat = e.target.dataset.format.replace("h", "");
        savePreferences();
        updateClock();
        // Trigger a refresh to update hourly forecast times
        if (config.userLocation) {
          fetchWeatherByCoords(
            config.userLocation.lat,
            config.userLocation.lon
          );
        }
      }
    });
  }

  // Map expand buttons
  document.querySelectorAll(".map-expand").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mapType = btn.dataset.map;
      openMapModal(mapType);
    });
  });

  if (elements.mapModalClose) {
    elements.mapModalClose.addEventListener("click", () => {
      if (elements.mapModal) {
        elements.mapModal.classList.remove("active");
      }
    });
  }

  // Settings changes
  setupSettingsEventListeners();

  // Close settings when clicking outside
  document.addEventListener("click", (e) => {
    if (
      elements.settingsPanel &&
      !elements.settingsPanel.contains(e.target) &&
      !elements.settingsBtn.contains(e.target) &&
      elements.settingsPanel.classList.contains("active")
    ) {
      elements.settingsPanel.classList.remove("active");
    }
  });

  // Close map modal when clicking outside
  if (elements.mapModal) {
    elements.mapModal.addEventListener("click", (e) => {
      if (e.target === elements.mapModal) {
        elements.mapModal.classList.remove("active");
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl+R to refresh
    if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      if (elements.refreshBtn) elements.refreshBtn.click();
    }
    // Ctrl+L for location
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      if (elements.locationBtn) elements.locationBtn.click();
    }
    // Escape to close modals
    if (e.key === "Escape") {
      if (elements.settingsPanel)
        elements.settingsPanel.classList.remove("active");
      if (elements.mapModal) elements.mapModal.classList.remove("active");
    }
  });
}

function setupSettingsEventListeners() {
  if (elements.unitToggle) {
    elements.unitToggle.addEventListener("change", toggleUnits);
  }

  if (elements.timeFormat) {
    elements.timeFormat.addEventListener("change", (e) => {
      config.timeFormat = e.target.value;
      savePreferences();
      updateClock();
    });
  }

  if (elements.windUnit) {
    elements.windUnit.addEventListener("change", (e) => {
      config.windUnit = e.target.value;
      savePreferences();
      // Refresh data to update units
      if (config.userLocation) {
        fetchWeatherByCoords(config.userLocation.lat, config.userLocation.lon);
      } else {
        fetchWeatherData(config.currentCity);
      }
    });
  }

  if (elements.themePreference) {
    elements.themePreference.addEventListener("change", (e) => {
      config.theme = e.target.value;
      savePreferences();
      applyTheme();
    });
  }

  if (elements.animationsToggle) {
    elements.animationsToggle.addEventListener("change", (e) => {
      config.animations = e.target.checked;
      savePreferences();
    });
  }

  if (elements.weatherEffects) {
    elements.weatherEffects.addEventListener("change", (e) => {
      config.weatherEffects = e.target.checked;
      savePreferences();
      // Re-apply weather theme to update effects
      if (config.previousData) {
        applyWeatherTheme(
          config.previousData.weather[0].id,
          config.previousData.dt,
          config.previousData.sys.sunrise,
          config.previousData.sys.sunset
        );
      }
    });
  }

  if (elements.refreshRate) {
    elements.refreshRate.addEventListener("change", (e) => {
      config.refreshInterval = parseInt(e.target.value);
      savePreferences();
      setupAutoRefresh();
    });
  }

  if (elements.geolocationToggle) {
    elements.geolocationToggle.addEventListener("change", (e) => {
      config.useGeolocation = e.target.checked;
      savePreferences();
      if (elements.locationIndicator) {
        elements.locationIndicator.classList.toggle(
          "active",
          config.useGeolocation
        );
      }
    });
  }

  if (elements.notificationsToggle) {
    elements.notificationsToggle.addEventListener("change", (e) => {
      config.notifications = e.target.checked;
      savePreferences();
      if (config.notifications) {
        showNotification(
          "Notifications Enabled",
          "You will now receive weather alerts and updates.",
          "success"
        );
      }
    });
  }

  // Settings actions
  if (elements.resetSettings) {
    elements.resetSettings.addEventListener("click", resetToDefaults);
  }

  if (elements.saveSettings) {
    elements.saveSettings.addEventListener("click", () => {
      if (elements.settingsPanel) {
        elements.settingsPanel.classList.remove("active");
      }
      showNotification(
        "Settings Saved",
        "Your preferences have been updated.",
        "success"
      );
    });
  }
}

function toggleTheme() {
  config.theme = config.theme === "dark" ? "light" : "dark";
  savePreferences();
  applyTheme();
}

function applyTheme() {
  if (config.theme === "auto") {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 18;
    document.body.classList.toggle("dark-theme", isNight);
  } else {
    document.body.classList.toggle("dark-theme", config.theme === "dark");
  }

  // Update theme icon
  const isDark = document.body.classList.contains("dark-theme");
  if (elements.themeToggle) {
    elements.themeToggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }
}

function toggleUnits() {
  if (elements.unitToggle) {
    config.unit = elements.unitToggle.checked ? "metric" : "imperial";
    savePreferences();

    // Refresh data with new units
    if (config.userLocation) {
      fetchWeatherByCoords(config.userLocation.lat, config.userLocation.lon);
    } else {
      fetchWeatherData(config.currentCity);
    }
  }
}

function handleSearch() {
  const city = elements.citySearch ? elements.citySearch.value.trim() : "";
  if (city) {
    // When user searches manually, temporarily disable geolocation
    const wasUsingGeolocation = config.useGeolocation;
    config.useGeolocation = false;

    fetchWeatherData(city);
    if (elements.searchBtn) {
      elements.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    setTimeout(() => {
      if (elements.searchBtn) {
        elements.searchBtn.innerHTML = '<i class="fas fa-search"></i>';
      }
      // Restore geolocation setting after search
      config.useGeolocation = wasUsingGeolocation;
      updateSetting("geolocationToggle", config.useGeolocation);
    }, 1000);
  }
}

function openMapModal(mapType) {
  if (
    !elements.mapModal ||
    !elements.mapModalTitle ||
    !elements.modalMapContainer
  )
    return;

  elements.mapModalTitle.textContent = `${
    mapType.charAt(0).toUpperCase() + mapType.slice(1)
  } Map`;
  elements.modalMapContainer.innerHTML = `
    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary);color:var(--text-secondary);">
      <div style="text-align:center;">
        <i class="fas fa-map" style="font-size:3rem;margin-bottom:1rem;"></i>
        <div>Interactive ${mapType} map would be displayed here</div>
        <div style="font-size:0.8rem;margin-top:0.5rem;">In a production app, this would show real weather maps</div>
      </div>
    </div>
  `;
  elements.mapModal.classList.add("active");
}

// ==============================================
// Auto Refresh
// ==============================================
function setupAutoRefresh() {
  // Clear existing timer
  if (config.refreshTimer) {
    clearInterval(config.refreshTimer);
  }

  // Set up new timer if interval > 0
  if (config.refreshInterval > 0) {
    const intervalMs = config.refreshInterval * 60 * 1000;
    config.refreshTimer = setInterval(() => {
      if (config.userLocation) {
        fetchWeatherByCoords(config.userLocation.lat, config.userLocation.lon);
      } else {
        fetchWeatherData(config.currentCity);
      }
    }, intervalMs);
  }
}

// ==============================================
// Error Handling
// ==============================================
function handleWeatherError(error) {
  console.error("Weather error:", error);

  if (elements.currentLocation) {
    elements.currentLocation.textContent = `Error: ${error.message}`;
  }
  if (elements.currentWeatherIcon) {
    elements.currentWeatherIcon.innerHTML =
      '<i class="fas fa-exclamation-triangle"></i>';
  }

  showNotification(
    "Weather Error",
    `Unable to fetch weather data: ${error.message}`,
    "error"
  );
}

// ==============================================
// Initialize App
// ==============================================
// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
