import { useState, useEffect } from "react";
import "./ResultsList.css";
import data from "../../../data/data.json";

const stationDataArr = data.stations.map((obj) => {
  return [obj.name, obj.id];
});
const locations = new Map(stationDataArr);

const MAX_RESULTS_TO_DISPLAY = 5;

export const ResultsList = ({ text, inputField }) => {
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    return () => {
      setFilteredData(
        Array.from(locations.keys()).filter(
          (location) => text != "" && location.toLowerCase().includes(text)
        )
      );
    };
  }, [text]);

  const setInput = (text) => {
    setFilteredData([]);
    inputField(text);
  };

  if (filteredData.length === 0) {
    return (
      <div className="display-none">
        {filteredData.map((data, index) => (
          <button
            className="location-choice"
            onClick={() => setInput(data)}
            key={index}
            type="button"
          >
            {data}
          </button>
        ))}
      </div>
    );
  } else {
    return (
      <div className="results-list">
        {filteredData.map((data, index) => (
          <button
            className="location-choice"
            onClick={() => setInput(data)}
            key={index}
            type="button"
          >
            {data}
          </button>
        ))}
      </div>
    );
  }
};
