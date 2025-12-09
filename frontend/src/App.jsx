import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import Card from "./components/Card";

import {
  EyeIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import CountriesTable from "./components/CountriesTable";
import VideosTable from "./components/VideosTable";
import TimeseriesChart from "./components/TimeseriesChart";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [me, setMe] = useState(null);
  const [countries, setCountries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [timeseries, setTimeseries] = useState([]);
  const [range, setRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const r = await axios.get(`${API_BASE}/me`);
      setMe(r.data);
    } catch {}
  }

  async function signIn() {
    const r = await axios.get(`${API_BASE}/auth`);
    window.open(r.data.auth_url, "_blank");
  }

  async function loadData() {
    const c = await axios.get(`${API_BASE}/analytics/countries`, { params: range });
    const v = await axios.get(`${API_BASE}/analytics/videos`, { params: range });
    const t = await axios.get(`${API_BASE}/analytics/timeseries`, { params: range });

    setCountries(c.data.rows || []);
    setVideos(v.data.rows || []);
    setTimeseries(t.data.rows || []);
  }

  const totalViews = countries.reduce((a, b) => a + (b[1] || 0), 0);
  const totalWatchTime = countries.reduce((a, b) => a + (b[2] || 0), 0);

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-500">YouTube Analytics Overview</p>
        </div>

        {!me ? (
          <button
            onClick={signIn}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        ) : (
          <span className="text-gray-600">
            Welcome, <b>{me.items?.[0]?.snippet?.title}</b>
          </span>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Views" value={totalViews} icon={EyeIcon} />
        <Card title="Watch Time (min)" value={totalWatchTime} icon={ClockIcon} />
        <Card
          title="Countries"
          value={countries.length}
          icon={ChartBarIcon}
        />
      </div>

      {/* Date input */}
      <div className="mb-6 flex gap-3 items-end">
        <div>
          <label className="text-sm">Start</label>
          <input
            className="border rounded-lg p-2"
            value={range.start}
            onChange={(e) => setRange({ ...range, start: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm">End</label>
          <input
            className="border rounded-lg p-2"
            value={range.end}
            onChange={(e) => setRange({ ...range, end: e.target.value })}
          />
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        >
          Load Data
        </button>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimeseriesChart rows={timeseries} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Top Countries</h3>
          <CountriesTable rows={countries} />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-5 rounded-xl shadow mt-6">
            <h3 className="text-lg font-semibold mb-3">Top Videos</h3>
            <VideosTable rows={videos} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
