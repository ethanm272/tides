import { useState } from "react";
import "./SubmitAddLocation.css";
import data from "../../data/data.json";

const stationDataArr = data.stations.map((obj) => {
  return [obj.name, obj.id];
});
const locations = new Map(stationDataArr);

export const SubmitAddLocation = ({ addStation, setLocationPopUp }) => {
  const searchBar = document.getElementById("search-entry");

  const [submitError, setSubmitError] = useState(false);

  const submitLocation = () => {
    const submition = searchBar.value;
    const stationId = locations.get(submition);
    if (stationId) {
      setSubmitError(false);
      addStation(stationId);
      setLocationPopUp(false);
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
