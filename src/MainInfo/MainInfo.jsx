import { useState, useEffect } from "react";
import { getTideInfo } from "../backend/getTideInfo";

export const MainInfo = () => {
  const [location, setLocation] = useState("--");
  const [tide, setTide] = useState("--");
  const [tideSign, setTideSign] = useState("");
  const [nextLowTide, setNextLowTide] = useState("--");
  const [nextHighTide, setNextHighTide] = useState("--");

  let currLocation = "TEC3783";

  useEffect(() => {
    return async () => {
      const [lowTide, highTide, currentTide] = await getTideInfo(currLocation);
      setLocation(currLocation);
      setTide(Math.abs(currentTide.toFixed(2)));
      if (currentTide > 0) setTideSign("+");
      else {
        setTideSign("-");
      }
      setNextLowTide(
        `${lowTide.h.toFixed(
          2
        )} at ${lowTide.t.getHours()}:${lowTide.t.getMinutes()}`
      );
      setNextHighTide(
        `${highTide.h.toFixed(
          2
        )} at ${highTide.t.getHours()}:${highTide.t.getMinutes()}`
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
      <div className="location-tide-low">Next High Tide: {nextHighTide}</div>
      <div className="location-tide-high">Next Low Tide: {nextLowTide}</div>
    </div>
  );
};
