import { useEffect, useState } from "react";
import { TideDependents } from "./TideDependents/TideDependents";
import { Footer } from "./Footer/Footer";
import { NoLocationsPage } from "./NoLocationsPage/NoLocationsPage";
import "./index.css";

const localStorageName = "stationsIds";

function App() {
  const [hasLocations, setHasLocations] = useState(false);
  const [stationIds, setStationIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationIdsData = localStorage.getItem(localStorageName);
        if (stationIdsData) {
          setHasLocations(true);
          setStationIds(stationIdsData);
        }
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
  }, [stationIds]);

  const addStationId = (id) => {
    setStationIds(stationIds.concat([id]));
    console.log(localStorage.getItem(localStorageName));
    localStorage.setItem(localStorageName, id);
  };

  if (hasLocations) {
    return (
      <>
        <TideDependents id={stationIds} />
        <Footer />
      </>
    );
  }

  return <NoLocationsPage addStation={addStationId} />;
}

export default App;
