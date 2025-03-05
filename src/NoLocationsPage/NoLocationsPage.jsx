import "./NoLocationsPage.css";
import { Footer } from "../Footer/Footer";

export const NoLocationsPage = () => {
  return (
    <>
      <div className="no-locations-main">
        <div className="no-locations-notification">
          <span className="no-wrap">No established locations.</span>{" "}
          <span className="no-wrap">Add locations using the 'plus'.</span>
        </div>
      </div>
      <Footer />
    </>
  );
};
