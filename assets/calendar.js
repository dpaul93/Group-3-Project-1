// CALENDAR

const weekDay = dayjs().format('dddd');
const month = dayjs().format('MMMM');
const date = dayjs().format('DD');
const year = dayjs().format('YYYY');

function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');    
    const currentTime = dayjs().format('HH:mm:ss');
    currentTimeElement.textContent = currentTime;
  }  
updateCurrentTime();
setInterval(updateCurrentTime, 1000); 

const currentDay = document.getElementById('current-day');
currentDay.textContent = weekDay;

const currentMonth = document.getElementById('current-month');
currentMonth.textContent = month;

const currentDate = document.getElementById('current-date');
currentDate.textContent = date;

const currentYear = document.getElementById('current-year');
currentYear.textContent = year;










