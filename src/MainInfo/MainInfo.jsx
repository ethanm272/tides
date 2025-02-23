import { useState } from "react";

export const MainInfo = () => {
  const [location, setLocation] = useState("Jupiter");

  return (
    <div className="main-info">
      <div className="location-name">{location}</div>
      <div className="location-tide">
        <span className="offset">+</span>
        <span className="centered">2.5</span>
      </div>
      <div className="location-tide-low">Next High Tide: 7:30pm</div>
      <div className="location-tide-high">Next Low Tide: 1:30am</div>
    </div>
  );
};
