"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RolesTab from "@/components/admin/system-settings/RolesTab";
import RatesTab from "@/components/admin/system-settings/RatesTab";
import BrandingTab from "@/components/admin/system-settings/BrandingTab";
import NotificationsTab from "@/components/admin/system-settings/NotificationsTab";

export default function SystemSettingsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <Tabs defaultValue="roles">
        <TabsList className="mb-6">
          <TabsTrigger value="roles">Admin Roles</TabsTrigger>
          <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>

        <TabsContent value="rates">
          <RatesTab />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
