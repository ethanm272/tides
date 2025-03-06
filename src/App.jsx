import { useEffect, useState } from "react";
import { TideLocationList } from "./TideLocationList/TideLocationList";
import { Footer } from "./Footer/Footer";
import { NoLocationsPage } from "./NoLocationsPage/NoLocationsPage";
import { splitStringBySpaces } from "./UtilityFunctions/StringUtilities";
import "./index.css";

const localStorageName = "stationsIds";

function App() {
  const [hasLocations, setHasLocations] = useState(false);
  const [stationIds, setStationIds] = useState([]);
  const [hasError, setHasError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationIdsData = localStorage.getItem(localStorageName);
        const stationIdsArr = splitStringBySpaces(stationIdsData);
        if (stationIdsArr.length > 0) {
          setHasLocations(true);
          setStationIds(stationIdsArr);
        }
      } catch (e) {
        setHasError(e);
      }
    };
    fetchData();
  }, []);

  const addStationId = (id) => {
    setStationIds(stationIds.concat([id]));
    if (localStorage.getItem(localStorageName)) {
      localStorage.setItem(
        localStorageName,
        localStorage.getItem(localStorageName) + " " + id
      );
    } else {
      localStorage.setItem(localStorageName, id);
    }
    setHasLocations(true);
  };

  if (hasLocations) {
    return (
      <>
        <TideLocationList stationIds={stationIds} />
        <Footer addStation={addStationId} />
      </>
    );
  }

  return <NoLocationsPage addStation={addStationId} />;
}

export default App;
