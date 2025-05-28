"use client";

import { useState } from "react";
import { Url } from "@/lib/types";

interface Props {
  urls: Url[];
}

export function AnalyticsDashboard({ urls }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "all">("7d");

  // Calculate total clicks
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  // Calculate daily clicks for the selected period
  const getPeriodStart = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case "7d":
        now.setDate(now.getDate() - 7);
        break;
      case "30d":
        now.setDate(now.getDate() - 30);
        break;
      default:
        now.setFullYear(now.getFullYear() - 1); // Default to 1 year for "all"
    }
    return now;
  };

  const periodStart = getPeriodStart();
  const recentUrls = urls.filter(
    (url) => url.lastClicked && new Date(url.lastClicked) > periodStart
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as "7d" | "30d" | "all")}
            className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total URLs</h3>
            <p className="text-2xl font-bold mt-1">{urls.length}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clicks</h3>
            <p className="text-2xl font-bold mt-1">{totalClicks}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active URLs</h3>
            <p className="text-2xl font-bold mt-1">{recentUrls.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent URLs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Clicked
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentUrls.map((url) => (
                <tr key={url.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <code className="text-sm">{url.shortCode}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm truncate max-w-xs">{url.originalUrl}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm">{url.clicks}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm">
                      {url.lastClicked
                        ? new Date(url.lastClicked).toLocaleDateString()
                        : "Never"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 