import { useState, useEffect } from "react";
import { MainInfoSection } from "../MainInfoSection/MainInfoSection";
import { TideChart } from "../TideChart/TideChart";
import { DayTideTableCard } from "../WeekTideTable/DayTideTableCard/DayTideTableCard";
import { WeekTideTable } from "../WeekTideTable/WeekTideTable";
import {
  getTideInfo,
  getStationName,
  toTitleCase,
} from "../backend/getTideInfo";

let currLocation = "8722495";

export const TideDependents = () => {
  const [stationName, setStationName] = useState("--");
  const [currentTide, setCurrentTide] = useState("--");
  const [nextTideExtreme, setNextTideExtreme] = useState("");
  const [tideExtremes, setTideExtremes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const name = await getStationName(currLocation);
        setStationName(toTitleCase(name));

        const [currentTideData, nextTide, tideExtremeData] = await getTideInfo(
          currLocation
        );
        setCurrentTide(currentTideData);
        setNextTideExtreme(nextTide);
        setTideExtremes(tideExtremeData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <></>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <MainInfoSection
        stationName={stationName}
        currentTide={currentTide}
        nextTideExtreme={nextTideExtreme}
      />
      <TideChart tideExtremes={tideExtremes} />
      <WeekTideTable tideExtremes={tideExtremes} />
    </>
  );
};
