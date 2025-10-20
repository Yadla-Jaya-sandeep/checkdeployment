import React, { useEffect, useState } from "react";
import "./FlipCalendarReal.css";
 
const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December",
];

// Get number of days in month
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get grid for calendar display (weeks of days with empty slots)
const getCalendarGrid = (month, year) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday-start
  const totalSlots = daysInMonth + firstDayIndex;
  const weeks = [];
  let day = 1;
 
  for (let i = 0; i < Math.ceil(totalSlots / 7); i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      const slotIndex = i * 7 + j;
      if (slotIndex < firstDayIndex || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day);
        day++;
      }
    }
    weeks.push(week);
  }
  return weeks;
};
 
export default function FlipCalendarReal({ birthdayMonthIndex = 9, birthdayDate = 23 }) {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const year = new Date().getFullYear();
 
  useEffect(() => {
    if (currentMonth < birthdayMonthIndex) {
      const flipTimeout = setTimeout(() => {
        setFlipped(true);
        const nextMonthTimeout = setTimeout(() => {
          setCurrentMonth((prev) => prev + 1);
          setFlipped(false);
        }, 600);
        return () => clearTimeout(nextMonthTimeout);
      }, 1500);
 
      return () => clearTimeout(flipTimeout);
    }
  }, [currentMonth, birthdayMonthIndex]);
 
  const weeks = getCalendarGrid(currentMonth, year);
 
  return (
    <div className="flip-calendar-real full-calendar">
      <h3 className="month-title">{monthNames[currentMonth]} {year}</h3>
      <div className={`flip-card-real ${flipped ? "flipped" : ""}`}>
        <div className="flip-front-real">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
                <th>Thu</th><th>Fri</th><th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((date, di) => (
                    <td
                      key={di}
                      className={`date-cell ${date === birthdayDate && currentMonth === birthdayMonthIndex ? "birthday-cell" : ""}`}
                    >
                      {date === birthdayDate && currentMonth === birthdayMonthIndex ? (
                        // <span className="love-symbol">❤️ {date}</span>
                        <span className="love-symbol"><span className="heart-shape">❤️</span><span className="heart-date">{date}</span></span>

                      ) : (
                        date || ""
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flip-back-real">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
                <th>Thu</th><th>Fri</th><th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {getCalendarGrid((currentMonth + 1) % 12, year).map((week, wi) => (
                <tr key={wi}>
                  {week.map((date, di) => (
                    <td
                      key={di}
                      className={`date-cell ${
                        date === birthdayDate && ((currentMonth + 1) % 12) === birthdayMonthIndex
                          ? "birthday-cell"
                          : ""
                      }`}
                    >
                      {date === birthdayDate && ((currentMonth + 1) % 12) === birthdayMonthIndex ? (
                        <span className="love-symbol">❤️ {date}</span>
                      ) : (
                        date || ""
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 