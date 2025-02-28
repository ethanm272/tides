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
    return () => {
      const tideInfo = getTideInfo(currLocation);
      setLocation(currLocation);
      setTide(tideInfo.c);
      if (tideInfo.c > 0) setTideSign("+");
      else {
        setTideSign("-");
      }
      setNextLowTide(`${tideInfo.l.t.getTime()} - ${tideInfo.l.h}`);
      setNextHighTide(`${tideInfo.h.t.getTime()} - ${tideInfo.h.h}`);
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
