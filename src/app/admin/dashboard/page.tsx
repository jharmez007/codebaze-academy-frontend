import Stats from "@/components/admin/dashboard/Stats";
import Charts from "@/components/admin/dashboard/Charts";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <Stats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Charts />
      </div>

      <RecentActivity />
    </div>
  );
}
