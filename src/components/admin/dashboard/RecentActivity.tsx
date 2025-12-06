"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOverview } from "@/services/adminService";

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const data = await getAdminOverview();
        setActivities(data.recentActivity);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted/40 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-muted/40 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-muted/40 rounded mb-2 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((a: any, index: number) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{a.text}</span>
            <span className="text-gray-500 dark:text-gray-400">{a.date}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
