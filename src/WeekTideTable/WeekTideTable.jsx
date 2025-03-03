import { DayTideTableCard } from "./DayTideTableCard/DayTideTableCard";
import "./WeekTideTable.css";

export const WeekTideTable = ({ tideExtremes }) => {
  let tideExtremesByDay = [];
  let i = 0;
  let tideDayIndex = 0;
  while (i < tideExtremes.length) {
    tideExtremesByDay.push([]);
    const currDate = tideExtremes[i].t.getDate();
    while (
      i < tideExtremes.length &&
      tideExtremes[i].t.getDate() === currDate
    ) {
      tideExtremesByDay[tideDayIndex].push(tideExtremes[i]);
      i++;
    }
    tideDayIndex++;
  }

  return (
    <div className="tide-table">
      <p className="tide-table-title">This Weeks Tides</p>
      <div className="week-tide-table">
        {tideExtremesByDay.map((daysTides, index) => (
          <DayTideTableCard
            className="day-tide-table-card"
            key={index}
            date={daysTides[0].t}
            tides={daysTides}
          />
        ))}
      </div>
    </div>
  );
};
