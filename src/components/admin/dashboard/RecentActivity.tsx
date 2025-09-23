// src/components/admin/dashboard/RecentActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivity } from "@/data/adminDashboard";

export default function RecentActivity() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivity.map((a) => (
          <div key={a.id} className="flex justify-between text-sm">
            <span>{a.text}</span>
            <span className="text-gray-500 dark:text-gray-400">{a.date}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
