import "./LocationPopUpMenu.css";
import { DropDownFilter } from "../../DropDownFilter/DropDownFilter";

export const LocationPopUpMenu = (addStation) => {
  return (
    <div className="location-pop-up">
      <DropDownFilter addStation={addStation} />
    </div>
  );
};
