"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// register chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type CourseStat = {
  course: string;
  usage: number;
  discountGiven: number; // in Naira
};

type PromoStatsProps = {
  open: boolean;
  onClose: () => void;
  code: string;
  totalUsage: number;
  maxUsage: number;
  courseStats: CourseStat[];
};

export default function PromoStats({
  open,
  onClose,
  code,
  totalUsage,
  maxUsage,
  courseStats,
}: PromoStatsProps) {
  const totalDiscount = courseStats.reduce(
    (sum, c) => sum + c.discountGiven,
    0
  );

  // Chart data
  const chartData = {
    labels: courseStats.map((c) => c.course),
    datasets: [
      {
        label: "Usage",
        data: courseStats.map((c) => c.usage),
        backgroundColor: "rgba(59, 130, 246, 0.6)", // blue
      },
      {
        label: "Discount Given (₦)",
        data: courseStats.map((c) => c.discountGiven),
        backgroundColor: "rgba(34, 197, 94, 0.6)", // green
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Promo Usage by Course",
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Promo Stats: {code}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div className="flex justify-between text-sm">
            <span>
              Usage: <strong>{totalUsage}</strong> / {maxUsage}
            </span>
            <span>
              Total Discount Given:{" "}
              <strong>₦{totalDiscount.toLocaleString()}</strong>
            </span>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 p-4 rounded-md">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Per-course breakdown */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Discount Given</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseStats.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-gray-500"
                  >
                    No usage data
                  </TableCell>
                </TableRow>
              ) : (
                courseStats.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.course}</TableCell>
                    <TableCell>{c.usage}</TableCell>
                    <TableCell>
                      ₦{c.discountGiven.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
