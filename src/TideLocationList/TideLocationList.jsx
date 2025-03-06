import { TideDependents } from "../TideDependents/TideDependents";
export const TideLocationList = ({ stationIds }) => {
  return (
    <>
      {stationIds.map((stationId, index) => {
        return <TideDependents id={stationId} key={index} />;
      })}
    </>
  );
};
