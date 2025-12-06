"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueCards } from "./RevenueCards";
import { RevenueCharts } from "./RevenueCharts";
import { RevenueSkeleton } from "./ReportsSkeleton";
import { ExportSummaryButton } from "./ExportSummaryButton";
import { getAdminOverview } from "@/services/adminService";

export function RevenueOverview() {
  // --- FILTER STATES ---
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("All");
  const [course, setCourse] = useState("All");
  const [loading, setLoading] = useState(true);

  // --- DATA STATES ---
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [revenueByCourseData, setRevenueByCourseData] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<number>(0); // can be calculated from statsData if available

  const chartsRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminOverview();

        // Set API data
        setMonthlyRevenueData(data.monthlyRevenue);
        setRevenueByCourseData(data.revenueByCourse);
        setActiveStudents(data.statsData?.find((s: any) => s.label === "Students")?.value || 0);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <RevenueSkeleton />;

  // --- APPLY FILTERS ---
  const filteredMonthly = monthlyRevenueData.filter((d) => {
    if (month !== "All" && d.month !== month) return false;
    return true;
  });

  const filteredCourses =
    course === "All" ? revenueByCourseData : revenueByCourseData.filter((c) => c.course === course);

  // --- KPI CALCULATIONS ---
  const totalRevenue = filteredMonthly.reduce((sum, m) => sum + m.revenue, 0);
  const monthlyRev =
    filteredMonthly.length > 0 ? filteredMonthly[filteredMonthly.length - 1].revenue : 0;
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
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Courses</SelectItem>
            {revenueByCourseData.map((c) => (
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

      {/* Overview wrapper */}
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
