import React from "react";

export default function Card({ title, value, icon }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow flex items-center gap-4">
      <div className="text-blue-500 text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
