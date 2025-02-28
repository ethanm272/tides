import { useState, useEffect } from "react";
import {
  getTideInfo,
  getStationName,
  toTitleCase,
} from "../backend/getTideInfo";

export const MainInfo = () => {
  const [location, setLocation] = useState("--");
  const [tide, setTide] = useState("--");
  const [tideSign, setTideSign] = useState("");
  const [nextTide, setNextTide] = useState("--");

  let currLocation = "8722495";

  useEffect(() => {
    return async () => {
      const stationName = await getStationName(currLocation);
      setLocation(toTitleCase(stationName));
      const [nextTideInfo, currentTide] = await getTideInfo(currLocation);
      console.log(nextTideInfo);
      setTide(Math.abs(currentTide.toFixed(2)));
      if (currentTide > 0) setTideSign("+");
      else {
        setTideSign("-");
      }
      setNextTide(
        `${nextTideInfo.type} of ${nextTideInfo.h.toFixed(
          2
        )} ft. at ${nextTideInfo.t.getHours()}:${nextTideInfo.t.getMinutes()}`
      );
    };
  }, []);

  return (
    <div className="main-info">
      <div className="location-name">{location}</div>
      <div className="location-tide">
        <span className="offset">{tideSign}</span>
        <span className="centered">{tide}</span>
      </div>
      <div className="location-tide-low">Next Tide: {nextTide}</div>
    </div>
  );
};
