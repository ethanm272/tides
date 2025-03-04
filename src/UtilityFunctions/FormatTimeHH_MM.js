export const formatTimeHH_MM = (time) => {
  let hours = time.getHours();
  let minutes = time.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return hours + ":" + minutes + ampm;
};
