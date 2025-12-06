"use client";

import { useEffect, useState } from "react";
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
import { getAdminOverview } from "@/services/adminService";

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
  const [revenueLabels, setRevenueLabels] = useState<string[]>([]);
  const [revenueValues, setRevenueValues] = useState<number[]>([]);
  const [enrollmentsLabels, setEnrollmentsLabels] = useState<string[]>([]);
  const [enrollmentsDataset, setEnrollmentsDataset] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAdminOverview();

        // ---- Monthly Revenue ----
        setRevenueLabels(data.monthlyRevenue.map((item: any) => item.month));
        setRevenueValues(data.monthlyRevenue.map((item: any) => item.revenue));

        // ---- Enrollments ----
        setEnrollmentsLabels(data.enrollmentsData.labels);
        setEnrollmentsDataset(data.enrollmentsData.datasets[0].data);
      } catch (error) {
        console.error("Error loading charts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm h-48 animate-pulse" />
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm h-48 animate-pulse" />
      </>
    );
  }

  return (
    <>
      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4">Revenue (₦)</h2>
        <Line
          data={{
            labels: revenueLabels,
            datasets: [
              {
                label: "Monthly Revenue",
                data: revenueValues,
                borderColor: "rgb(34,197,94)",
                backgroundColor: "rgba(34,197,94,0.3)",
              },
            ],
          }}
        />
      </div>

      {/* Enrollments Chart */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4">Course Enrollments</h2>
        <Bar
          data={{
            labels: enrollmentsLabels,
            datasets: [
              {
                label: "Enrollments",
                data: enrollmentsDataset,
                backgroundColor: "rgba(34,197,94,0.6)",
              },
            ],
          }}
        />
      </div>
    </>
  );
}
