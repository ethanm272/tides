export const getTideInfo = (stationId) => {
  fetch(
    `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}/tidepredoffsets.json`
  )
    .then((resp) => resp.json())
    .then((data) => {
      const {
        refStationId,
        heightOffsetHighTide,
        heightOffsetLowTide,
        timeOffsetHighTide,
        timeOffesetLowTide,
      } = data;
      return getTideFromRef(
        refStationId,
        heightOffsetHighTide,
        heightOffsetLowTide,
        timeOffsetHighTide,
        timeOffesetLowTide
      );
    })
    .catch((e) => console.error(e));
};

const getTideFromRef = (
  refStationId,
  heightOffsetHighTide,
  heightOffsetLowTide,
  timeOffsetHighTide,
  timeOffesetLowTide
) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  const tomorrow = new Date(now + oneDay);
  let todayTomorrow = [getDateFormatted(now), getDateFormatted(tomorrow)];
  fetch(
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${todayTomorrow[0]}&end_date=${todayTomorrow[1]}&station=${refStationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
  )
    .then((resp) => resp.json())
    .then((data) => console.log(data) /** TODO plot info and high/low tide **/)
    .catch((e) => console.error(e));
};

const getDateFormatted = (date) => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  return yyyy + mm + dd;
};

getTideInfo("TEC3783");
