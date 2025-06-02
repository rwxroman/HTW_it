const yearSelect = document.getElementById("year");
const calendarContainer = document.getElementById("yearly-calendar");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function doTitle() {
  let title = document.getElementsByTagName("title");
  title = "test";
}
doTitle();

function populateYearSelector() {
  for (let y = 2000; y <= 2099; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }

  const now = new Date();
  yearSelect.value = now.getFullYear();
}

function generateMonth(month, year) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDiv = document.createElement("div");
  monthDiv.classList.add("month");

  const title = document.createElement("h2");
  title.textContent = months[month];
  monthDiv.appendChild(title);

  const weekdaysDiv = document.createElement("div");
  weekdaysDiv.classList.add("weekdays");
  weekdays.forEach(day => {
    const dayEl = document.createElement("div");
    dayEl.textContent = day;
    weekdaysDiv.appendChild(dayEl);
  });
  monthDiv.appendChild(weekdaysDiv);

  const daysDiv = document.createElement("div");
  daysDiv.classList.add("days");

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    daysDiv.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement("div");
    dayEl.textContent = d;
    daysDiv.appendChild(dayEl);
  }

  monthDiv.appendChild(daysDiv);
  return monthDiv;
}

function renderYearlyCalendar(year) {
  calendarContainer.innerHTML = "";
  for (let m = 0; m < 12; m++) {
    const month = generateMonth(m, year);
    calendarContainer.appendChild(month);
  }
}

yearSelect.addEventListener("change", () => {
  const selectedYear = parseInt(yearSelect.value);
  renderYearlyCalendar(selectedYear);
});

populateYearSelector();
renderYearlyCalendar(parseInt(yearSelect.value));
