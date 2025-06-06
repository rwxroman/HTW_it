const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const calendarContainer = document.getElementById("yearly-calendar");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// generate elements in the year-dropdown
function populateYearSelector() {
  for (let y = 2000; y <= 2099; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
// default select year now
  const now = new Date();
  yearSelect.value = now.getFullYear();
}

// function populateMonthSelector() {
//   for (let y = 1; y <= 12; y++) {
//     const option = document.createElement("option");
//     option.value = y;
//     option.textContent = y;
//     monthSelect.appendChild(option);
//   }

//   const now = new Date();
//   monthSelect.value = now.getMonth();
// }

// generate a div for each month, using the right start of the week (month does not always start on monday)
function generateMonth(month, year) {
  // Berechne den Wochentag des ersten Tages (0 = Sonntag, 1 = Montag, ...)
  let firstDay = new Date(year, month, 1).getDay();
  // Passe an, damit Montag = 0, Sonntag = 6
  firstDay = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDiv = document.createElement("div");
  monthDiv.classList.add("month");

  const title = document.createElement("h2");
  title.textContent = months[month];
  monthDiv.appendChild(title);

  const weekdaysDiv = document.createElement("div");
  weekdaysDiv.classList.add("weekdays");
  weekdays.forEach(day => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    weekdaysDiv.appendChild(dayElement);
  });
  monthDiv.appendChild(weekdaysDiv);

  const daysDiv = document.createElement("div");
  daysDiv.classList.add("days");

  // empty cells before first day of the month
  for (let i = 0; i < firstDay; i++) {
    daysDiv.appendChild(document.createElement("div"));
  }



  for (let d = 1; d <= daysInMonth; d++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = d;
    daysDiv.appendChild(dayElement);
    dayElement.classList.add(months[month], d);
  }

  monthDiv.appendChild(daysDiv);
  return monthDiv;
}

function getStaticHolidays() {
fetch('staticHolidays.json')
  .then(response => response.json())
  .then(holidays => {
    console.log("json loading success");
  })
  .catch(error => {
    console.error('Error while trying to load holidays:', error);
  });
}

// generate the final yearly calendar
function renderYearlyCalendar(year) {
  calendarContainer.innerHTML = "";
  for (let m = 0; m < 12; m++) {
    const month = generateMonth(m, year);

    // color holidays
    // if (day and month) == (day and month in staticHolidays) {
    //    set style to background-color: green;
    //    OR
    //    set class to holiday and .holiday in css file = background-color: green;
    // }

    calendarContainer.appendChild(month);
  }
  document.title = "Calendar PWA : " +  year;
  colorHolidays();
  colorToday();
}


function colorHolidays() {
  // TODO: get dates from json and parse it
  document.querySelector(".January.\\31").classList.add("holiday");
  document.querySelector(".May.\\31").classList.add("holiday");
  document.querySelector(".October.\\33").classList.add("holiday");
  document.querySelector(".October.\\33\\31").classList.add("holiday");
  document.querySelector(".December.\\32\\35").classList.add("holiday");
  document.querySelector(".December.\\32\\36").classList.add("holiday");
}

function colorToday() {
  let now = new Date();
  let month = months[now.getMonth()]; // to get the month-word instead of month-number
  let day = now.getDay()+1; // 0-indexed
  // console.log(month, day);
  // document.querySelector(".June.\\34").classList.add("today");
  
  // only workd for one-digit dates
  document.querySelector("." + month + ".\\3" + day).classList.add("today");
  
  // TODO: fix for two-digit day-dates
  // if (day > 9) {
  //   day[0] = "\33" + day[0];
  //   day[1] = "\33" + day[1];
  // }

}

yearSelect.addEventListener("change", () => {
  const selectedYear = parseInt(yearSelect.value);
  renderYearlyCalendar(selectedYear);
  colorHolidays();
});


populateYearSelector();
// populateMonthSelector();
getStaticHolidays();
renderYearlyCalendar(parseInt(yearSelect.value));
colorHolidays();
colorToday();

//    ^^
//  <° )
//   \  ^^^^  /\
//    \        /
//       |   |