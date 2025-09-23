"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

type Props = {
  targetId: string;   // ID of the div containing KPI cards
  chartsRef: any;     // ref to RevenueCharts
  filters: { year: string; month: string; course: string }; // ✅ NEW
};

export function ExportSummaryButton({ targetId, chartsRef, filters }: Props) {
  const exporting = useRef(false);

  const handleExport = async () => {
    if (exporting.current) return;
    exporting.current = true;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // --- HEADER SECTION ---
    const now = new Date();
    const timestamp = now.toLocaleString();

    // --- Title ---
    pdf.setFontSize(16);
    pdf.text("Revenue & Reports Summary", 14, 16);

    // --- Filters Context ---
    pdf.setFontSize(11);
    pdf.setTextColor(100);
    pdf.text(
      `Filters → Year: ${filters.year} | Month: ${filters.month} | Course: ${filters.course}`,
      14,
      24
    );
    pdf.setTextColor(0);

    pdf.text(`Generated: ${timestamp}`, pageWidth - 14, 30, {
      align: "right",
    });

    // --- Capture KPI Cards ---
    const element = document.getElementById(targetId);
    let y = 32;
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, y, pageWidth - 20, imgHeight);
      y += imgHeight + 10;
    }

    // --- Add Charts Directly from Chart.js ---
    const lineImg = chartsRef.current?.getLineChart();
    const pieImg = chartsRef.current?.getPieChart();

    if (lineImg) {
      pdf.addImage(lineImg, "PNG", 10, y, pageWidth - 20, 80);
      y += 90;
    }
    if (pieImg) {
      pdf.addImage(pieImg, "PNG", 10, y, pageWidth - 20, 80);
    }

    pdf.save("revenue-summary.pdf");
    exporting.current = false;
  };

  return (
    <Button size="sm" variant="outline" onClick={handleExport}>
      <FileDown className="w-4 h-4 mr-2" /> Export Summary PDF
    </Button>
  );
}
