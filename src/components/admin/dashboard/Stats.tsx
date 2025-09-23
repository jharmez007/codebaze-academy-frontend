// src/components/admin/dashboard/Stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Tag } from "lucide-react";
import { statsData } from "@/data/adminDashboard";

const icons: Record<string, any> = {
  Users,
  BookOpen,
  DollarSign,
  Tag,
};

export default function Stats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map(({ label, value, icon }) => {
        const Icon = icons[icon];
        return (
          <Card key={label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof value === "number" && label === "Revenue"
                  ? `₦${value.toLocaleString()}`
                  : value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
