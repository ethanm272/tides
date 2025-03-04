import "./DayTideTableCard.css";
import { formatTimeHH_MM } from "../../UtilityFunctions/FormatTimeHH_MM";

export const DayTideTableCard = ({ date, tides }) => {
  const options = { month: "numeric", day: "numeric" };

  return (
    <div className="tide-table-card">
      <div className="tide-table-card-date">
        {date.toLocaleDateString("en-US", options)}
      </div>
      {tides.map((tide, index) => {
        return (
          <div key={index} className="tide-table-card-tide">
            {tide.type}: {tide.h.toFixed(1)} - {formatTimeHH_MM(tide.t)}
          </div>
        );
      })}
    </div>
  );
};
