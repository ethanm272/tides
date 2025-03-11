import { TideDependents } from "../TideDependents/TideDependents";
import "./TideLocationList.css";

export const TideLocationList = ({ stationIds, deleteStation }) => {
  return (
    <div className="tide-location-list">
      {stationIds.map((stationId, index) => {
        return (
          <TideDependents
            id={stationId}
            key={index}
            deleteStation={deleteStation}
          />
        );
      })}
    </div>
  );
};
