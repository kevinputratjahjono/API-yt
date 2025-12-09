import React from "react";
import { Line } from "react-chartjs-2";

export default function TimeseriesChart({ rows = [] }) {
  const labels = rows.map((r) => r[0]);
  const values = rows.map((r) => r[1]);

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: values,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: "#e5e7eb" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <Line data={data} options={options} height={100} />
    </div>
  );
}
