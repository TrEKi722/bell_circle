const scheduleListElement = document.getElementById("schedule-list");
const currentTimeDateElement = document.getElementById("current-timedate");
const currentDateElement = document.getElementById("current-date");
const currentPeriodElement = document.getElementById("current-period");
const countdownElement = document.getElementById("countdown");

const { weeklySchedule, specialScheduleFile } = window.BellCircleConfig;

let weekdayID = 0;
let dateList = [];
let minimumDay = false;
let is24HourFormat = false; // Whether or not to default to 24-hour format

async function fetchDateList() {
try {
    const response = await fetch(specialScheduleFile);
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Expecting an array of objects with properties: date (yyyy-mm-dd) and details (schedule name)
    dateList = data.map(item => ({
    date: item.date,
    details: item.details
    }));
    console.log("Fetched dates from JSON:", dateList);
} catch (error) {
    console.error('Error fetching local JSON schedule data:', error.message);
}
}

function fetchWeekdayNumber() {
const now = new Date();
const temp = now.toLocaleDateString('en-US', {weekday: 'short'});
weekdayID = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(temp);
}

function isMinimumDay() {
const todayDate = new Date().toISOString().split('T')[0];
// Find if today matches a date in the list and get its details (schedule name)
const found = dateList.find(item => item.date === todayDate);
if (found) {
    console.log("Schedule for today:", found.details);
    return found.details;
}
return null;
}

async function initializeVariables() {
await fetchDateList();
fetchWeekdayNumber();
minimumDay = isMinimumDay(); // now returns schedule name or null
console.log("Weekday ID:", weekdayID);
console.log("Today's Schedule:", minimumDay);
}

function formatTime(minutes) {
if (is24HourFormat) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
} else {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${period}`;
}
}

function displayCurrentTime() {
const now = new Date();
const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24HourFormat };
const dateOptions = { weekday: "long", month: "long", day: "numeric", };
currentTimeDateElement.textContent = now.toLocaleDateString([], dateOptions) + ", " +now.toLocaleTimeString([], timeOptions);
//currentDateElement.textContent = now.toLocaleDateString();
}

function updateSchedule() {
let todaySchedule;
if (minimumDay) {
    if (weeklySchedule[minimumDay]) {
    // If the string matches one of your defined schedules
    todaySchedule = weeklySchedule[minimumDay];
    } else {
    todaySchedule = weeklySchedule["Block"]; // fallback
    }
} else if (weekdayID === 1) {
    todaySchedule = weeklySchedule["Monday"];
} else {
    todaySchedule = weeklySchedule["Block"];
}
console.log("Using schedule:", minimumDay || (weekdayID === 1 ? "Monday" : "Block"));
scheduleListElement.innerHTML = '';
// scheduleListElement.appendChild(header);
todaySchedule.forEach(period => {
    const listItem = document.createElement('li');
    listItem.className = 'schedule-item';
    listItem.textContent = `${formatTime(period.start)} - ${formatTime(period.end)}: ${period.name}`;
    scheduleListElement.appendChild(listItem);
});
}

function updateCurrentPeriodAndCountdown() {
const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();
let todaySchedule;
if (minimumDay) {
    if (weeklySchedule[minimumDay]) {
    // If the string matches one of your defined schedules
    todaySchedule = weeklySchedule[minimumDay];
    } else {
    // Debugging case: Airtable returned something you don't handle
    console.warn(`Unknown schedule type from Airtable: "${minimumDay}"`);
    todaySchedule = weeklySchedule["Block"]; // fallback
    }
} else if (weekdayID === 1) {
    todaySchedule = weeklySchedule["Monday"];
} else {
    todaySchedule = weeklySchedule["Block"];
}

const currentPeriod = todaySchedule.find(period => currentMinutes >= period.start && currentMinutes < period.end);
const nextPeriod = todaySchedule.find(period => currentMinutes < period.start);

if (currentPeriod) {
    currentPeriodElement.textContent = `${currentPeriod.name}`;
    const remainingSeconds = (currentPeriod.end - currentMinutes) * 60 - (now.getSeconds());
    countdownElement.textContent = `${Math.floor(remainingSeconds / 3600)}h ${Math.floor((remainingSeconds % 3600) / 60)}m ${remainingSeconds % 60}s`;
} else if (nextPeriod) {
    currentPeriodElement.textContent = `Next: ${nextPeriod.name}`;
    const remainingSeconds = (nextPeriod.start - currentMinutes) * 60 - (now.getSeconds());
    countdownElement.textContent = `${Math.floor(remainingSeconds / 3600)}h ${Math.floor((remainingSeconds % 3600) / 60)}m ${remainingSeconds % 60}s`;
} else {
    currentPeriodElement.textContent = "School is over for today!";
    countdownElement.textContent = "";
}
}

function initialize() {
// Initialize variables and ensure schedule updates even if fetching dates fails
initializeVariables().catch(err => {
    console.error('[initialize] initializeVariables failed:', err);
}).then(() => {
    try {
    displayCurrentTime();
    updateSchedule();
    updateCurrentPeriodAndCountdown();
    setInterval(displayCurrentTime, 1000);
    setInterval(updateCurrentPeriodAndCountdown, 1000);

    // Attach 24-hour switch listener safely (ensure element exists)
    const hrSwitch = document.getElementById('24HrSwitch');
    if (hrSwitch) {
        hrSwitch.addEventListener('change', (event) => {
        is24HourFormat = event.target.checked;
        displayCurrentTime();
        updateSchedule();
        });
    } else {
        console.warn('[initialize] 24HrSwitch element not found');
    }
    } catch (err) {
    console.error('[initialize] Error during post-init setup:', err);
    }
});
}

// Use DOMContentLoaded to ensure DOM elements are present and avoid onload overrides
document.addEventListener('DOMContentLoaded', initialize);