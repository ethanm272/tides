import "./Footer.css";
import { useState } from "react";
import { LocationPopUpMenu } from "./LocationPopUpMenu/LocationPopUpMenu";

export const Footer = ({ addStation }) => {
  const [locationPopUp, setLocationPopUp] = useState(false);
  return (
    <>
      {locationPopUp && LocationPopUpMenu(addStation, setLocationPopUp)}
      <div className="footer">
        <button type="button" className="btn-left">
          <img
            src="/Images/icons8-list-24.png"
            alt="List Locations"
            height="24"
            width="24"
          />
        </button>
        <div className="page-indicator"></div>
        <button
          type="button"
          className="btn-right"
          onClick={() => setLocationPopUp(!locationPopUp)}
        >
          <img
            src="/Images/icons8-plus-30.png"
            alt="Add Location"
            height="30"
            width="30"
          />
        </button>
      </div>
    </>
  );
};
