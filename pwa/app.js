/*
C:  titl zeigt den aktuellen tag an aber wird nicht mehr aktuallisiert ,:D
    
TODO:   title repparieren
        color today repparieren
        topbarfunktion
        feiertage aus json laden

*/

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

function getWeekNumber(date) {
  // ISO 8601: Woche beginnt am Montag, KW 1 enthält den ersten Donnerstag des Jahres
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  // Donnerstag dieser Woche finden
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  // 1. Januar der KW-Jahres
  const week1 = new Date(temp.getFullYear(), 0, 4);
  // KW berechnen
  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

// generate a div for each month, using the right start of the week (month does not always start on monday)
function generateMonth(month, year) {
  // Berechne den Wochentag des ersten Tages (0 = Sonntag, 1 = Montag, ...)
  // Passe an, damit Montag = 0, Sonntag = 6
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDiv = document.createElement("div");
  monthDiv.classList.add("month");

  const title = document.createElement("h2");
  title.textContent = months[month];
  monthDiv.appendChild(title);

  const weekdaysDiv = document.createElement("div");
  weekdaysDiv.classList.add("weekdays");
  // KW-Header
  const kwHeader = document.createElement("div");
  kwHeader.textContent = "KW";
  kwHeader.classList.add("kw");
  weekdaysDiv.appendChild(kwHeader);
  weekdays.forEach(day => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    weekdaysDiv.appendChild(dayElement);
  });
  monthDiv.appendChild(weekdaysDiv);

  const daysDiv = document.createElement("div");
  daysDiv.classList.add("days");

  let day = 1;
  let started = false;
  // Anzahl der Wochenzeilen berechnen
  const totalRows = Math.ceil((firstDay + daysInMonth) / 7);

  for (let row = 0; row < totalRows; row++) {
    // KW für die erste Zelle der Woche berechnen
    let firstDateOfWeek = new Date(year, month, 1 + row * 7 - firstDay);
    const kw = getWeekNumber(firstDateOfWeek);

    // KW-Zelle
    const kwDiv = document.createElement("div");
    kwDiv.textContent = kw;
    kwDiv.classList.add("kw");
    daysDiv.appendChild(kwDiv);

    for (let col = 0; col < 7; col++) {
      const cell = document.createElement("div");
      const cellIndex = row * 7 + col;
      if (cellIndex < firstDay || day > daysInMonth) {
        // Leere Zellen vor dem 1. und nach letztem Tag
        daysDiv.appendChild(cell);
      } else {
        cell.textContent = day;
        cell.classList.add(months[month], day);
        daysDiv.appendChild(cell);
        day++;
      }
    }
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
  colorHolidays();
  colorToday();
  colorMovableHolidays(year);
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

function escapeDaySelector(day) {
  // CSS-Escape für Zahlen am Anfang: \3X für einstellige, \32 0 für 20 usw.
  if (day < 10) {
    return `\\3${day} `;
  } else {
    return `\\3${day.toString()[0]} ${day.toString()[1]}`;
  }
}

function colorMovableHolidays(year) {
  const feiertage = berechnenBeweglicheFeiertage(year);

  Object.entries(feiertage).forEach(([name, date]) => {
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const daySelector = escapeDaySelector(day);
    const selector = `.${monthName}.${daySelector}`;
    const cell = document.querySelector(selector);
    if (cell) {
      cell.classList.add("holidayMove");
      cell.title = name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " ");
    }
    console.log(`${name}: ${day}. ${monthName} ${year} | Selector: ${selector}`);
  });
}

function colorToday() {
  let now = new Date();
  let month = months[now.getMonth()];
  let day = now.getDate(); // <-- das ist der Tag im Monat (1-31)
  let daySelector = escapeDaySelector(day);
  let selector = `.${month}.${daySelector}`;
  let cell = document.querySelector(selector);
  if (cell) {
    cell.classList.add("today");
  }
}

function setTitle() {
  let now = new Date();
  let month = months[now.getMonth()];
  let day = now.getDate(); 
  let year = now.getFullYear();
  document.title = "Calendar PWA : " + day + "." + month + "." + year;
}

yearSelect.addEventListener("change", () => {
  const selectedYear = parseInt(yearSelect.value);
  renderYearlyCalendar(selectedYear);
  colorHolidays();
  colorMovableHolidays(selectedYear);
});

function berechnenOsterSonntag(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = März, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day); // JS: Monat 0-basiert!
}

function berechnenBeweglicheFeiertage(year) {

  
  const ostersonntag = berechnenOsterSonntag(year);

  const aschermittwoch = new Date(ostersonntag);
    aschermittwoch.setDate(aschermittwoch.getDate() - 46); // Aschermittwoch ist 46 Tage vor Ostersonntag
  const karfreiteg = new Date(ostersonntag);
    karfreiteg.setDate(karfreiteg.getDate() - 2); // Karfreitag ist 2 Tage vor Ostersonntag
  const ostermontag = new Date(ostersonntag);
    ostermontag.setDate(ostermontag.getDate() + 1); // Ostermontag ist am Tag nach Ostersonntag
  const christi_himmelfahrt = new Date(ostersonntag);
    christi_himmelfahrt.setDate(christi_himmelfahrt.getDate() + 39); // Christi Himmelfahrt ist 39 Tage nach Ostersonntag
  const pfingstsonntag = new Date(ostersonntag);
    pfingstsonntag.setDate(pfingstsonntag.getDate() + 49); // 49 Tage nach Ostersonntag
  const pfingstmontag = new Date(ostersonntag);
    pfingstmontag.setDate(pfingstmontag.getDate() + 50); // Pfingstmontag ist 50 Tage nach Ostersonntag
  const fronleichnam = new Date(ostersonntag);
    fronleichnam.setDate(fronleichnam.getDate() + 60); // Fronleichnam ist 60 Tage nach Ostersonntag

  return {
    ostersonntag: ostersonntag,
    aschermittwoch: aschermittwoch,
    karfreitag: karfreiteg,
    ostermontag: ostermontag,
    christi_himmelfahrt: christi_himmelfahrt,
    pfingstsonntag: pfingstsonntag,
    pfingstmontag: pfingstmontag,
    fronleichnam: fronleichnam
  };

}

populateYearSelector();
// populateMonthSelector();
getStaticHolidays();
renderYearlyCalendar(parseInt(yearSelect.value));
colorHolidays();
colorToday();
setTitle();

//    ^^
//  <° )
//   \  ^^^^  /\
//    \        /
//       |   |