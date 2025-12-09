import React from "react";

export default function CountriesTable({ rows = [] }) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 border-b">
          <tr>
            <th className="p-3 text-left">Country</th>
            <th className="p-3 text-right">Views</th>
            <th className="p-3 text-right">Watch (min)</th>
            <th className="p-3 text-right">Avg (sec)</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-400">
                No data yet
              </td>
            </tr>
          )}

          {rows.map((r, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50 border-t"}
            >
              <td className="p-3">{r[0]}</td>
              <td className="p-3 text-right">{r[1]}</td>
              <td className="p-3 text-right">{r[2]}</td>
              <td className="p-3 text-right">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
