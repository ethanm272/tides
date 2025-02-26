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
        timeOffsetLowTide,
      } = data;
      console.log(refStationId);
      return getTideFromRef(
        refStationId,
        heightOffsetHighTide,
        heightOffsetLowTide,
        timeOffsetHighTide,
        timeOffsetLowTide
      );
    })
    .catch((e) => console.error(e));
};

const getTideFromRef = (
  refStationId,
  heightOffsetHighTide,
  heightOffsetLowTide,
  timeOffsetHighTide,
  timeOffsetLowTide
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
        timeOffsetLowTide,
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
  let highTideFound = false;
  let lowTideFound = false;
  const tidesToCount = 24 * 60;
  const predictions = data.predictions;
  for (let i = 1; i < predictions.length - 1; i++) {
    const predictionTime = new Date(predictions[i].t);
    const tidePrediction = Number(predictions[i].v);
    /** Get the first 24 tide predictions after the current time */
    if (predictionTime > now && tidesCounter < tidesToCount) {
      tidesGraph.push(tidePrediction);
      tidesCounter++;

      /** Find Next High Tide */
      if (
        tidePrediction >= Number(predictions[i - 1].v) &&
        tidePrediction >= Number(predictions[i + 1].v) &&
        !highTideFound
      ) {
        highTide.h = tidePrediction;
        highTide.t = predictionTime;
        highTideFound = true;
      } else if (
        /** Find Next Low Tide */
        tidePrediction <= Number(predictions[i - 1].v) &&
        tidePrediction <= Number(predictions[i + 1].v) &&
        !lowTideFound
      ) {
        lowTide.h = tidePrediction;
        lowTide.t = predictionTime;
        lowTideFound = true;
      }
    }
  }

  // Adjust tide levels
  highTide.t.setMinutes(highTide.t.getMinutes() + timeOffsetHighTide);
  highTide.h *= heightOffsetHighTide;
  lowTide.t.setMinutes(lowTide.t.getMinutes() + timeOffsetLowTide);
  lowTide.h *= heightOffsetLowTide;

  console.log(lowTide);
  console.log(highTide);

  return { l: lowTide, h: highTide, c: tidesGraph[0] };
};

const getDateFormatted = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return yyyy + mm + dd;
};

getTideInfo("TEC3783");
