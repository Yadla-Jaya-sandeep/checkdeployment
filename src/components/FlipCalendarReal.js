import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
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
 
export default function FlipCalendarReal({ birthdayMonthIndex = 9, birthdayDate = 23, currentMonth, setCurrentMonth }) {
  // If props not provided, fallback to local state for standalone use
  const [localMonth, setLocalMonth] = useState(0);
  const month = typeof currentMonth === "number" ? currentMonth : localMonth;
  const setMonth = typeof setCurrentMonth === "function" ? setCurrentMonth : setLocalMonth;
  const [flipped, setFlipped] = useState(false);
  const year = new Date().getFullYear();
 
  useEffect(() => {
    if (month < birthdayMonthIndex) {
      const flipTimeout = setTimeout(() => {
        setFlipped(true);
        const nextMonthTimeout = setTimeout(() => {
          setMonth((prev) => prev + 1);
          setFlipped(false);
        }, 600);
        return () => clearTimeout(nextMonthTimeout);
      }, 1500);

      return () => clearTimeout(flipTimeout);
    }
  }, [month, birthdayMonthIndex, setMonth]);
 
  const weeks = getCalendarGrid(month, year);
 
  return (
    <div className="flip-calendar-real full-calendar" style={{ position: "relative" }}>
      {currentMonth < birthdayMonthIndex && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={350}
          gravity={0.25}
          wind={0.01}
          opacity={0.85}
          colors={["#ff69b4", "#ffd700", "#00bfff", "#32cd32", "#ff6347", "#e91e63", "#fff"]}
        />
      )}
  <h3 className="month-title">{monthNames[month]} {year}</h3>
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
                      className={`date-cell ${date === birthdayDate && month === birthdayMonthIndex ? "birthday-cell" : ""}`}
                    >
                      {date === birthdayDate && month === birthdayMonthIndex ? (
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
              {getCalendarGrid((month + 1) % 12, year).map((week, wi) => (
                <tr key={wi}>
                  {week.map((date, di) => (
                    <td
                      key={di}
                      className={`date-cell ${
                        date === birthdayDate && ((month + 1) % 12) === birthdayMonthIndex
                          ? "birthday-cell"
                          : ""
                      }`}
                    >
                      {date === birthdayDate && ((month + 1) % 12) === birthdayMonthIndex ? (
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
 