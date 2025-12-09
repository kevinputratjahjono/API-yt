import React from "react";
import { PlayIcon } from "@heroicons/react/24/outline";

export default function VideosTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 border-b">
          <tr>
            <th className="p-3 text-left">Video</th>
            <th className="p-3 text-right">Views</th>
            <th className="p-3 text-right">Watch (min)</th>
            <th className="p-3 text-right">Avg (sec)</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-400">
                No data
              </td>
            </tr>
          )}

          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="p-3">
                <a
                  href={`https://youtu.be/${r[0]}`}
                  className="text-blue-600 flex items-center gap-2"
                  target="_blank"
                >
                  <PlayIcon className="h-4 w-4" />
                  {r[0]}
                </a>
              </td>
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
