import { useState, useEffect } from "react";
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

  return (
    <div className="results-list">
      {filteredData.map((data, index) => (
        <button onClick={() => setInput(data)} key={index} type="button">
          {data}
        </button>
      ))}
    </div>
  );
};
