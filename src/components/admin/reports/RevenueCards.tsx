"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalRevenue: number;
  monthlyRevenue: number;
  activeStudents: number;
  avgRevenuePerStudent: number;
};

const formatNGN = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);

export function RevenueCards({
  totalRevenue,
  monthlyRevenue,
  activeStudents,
  avgRevenuePerStudent,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{formatNGN(totalRevenue)}</CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{formatNGN(monthlyRevenue)}</CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Paid Students</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{activeStudents}</CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Revenue / Student</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {formatNGN(avgRevenuePerStudent)}
        </CardContent>
      </Card>
    </div>
  );
}
