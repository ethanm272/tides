export async function getTideInfo(stationId) {
  const offsetResponse = await fetch(
    `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}/tidepredoffsets.json`
  );
  const offsets = await offsetResponse.json();
  const {
    refStationId,
    heightOffsetHighTide,
    heightOffsetLowTide,
    timeOffsetHighTide,
    timeOffsetLowTide,
  } = offsets;
  const [today, tomorrow] = getTodayTomorrowDates(
    refStationId,
    heightOffsetHighTide,
    heightOffsetLowTide,
    timeOffsetHighTide,
    timeOffsetLowTide
  );
  const tidesResponse = await fetch(
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${today}&end_date=${tomorrow}&station=${refStationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
  );
  const unprocessedTides = await tidesResponse.json();
  const processedTides = processTides(
    unprocessedTides,
    new Date(),
    heightOffsetLowTide,
    heightOffsetHighTide,
    timeOffsetLowTide,
    timeOffsetHighTide
  );
  return processedTides;
}

function getTodayTomorrowDates() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  return [getDateFormatted(now), getDateFormatted(tomorrow)];
}

function processTides(
  data,
  now,
  heightOffsetLowTide,
  heightOffsetHighTide,
  timeOffsetLowTide,
  timeOffsetHighTide
) {
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

  return [lowTide, highTide, tidesGraph[0]];
}

function getDateFormatted(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return yyyy + mm + dd;
}

const info = await getTideInfo("TEC3783");
console.log(info);
