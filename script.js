const clockElement = document.getElementById('clock');
const reminderInput = document.getElementById('reminderTime');
const noteInput = document.getElementById('note');
const locationInput = document.getElementById('location');
const remindersList = document.getElementById('remindersList');
const alertSound = document.getElementById('alertSound');
const weatherData = document.getElementById('weatherData');

let reminders = [];

function updateClock() {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString();
}

function setReminder() {
    const reminderTime = new Date(reminderInput.value);
    const note = noteInput.value;
    const location = locationInput.value;

    if (reminderTime && !isNaN(reminderTime)) {
        reminders.push({ time: reminderTime, note, location });
        renderReminders();
        reminderInput.value = '';
        noteInput.value = '';
        locationInput.value = '';
    }
}

function renderReminders() {
    remindersList.innerHTML = '';
    reminders.forEach((reminder, index) => {
        const reminderElement = document.createElement('div');
        reminderElement.innerHTML = `Reminder set for: ${reminder.time.toLocaleString()}<br>Note: ${reminder.note}<br>Location: ${reminder.location}`;
        remindersList.appendChild(reminderElement);
    });
}

function checkReminders() {
    const now = new Date();
    reminders.forEach((reminder, index) => {
        if (reminder.time <= now) {
            alertSound.play();
            reminders.splice(index, 1); // Remove the reminder after alert
            renderReminders();
        }
    });
}

async function fetchWeather() {
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=/current.xml&units=metric');
        const data = await response.json();
        weatherData.innerHTML = `Location: ${data.name}<br>Temperature: ${data.main.temp}°C<br>Condition: ${data.weather[0].description}`;
    } catch (error) {
        weatherData.textContent = 'Failed to fetch weather data';
    }
}

// Event Listeners
document.getElementById('setReminder').addEventListener('click', setReminder);

// Start the clock and check reminders every second
setInterval(() => {
    updateClock();
    checkReminders();
}, 1000);

// Fetch weather data on load
fetchWeather();
