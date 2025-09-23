// src/components/admin/dashboard/Charts.tsx
"use client";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { revenueData, enrollmentsData } from "@/data/adminDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts() {
  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4">Revenue (₦)</h2>
        <Line
          data={{
            labels: revenueData.labels,
            datasets: [
              {
                ...revenueData.datasets[0],
                borderColor: "rgb(34,197,94)",
                backgroundColor: "rgba(34,197,94,0.3)",
              },
            ],
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4">Course Enrollments</h2>
        <Bar
          data={{
            labels: enrollmentsData.labels,
            datasets: [
              {
                ...enrollmentsData.datasets[0],
                backgroundColor: "rgba(34,197,94,0.6)",
              },
            ],
          }}
        />
      </div>
    </>
  );
}
