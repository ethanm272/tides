import { TideDependents } from "../TideDependents/TideDependents";
import "./TideLocationList.css";

export const TideLocationList = ({ stationIds }) => {
  return (
    <div className="tide-location-list">
      {stationIds.map((stationId, index) => {
        return <TideDependents id={stationId} key={index} />;
      })}
    </div>
  );
};
