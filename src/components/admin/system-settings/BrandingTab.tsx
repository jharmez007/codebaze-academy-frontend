"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import {
  brandingSettings as initialBranding,
  BrandingSettings,
} from "@/data/settings";

export default function BrandingTab() {
   const [settings, setSettings] = useState<BrandingSettings>(initialBranding);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSettings((prev) => ({ ...prev, logo: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saved branding:", settings);
    alert("Branding settings saved!");
    // 🔜 Later send to API
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Platform Branding</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <div className="space-y-6 max-w-md">
          {/* Logo Upload */}
          <div>
            <Label>Upload Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo preview"
                  className="w-16 h-16 object-contain border rounded"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center border rounded text-sm text-gray-400">
                  No Logo
                </div>
              )}
              <div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, primaryColor: e.target.value }))
                }
                className="w-20 h-10 p-1"
              />
              <span>{settings.primaryColor}</span>
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <Label>Secondary Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, secondaryColor: e.target.value }))
                }
                className="w-20 h-10 p-1"
              />
              <span>{settings.secondaryColor}</span>
            </div>
          </div>

          {/* Theme */}
          <div>
            <Label>Default Theme</Label>
            <select
              className="mt-2 w-full border rounded-md p-2"
              value={settings.theme}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  theme: e.target.value as BrandingSettings["theme"],
                }))
              }
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSave} className="w-full">
              Save Branding
            </Button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="border rounded-lg shadow p-6 flex flex-col items-center justify-center text-center"
          style={{
            backgroundColor: settings.theme === "Dark" ? "#111827" : "#ffffff",
            color: settings.theme === "Dark" ? "#f9fafb" : "#111827",
          }}
        >
          {settings.logo ? (
            <img
              src={settings.logo}
              alt="Logo"
              className="w-20 h-20 object-contain mb-4"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center border rounded mb-4 text-sm text-gray-400">
              No Logo
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">Platform Preview</h3>
          <p className="text-sm mb-4">
            This is how your branding will look across the platform.
          </p>
          <div className="flex gap-4">
            <span
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: settings.primaryColor }}
            >
              Primary
            </span>
            <span
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: settings.secondaryColor }}
            >
              Secondary
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
