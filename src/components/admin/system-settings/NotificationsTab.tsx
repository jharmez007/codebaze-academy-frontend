"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  notificationSettings as initialNotifications,
  NotificationSettings,
} from "@/data/settings";

export default function NotificationsTab() {
  const [settings, setSettings] = useState<NotificationSettings>(
    initialNotifications
  );

  const handleSave = () => {
    console.log("Saved notifications:", settings);
    alert("Notification settings saved!");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="space-y-6 max-w-md">
        {/* Email Toggle */}
        <div className="flex items-center justify-between">
          <Label>Email Notifications</Label>
          <Switch
            checked={settings.emailEnabled}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, emailEnabled: checked }))
            }
          />
        </div>

        {/* SMS Toggle */}
        <div className="flex items-center justify-between">
          <Label>SMS Notifications</Label>
          <Switch
            checked={settings.smsEnabled}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, smsEnabled: checked }))
            }
          />
        </div>

        {/* SMTP */}
        <div className="space-y-2">
          <Label>SMTP Server</Label>
          <Input
            placeholder="smtp.mailserver.com"
            value={settings.smtpServer}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, smtpServer: e.target.value }))
            }
          />
        </div>

        {/* SMS API Key */}
        <div className="space-y-2">
          <Label>SMS Provider API Key</Label>
          <Input
            type="password"
            placeholder="Enter API key"
            value={settings.smsApiKey}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, smsApiKey: e.target.value }))
            }
          />
        </div>

        {/* Save */}
        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Save Notifications
          </Button>
        </div>
      </div>
    </div>
  );
}
