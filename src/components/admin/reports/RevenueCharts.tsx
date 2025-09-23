"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

type Props = {
  monthlyData: { month: string; revenue: number }[];
  courseData: { course: string; revenue: number }[];
};

// --- Forward ref to expose chart images ---
export const RevenueCharts = forwardRef(function RevenueCharts(
  { monthlyData, courseData }: Props,
  ref
) {
  const lineRef = useRef<any>(null);
  const pieRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getLineChart: () => lineRef.current?.toBase64Image(),
    getPieChart: () => pieRef.current?.toBase64Image(),
  }));

  const lineData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Revenue",
        data: monthlyData.map((d) => d.revenue),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.15)",
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: "#fff",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const lineOptions = { responsive: true, maintainAspectRatio: false as const };

  const pieData = {
    labels: courseData.map((c) => c.course),
    datasets: [
      {
        data: courseData.map((c) => c.revenue),
        backgroundColor: ["#4f46e5", "#22c55e", "#f97316", "#e11d48"],
        borderColor: "#fff",
      },
    ],
  };

  const pieOptions = { responsive: true, maintainAspectRatio: false as const };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
      <div className="rounded-2xl border bg-card shadow-sm p-4 h-[360px]">
        <h3 className="font-semibold mb-3">Monthly Revenue</h3>
        <div className="h-[300px]">
          <Line ref={lineRef} data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm p-4 h-[360px]">
        <h3 className="font-semibold mb-3">Revenue by Course</h3>
        <div className="h-[300px]">
          <Pie ref={pieRef} data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
});
