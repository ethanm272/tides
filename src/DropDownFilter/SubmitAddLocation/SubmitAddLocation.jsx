import { useState } from "react";
import "./SubmitAddLocation.css";

export const SubmitAddLocation = ({ addStation }) => {
  const locations = new Map([
    ["jupiter", "12345"],
    ["jupiter inlet", "8722495"],
    ["palm beach", "12347"],
    ["miami", "12348"],
    ["fort lauderdale", "12349"],
  ]);

  const searchBar = document.getElementById("search-entry");

  const [submitError, setSubmitError] = useState(false);

  const submitLocation = () => {
    const submition = searchBar.value;
    const stationId = locations.get(submition);
    if (stationId) {
      setSubmitError(false);
      addStation(stationId);
    } else {
      setSubmitError(true);
    }
  };

  const errorMessage = () => {
    return <div className="submit-error">Station not found.</div>;
  };

  return (
    <>
      {submitError && errorMessage()}
      <button onClick={submitLocation} type="button" className="submit-button">
        Add
      </button>
    </>
  );
};
