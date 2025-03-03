import { useState, useEffect } from "react";
import { toTitleCase } from "../backend/getTideInfo";
import "./MainInfoSection.css";

export const MainInfoSection = ({
  stationName,
  currentTide,
  nextTideExtreme,
}) => {
  const [location, setLocation] = useState("--");
  const [tide, setTide] = useState("--");
  const [tideSign, setTideSign] = useState("");
  const [nextTide, setNextTideExtreme] = useState("--");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocation(toTitleCase(stationName));
        setTide(Math.abs(currentTide.toFixed(2)));

        if (currentTide > 0) {
          setTideSign("+");
        } else {
          setTideSign("-");
        }

        const tideExtremeType = nextTideExtreme.type;
        const tideExtremeHeight = nextTideExtreme.h.toFixed(2);
        const tideExtremeHours = nextTideExtreme.t.getHours();
        const tideExtremeMinutes = nextTideExtreme.t.getMinutes();
        setNextTideExtreme(
          `${tideExtremeType} of ${tideExtremeHeight} at ${tideExtremeHours}:${tideExtremeMinutes}`
        );
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
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
