const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const weekdays = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const GLISSANT_HORIZON_YEARS = 2;

// Jours feries legaux en Belgique (fetes fixes + mobiles liees a Paques).
function buildBelgianHolidaySet(year) {
  const set = new Set([
    "01-01",
    "05-01",
    "07-21",
    "08-15",
    "11-01",
    "11-11",
    "12-25",
  ]);

  const easterSunday = getEasterSunday(year);
  const offsets = [1, 39, 50];
  offsets.forEach((offset) => {
    const d = new Date(easterSunday);
    d.setDate(d.getDate() + offset);
    set.add(formatMonthDay(d));
  });

  return set;
}

function getEasterSunday(year) {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function formatMonthDay(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function getHolidaySetForYear(year, holidayByYear) {
  if (!holidayByYear[year]) {
    holidayByYear[year] = buildBelgianHolidaySet(year);
  }
  return holidayByYear[year];
}

function isoWeekNumber(date) {
  const copy = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const weekday = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
  return Math.ceil(((copy - yearStart) / 86400000 + 1) / 7);
}

function mondayStart(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildMonthTable(baseYear, absoluteMonthIndex, holidayByYear) {
  const firstDay = new Date(baseYear, absoluteMonthIndex, 1);
  const monthYear = firstDay.getFullYear();
  const monthOnly = firstDay.getMonth();
  const lastDay = new Date(monthYear, monthOnly + 1, 0);
  const weekStart = mondayStart(firstDay);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const weekHead = document.createElement("th");
  weekHead.textContent = "Semaine";
  headerRow.appendChild(weekHead);

  weekdays.forEach((w) => {
    const th = document.createElement("th");
    th.textContent = w;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const cursor = new Date(weekStart);

  while (cursor <= lastDay) {
    const tr = document.createElement("tr");

    const wn = document.createElement("td");
    wn.className = "weekNumber";
    wn.textContent = String(isoWeekNumber(cursor));
    tr.appendChild(wn);

    for (let i = 0; i < 7; i += 1) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + i);

      const td = document.createElement("td");
      const inMonth =
        d.getFullYear() === monthYear && d.getMonth() === monthOnly;
      const mmdd = formatMonthDay(d);
      const sunday = i === 6;

      if (!inMonth) {
        td.classList.add("outsideMonth");
        td.textContent = "";
      } else {
        td.textContent = String(d.getDate());
        if (sunday) td.classList.add("sunday");
        const holidaysForDateYear = getHolidaySetForYear(
          d.getFullYear(),
          holidayByYear,
        );
        if (holidaysForDateYear.has(mmdd)) td.classList.add("holiday");
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
    cursor.setDate(cursor.getDate() + 7);
  }

  table.appendChild(tbody);
  return table;
}

function buildMonthBlock(baseYear, absoluteMonthIndex, holidayByYear) {
  const monthRef = new Date(baseYear, absoluteMonthIndex, 1);
  const displayYear = monthRef.getFullYear();
  const displayMonth = monthRef.getMonth();

  const section = document.createElement("section");
  section.className = "month";

  const yearLine = document.createElement("div");
  yearLine.className = "yearLine";

  const yearCell = document.createElement("div");
  yearCell.className = "yearValue";
  yearCell.textContent = String(displayYear);
  yearLine.appendChild(yearCell);

  const monthCell = document.createElement("div");
  monthCell.className = "monthName";
  monthCell.textContent = monthNames[displayMonth];
  yearLine.appendChild(monthCell);

  section.appendChild(yearLine);
  section.appendChild(
    buildMonthTable(baseYear, absoluteMonthIndex, holidayByYear),
  );
  return section;
}

function buildCalendar(year, mode) {
  const root = document.getElementById("calendarRoot");
  root.innerHTML = "";
  const holidayByYear = {};
  const starts = [];

  if (mode === "glissant") {
    // Fevrier annee N -> janvier annee N+2 (dernier depart en novembre N+1).
    const lastStart = GLISSANT_HORIZON_YEARS * 12 - 2;
    for (let start = 1; start <= lastStart; start += 1) {
      starts.push(start);
    }
  } else {
    for (let start = 0; start < 12; start += 3) {
      starts.push(start);
    }
  }

  starts.forEach((startMonth) => {
    const page = document.createElement("article");
    page.className = "page";

    for (let i = 0; i < 3; i += 1) {
      page.appendChild(buildMonthBlock(year, startMonth + i, holidayByYear));
    }

    root.appendChild(page);
  });
}

function init() {
  const yearInput = document.getElementById("yearInput");
  const modeInput = document.getElementById("modeInput");
  const now = new Date();
  yearInput.value = String(now.getFullYear());

  const params = new URLSearchParams(window.location.search);
  const urlYear = Number(params.get("year"));
  const urlMode = params.get("mode");
  if (Number.isInteger(urlYear) && urlYear >= 1900 && urlYear <= 2100) {
    yearInput.value = String(urlYear);
  }
  if (urlMode === "glissant" || urlMode === "trimestre") {
    modeInput.value = urlMode;
  }

  buildCalendar(Number(yearInput.value), modeInput.value);

  document.getElementById("buildBtn").addEventListener("click", () => {
    const y = Number(yearInput.value);
    if (!Number.isInteger(y) || y < 1900 || y > 2100) {
      alert("Veuillez entrer une année entre 1900 et 2100.");
      return;
    }
    buildCalendar(y, modeInput.value);
  });

  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });
}

init();
