const scheduleList = document.getElementById("schedule-list");
const timeDate = document.getElementById("current-timedate");
const period = document.getElementById("current-period");
const countdown = document.getElementById("countdown");

const { weeklySchedule, specialScheduleFile } = window.BellCircleConfig;

let weekdayID = 0;
let dateList = [];
let currentSchedule = [];
let is24HourFormat = localStorage.getItem('is24HourFormat') === 'true';

async function fetchDateList() {
    try {
        const response = await fetch(specialScheduleFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dateList = data.map(item => ({
            date: item.date,
            details: item.details
        }));
        console.log("Date list fetched: ", dateList);
    } catch (error) {
        console.error("Error fetching date list:", error);
    }
}

// Formerly fetchWeekdayID
function fetchDayID() {
    const now  = new Date();
    const temp = now.toLocaleDateString('en-US', { weekday: 'short' });
    weekdayID = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(temp);
}

// Formerly isMinimumDay
function isSpecialSchedule() {
    // Accept an optional date string (YYYY-MM-DD). If no argument is passed,
    // default to today's date so existing callers keep working.
    const dateString = arguments.length > 0 && arguments[0] ? arguments[0] : new Date().toISOString().split('T')[0];
    return dateList.find(item => item.date === dateString)?.details;
}

// Formerly initializeVariables
async function initializeVars() {
    await fetchDateList();
    fetchDayID();
    const scheduleKey = weekdayID === 0 ? "Mon" : "Standard" ;
    const specialName = isSpecialSchedule();
    if (specialName && weeklySchedule[specialName]) {
        currentSchedule = weeklySchedule[specialName];
    } else {
        currentSchedule = weeklySchedule[scheduleKey] || weeklySchedule["Standard"];
    }
    console.log("Current schedule: ", currentSchedule);
}

function formatTime(minutes) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    if (is24HourFormat) {
        return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    } else {
        const hour12 = hour24 % 12 || 12;
        const ampm = hour24 < 12 ? 'AM' : 'PM';
        return `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`;
    }
}

// Formerly displayCurrentTime
function displayTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24HourFormat };
    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    timeDate.textContent = now.toLocaleDateString('en-US', dateOptions) + ", " + now.toLocaleTimeString('en-US', timeOptions);
}

function updateSchedule() {
    console.log("Using schedule: ", currentSchedule);
    scheduleList.innerHTML = "";
    currentSchedule.forEach((period, index) => {
        const listItem = document.createElement("li");
        listItem.className = 'schedule-item';
        listItem.textContent = `${formatTime(period.start)} - ${formatTime(period.end)}: ${period.name}`;
        if (index === 0) {
            listItem.classList.add =('current-period');
        }
        scheduleList.appendChild(listItem);
    });
}

// Formerly updateCurrentPeriodAndCountdown
function updateCountdown() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const currentPeriod = currentSchedule.find(period => currentTime >= period.start && currentTime < period.end);
    const nextPeriod = currentSchedule.find(period => currentTime < period.start);

    if (currentPeriod) {
        period.textContent = `${currentPeriod.name}`;
        const secondsLeft = (currentPeriod.end - currentTime) * 60 - now.getSeconds();
        countdown.textContent = `${Math.floor(secondsLeft / 3600)}h ${Math.floor((secondsLeft % 3600) / 60)}m ${secondsLeft % 60}s`;
    } else if (nextPeriod) {
        period.textContent = `Next: ${nextPeriod.name}`;
        const secondsNext = (nextPeriod.start - currentTime) * 60 - now.getSeconds();
        countdown.textContent = `Next period (${nextPeriod.name}) starts in: ${Math.floor(secondsNext / 60)} minute${secondsNext !== 60 ? 's' : ''}`;
    } else {
        period.textContent = "School is over for today!";
        countdown.textContent = "";
    }
}

// Formerly initialize
function main() {
    initializeVars().catch(err => {
        console.error("Error initializing variables: ", err);
    }).then(() => {
        try {
            displayTime();
            updateSchedule();
            updateCountdown();
            setInterval(() => {
                displayTime();
                updateCountdown();
            }, 1000);

            // 24 Hour switch listener
            const formatSwitch = document.getElementById('24HrSwitch');
            if (formatSwitch) {
                formatSwitch.checked = is24HourFormat;
                formatSwitch.addEventListener('change', function() {
                    is24HourFormat = this.checked;
                    localStorage.setItem('is24HourFormat', this.checked);
                    displayTime();
                    updateSchedule();
                });
            }
        } catch (err) {
            console.error("Error in main execution: ", err);
        }
    });
    console.log("Initialization complete.");
    console.log("For debugging, use debugHelp() to see available functions.");
}

// Use DOMContentLoaded to ensure the DOM is fully loaded before running the main function
document.addEventListener("DOMContentLoaded", main);


// Keep the 24-hour format switch state in sync with localStorage
const formatSwitch = document.getElementById('24HrSwitch');
if (formatSwitch) {
    formatSwitch.addEventListener('change', function() {
        localStorage.setItem('is24HourFormat', this.checked);
    });
}

// The following functions are for DEBUGGING ONLY

// logCurrentSchedule
function logCurrentSchedule() {
    console.log("Current schedule: ", currentSchedule);
}

// logDateList
function logDateList() {
    console.log("Date list: ", dateList);
}

// logWeekdayID
function logWeekdayID() {
    console.log("Weekday ID: ", weekdayID);
}

// changeSchedule
// Allows you to manually modify what schedule is currently active in order to see
// if the schedule functions properly.
function changeSchedule(scheduleName){
    if (weeklySchedule[scheduleName]) {
        currentSchedule = weeklySchedule[scheduleName];
        console.log(`Schedule changed to ${scheduleName}: `, currentSchedule);
        updateSchedule();
    } else {
        console.warn(`Schedule "${scheduleName}" not found in weeklySchedule.`);
    }
}

/** changeDate
* Allows you to manually modify the date in order to test special schedules.
* Proper date format is YYYY-MM-DD, but other formats may work depending
* on the browser's Date parsing capabilities. If the date is invalid,
* a warning will be logged and no changes will be made.
*/
function changeDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
        console.warn(`Invalid date string: "${dateString}". Please use a valid date format.`);
        console.warn(`Proper date format is YYYY-MM-DD`);
        return;
    }
    const temp = date.toLocaleDateString('en-US', { weekday: 'short' });
    weekdayID = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(temp);
    const isoDate = date.toISOString().split('T')[0];
    const specialName = isSpecialSchedule(isoDate);
    if (specialName && weeklySchedule[specialName]) {
        currentSchedule = weeklySchedule[specialName];
    } else {
        currentSchedule = weeklySchedule[weekdayID === 0 ? "Mon" : "Standard"] || weeklySchedule["Standard"];
    }
    console.log(`Date changed to ${dateString}. Current schedule: `, currentSchedule);
    updateSchedule();
}

function debugHelp() {
    console.log("Debugging functions:");
    console.log("- logCurrentSchedule(): Logs the current schedule to the console.");
    console.log("- logDateList(): Logs the list of special dates to the console.");
    console.log("- logWeekdayID(): Logs the current weekday ID to the console.");
    console.log("- changeSchedule(scheduleName): Changes the current schedule to the specified schedule name (e.g., 'Mon', 'Standard', 'Minimum Day').");
    console.log("- changeDate(dateString): Changes the current date to test special schedules. Use format YYYY-MM-DD (e.g., '2024-12-25').");
}