const API_KEY = "f45f0a889ffd2ba448949f78dc5a7bb5";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherBody = document.getElementById("weatherBody");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");

// Boshlang'ich shahar
document.addEventListener("DOMContentLoaded", () => {
  getWeatherData("Tashkent");
});

// Qidiruv tugmasini bosganda
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

// Enter tugmasi bosilganda
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});

// OpenWeather-dan ma'lumot olish
async function getWeatherData(city) {
  showLoading();

  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=uz`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Kiritilgan shahar topilmadi!");
      } else {
        throw new Error("Ob-havo ma'lumotlarini yuklashda xatolik yuz berdi.");
      }
    }

    const data = await response.json();
    renderWeatherData(data);
  } catch (err) {
    showError(err.message);
  }
}

// Interfeysda ma'lumotni aks ettirish
function renderWeatherData(data) {
  const { name, sys, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
  
  // Sana formatlash
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('uz-UZ', dateOptions);

  weatherBody.innerHTML = `
    <div class="weather-info">
      <div class="city-details">
        <h2>${name}, ${sys.country}</h2>
        <p>${currentDate}</p>
      </div>

      <div class="weather-status">
        <img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon">
        <div class="temperature">${Math.round(main.temp)}<span>°C</span></div>
        <div class="description">${weather[0].description}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <i class="fa-solid fa-temperature-three-quarters"></i>
          <div class="stat-info">
            <p>Hiss qilinishi</p>
            <h4>${Math.round(main.feels_like)}°C</h4>
          </div>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-droplet"></i>
          <div class="stat-info">
            <p>Namlik</p>
            <h4>${main.humidity}%</h4>
          </div>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-wind"></i>
          <div class="stat-info">
            <p>Shamol</p>
            <h4>${wind.speed} m/s</h4>
          </div>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-gauge-high"></i>
          <div class="stat-info">
            <p>Bosim</p>
            <h4>${main.pressure} hPa</h4>
          </div>
        </div>
      </div>
    </div>
  `;

  showContent();
}

function showLoading() {
  weatherBody.style.display = "none";
  errorBox.style.display = "none";
  loader.style.display = "flex";
}

function showContent() {
  loader.style.display = "none";
  errorBox.style.display = "none";
  weatherBody.style.display = "block";
}

function showError(msg) {
  loader.style.display = "none";
  weatherBody.style.display = "none";
  errorMessage.textContent = msg;
  errorBox.style.display = "flex";
}