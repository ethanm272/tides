export async function getStationName(stationId) {
  const response = await fetch(
    `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}.json?expand=details&units=english`
  );

  if (!response.ok) {
    throw new Error(`Response status ${response.status}`, {
      cause: response,
    });
  }

  const stationDetails = await response.json();
  return stationDetails.stations[0].name;
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export async function getTideInfo(stationId) {
  const offsetResponse = await fetch(
    `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}/tidepredoffsets.json`
  );

  if (!offsetResponse.ok) {
    throw new Error(`Response status ${offsetResponse.status}`, {
      cause: offsetResponse,
    });
  }

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

  if (!tidesResponse.ok) {
    throw new Error(`Response status ${tidesResponse.status}`, {
      cause: tidesResponse,
    });
  }

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
  let nextTide = { t: new Date(), h: -10, type: "" };
  let tidesGraph = [];
  let tidesCounter = 0;
  let tideFound = false;
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
        !tideFound
      ) {
        nextTide.h = tidePrediction;
        nextTide.t = predictionTime;
        nextTide.type = "H";
        tideFound = true;
      } else if (
        /** Find Next Low Tide */
        tidePrediction <= Number(predictions[i - 1].v) &&
        tidePrediction <= Number(predictions[i + 1].v) &&
        !tideFound
      ) {
        nextTide.h = tidePrediction;
        nextTide.t = predictionTime;
        nextTide.type = "L";
        tideFound = true;
      }
    }
  }

  // Adjust tide levels
  if (nextTide.type === "H") {
    nextTide.t.setMinutes(nextTide.t.getMinutes() + timeOffsetHighTide);
    nextTide.h *= heightOffsetHighTide;
  } else {
    nextTide.t.setMinutes(nextTide.t.getMinutes() + timeOffsetLowTide);
    nextTide.h *= heightOffsetLowTide;
  }

  return [nextTide, tidesGraph[0]];
}

function getDateFormatted(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return yyyy + mm + dd;
}
