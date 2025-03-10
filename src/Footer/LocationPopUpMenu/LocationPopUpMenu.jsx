import "./LocationPopUpMenu.css";
import { DropDownFilter } from "../../DropDownFilter/DropDownFilter";

export const LocationPopUpMenu = (addStation, setLocationPopUp) => {
  return (
    <div className="location-pop-up">
      <DropDownFilter
        addStation={addStation}
        setLocationPopUp={setLocationPopUp}
      />
    </div>
  );
};
