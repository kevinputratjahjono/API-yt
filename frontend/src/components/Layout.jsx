import React from "react";
import {
  ChartBarIcon,
  GlobeAltIcon,
  VideoCameraIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const navItems = [
    { name: "Dashboard", icon: ChartBarIcon },
    { name: "Countries", icon: GlobeAltIcon },
    { name: "Videos", icon: VideoCameraIcon },
    { name: "Refresh Data", icon: ArrowPathIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">YT Dashboard</h1>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 rounded-lg transition"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <footer className="mt-auto pt-6 text-sm text-gray-400">
          built with ❤️ by you
        </footer>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
