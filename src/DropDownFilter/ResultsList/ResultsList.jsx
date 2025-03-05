import { useState, useEffect } from "react";
import "./ResultsList.css";

const locations = new Map([
  ["jupiter", "12345"],
  ["jupiter inlet", "12346"],
  ["palm beach", "12347"],
  ["miami", "12348"],
  ["fort lauderdale", "12349"],
]);

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
