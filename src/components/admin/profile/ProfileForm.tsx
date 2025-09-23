"use client";

import { useState } from "react";
import { Profile } from "@/data/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState(profile);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    console.log("Saved profile:", form);
    alert("Profile updated!");
  };

  const handlePasswordSave = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      alert("Please fill in all password fields.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }
    console.log("Password updated:", passwords);
    alert("Password changed successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 space-y-6">
      {/* Avatar Upload */}
      <div>
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4 mt-2">
          <Avatar className="h-16 w-16">
            {form.avatar ? (
              <AvatarImage src={form.avatar} />
            ) : (
              <AvatarFallback>
                {form.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            )}
          </Avatar>

          <div>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById("avatar-upload")?.click()
              }
            >
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email address"
        />
      </div>

      {/* Role */}
      <div>
        <Label>Role</Label>
        <Input
          value={form.role}
          disabled
          className="bg-gray-100 dark:bg-gray-800"
        />
      </div>

      {/* Save Profile */}
      <div className="pt-2">
        <Button onClick={handleProfileSave} className="w-full">
          Save Profile
        </Button>
      </div>

      {/* Password Change Section */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <div className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              placeholder="Enter current password"
            />
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handlePasswordSave} className="w-full">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
