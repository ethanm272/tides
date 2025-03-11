import React from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import "./TideChart.css";

Chart.register(...registerables);

export const options = {
  responsive: true,
  tension: 0.2,
  plugins: {
    title: {
      display: false,
      text: "Tides",
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      offset: true,
      grid: {
        color: "rgba(59, 59, 59, 0.15)",
        drawTicks: true,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
        padding: 0,
      },
      type: "time",
      time: {
        unit: "hour",
        displayFormats: {
          hour: "hA",
        },
      },
      title: {
        display: false,
        text: "Time",
      },
    },
    y: {
      offset: true,
      grid: {
        color: "rgba(59, 59, 59, 0.15)",
        display: false,
      },
      title: {
        display: false,
        text: "Height (ft.)",
      },
    },
  },
};

export function TideChart({ tideExtremes }) {
  const currentDay = tideExtremes[0].t.getDate();
  const tideData = tideExtremes
    .filter((tide) => tide.t.getDate() === currentDay)
    .map((tide) => ({ x: tide.t, y: tide.h }));
  const data = {
    datasets: [
      {
        label: "Dataset 1",
        data: tideData,
        borderColor: "rgb(214, 213, 212)",
        backgroundColor: "#333",
        color: "#000",
      },
    ],
  };

  return <Line className="tide-chart" options={options} data={data} />;
}
