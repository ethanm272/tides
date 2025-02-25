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
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  let todayTomorrow = [getDateFormatted(now), getDateFormatted(tomorrow)];
  fetch(
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${todayTomorrow[0]}&end_date=${todayTomorrow[1]}&station=${refStationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
  )
    .then((resp) => resp.json())
    .then((data) =>
      getTidesFromId(
        data,
        now,
        heightOffsetLowTide,
        heightOffsetHighTide,
        timeOffesetLowTide,
        timeOffsetHighTide
      )
    )
    .then((info) => {
      return info;
    })
    .catch((e) => console.error(e));
};

const getTidesFromId = (
  data,
  now,
  heightOffsetLowTide,
  heightOffsetHighTide,
  timeOffsetLowTide,
  timeOffsetHighTide
) => {
  let highTide = { t: new Date(), h: -10 };
  let lowTide = { t: new Date(), h: 10 };
  let tidesGraph = [];
  let tidesCounter = 0;
  const tidesToCount = 24 * 60;
  data.predictions.forEach((prediction) => {
    const predictionTime = new Date(prediction.t);
    const tidePrediction = Number(prediction.v);
    /** Get the first 24 tide predictions after the current time */
    if (predictionTime > now && tidesCounter < tidesToCount) {
      tidesGraph.push(tidePrediction);
      tidesCounter++;

      /** Find Next High Tide */ // TODO fix so it is next high tide not highest tide
      if (tidePrediction > highTide.h) {
        highTide.h = tidePrediction;
        highTide.t = predictionTime;
      }

      /** Find Next Low Tide */ // TODO fix so it is next low tide not lowest tide
      else if (tidePrediction < lowTide.h) {
        lowTide.h = tidePrediction;
        lowTide.t = predictionTime;
      }
    }
  });
  /** 
  highTide.h += heightOffsetHighTide;
  highTide.t += 60000 * timeOffsetHighTide;
  lowTide.h += heightOffsetLowTide;
  lowTide.t += 60000 * timeOffsetLowTide;
  */

  console.log(lowTide);
  console.log(highTide);

  return { l: lowTide, h: highTide };
};

const getDateFormatted = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return yyyy + mm + dd;
};

getTideInfo("TEC3783");
