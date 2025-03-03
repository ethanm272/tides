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
  const [today, nextDay] = getWeekRange();
  const tidesResponse = await fetch(
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${today}&end_date=${nextDay}&station=${refStationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
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

function getWeekRange() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 6);
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
  let currentTide = 0;
  let tideExtremes = [];
  let foundCurrentTide = false;
  let nextTideExtreme = {};
  let foundNextTideExtreme = false;
  const predictions = data.predictions;
  for (let i = 1; i < predictions.length - 1; i++) {
    const predictionTime = new Date(predictions[i].t);
    const tidePrediction = Number(predictions[i].v);

    if (!foundCurrentTide && predictionTime > now) {
      currentTide = tidePrediction;
      foundCurrentTide = true;
    }

    if (
      tidePrediction >= Number(predictions[i - 1].v) &&
      tidePrediction >= Number(predictions[i + 1].v)
    ) {
      const tide = { t: predictionTime, h: tidePrediction, type: "H" };
      if (predictionTime > now && !foundNextTideExtreme) {
        nextTideExtreme = tide;
        foundNextTideExtreme = true;
      }
      tideExtremes.push(tide);
    } else if (
      /** Find Next Low Tide */
      tidePrediction <= Number(predictions[i - 1].v) &&
      tidePrediction <= Number(predictions[i + 1].v)
    ) {
      const tide = { t: predictionTime, h: tidePrediction, type: "L" };
      if (predictionTime > now && !foundNextTideExtreme) {
        nextTideExtreme = tide;
        foundNextTideExtreme = true;
      }
      tideExtremes.push(tide);
    }
  }

  // Adjust tide levels according to offsets
  for (let i = 0; i < tideExtremes.length; i++) {
    if (tideExtremes[i].type === "H") {
      tideExtremes[i].t.setMinutes(
        tideExtremes[i].t.getMinutes() + timeOffsetHighTide
      );
      tideExtremes[i].h *= heightOffsetHighTide;
    } else {
      tideExtremes[i].t.setMinutes(
        tideExtremes[i].t.getMinutes() + timeOffsetLowTide
      );
      tideExtremes[i].h *= heightOffsetLowTide;
    }
  }

  // Remove consecutive tides
  let indicesToRemove = [];
  for (let i = 0; i < tideExtremes.length - 1; i++) {
    const diff = (tideExtremes[i + 1].t - tideExtremes[i].t) / 60000;
    if (diff < 7) {
      indicesToRemove.push(i);
    }
  }

  let filteredTideExtremes = [];
  const indicesToRemoveLength = indicesToRemove.length;
  if (indicesToRemoveLength === 0) {
    filteredTideExtremes = tideExtremes;
  } else {
    let removeIndex = 0;
    for (let i = 0; i < tideExtremes.length - 1; i++) {
      if (
        removeIndex < indicesToRemoveLength &&
        i === indicesToRemove[removeIndex]
      ) {
        removeIndex += 1;
      } else {
        filteredTideExtremes.push(tideExtremes[i]);
      }
    }
  }

  return [currentTide, nextTideExtreme, filteredTideExtremes];
}

function getDateFormatted(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return yyyy + mm + dd;
}
