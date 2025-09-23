"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueCards } from "./RevenueCards";
import { RevenueCharts } from "./RevenueCharts";
import { monthlyRevenue, revenueByCourse } from "@/data/revenue";
import { RevenueSkeleton } from "./ReportsSkeleton";
import { ExportSummaryButton } from "./ExportSummaryButton";

export function RevenueOverview() {
  // --- FILTER STATES ---
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("All");
  const [course, setCourse] = useState("All");
  const [loading, setLoading] = useState(true);

  const chartsRef = useRef<any>(null);

  useEffect(() => {
    // simulate API fetch delay
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <RevenueSkeleton />;

  // --- APPLY FILTERS (mock logic) ---
  const filteredMonthly = monthlyRevenue.filter((d) => {
    // Filter by month if not "All"
    if (month !== "All" && d.month !== month) return false;
    return true;
  });

  const filteredCourses =
    course === "All" ? revenueByCourse : revenueByCourse.filter((c) => c.course === course);

  // --- KPI CALCULATIONS ---
  const totalRevenue = filteredMonthly.reduce((sum, m) => sum + m.revenue, 0);
  const monthlyRev =
    filteredMonthly.length > 0 ? filteredMonthly[filteredMonthly.length - 1].revenue : 0;
  const activeStudents = 320; // mock
  const avgRevPerStudent = activeStudents > 0 ? totalRevenue / activeStudents : 0;

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3">
        {/* Year Filter */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>

        {/* Month Filter */}
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Months</SelectItem>
            <SelectItem value="Jan">January</SelectItem>
            <SelectItem value="Feb">February</SelectItem>
            <SelectItem value="Mar">March</SelectItem>
            <SelectItem value="Apr">April</SelectItem>
            <SelectItem value="May">May</SelectItem>
            <SelectItem value="Jun">June</SelectItem>
            <SelectItem value="Jul">July</SelectItem>
            <SelectItem value="Aug">August</SelectItem>
            <SelectItem value="Sep">September</SelectItem>
            <SelectItem value="Oct">October</SelectItem>
            <SelectItem value="Nov">November</SelectItem>
            <SelectItem value="Dec">December</SelectItem>
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Courses</SelectItem>
            {revenueByCourse.map((c) => (
              <SelectItem key={c.course} value={c.course}>
                {c.course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportSummaryButton 
          targetId="revenue-cards"
          chartsRef={chartsRef}
          filters={{ year, month, course }} 
        />
      </div>

      {/* Overview wrapper to capture */}
      <div id="revenue-summary" className="space-y-6">
        {/* KPIs */}
        <RevenueCards
            totalRevenue={totalRevenue}
            monthlyRevenue={monthlyRev}
            activeStudents={activeStudents}
            avgRevenuePerStudent={avgRevPerStudent}
        />

        {/* CHARTS */}
        <RevenueCharts
            ref={chartsRef}
            monthlyData={filteredMonthly}
            courseData={filteredCourses}
        />
      </div>
    </div>
  );
}
