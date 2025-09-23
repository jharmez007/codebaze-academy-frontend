"use client";

import ProfileCard from "@/components/admin/profile/ProfileCard";
import ProfileForm from "@/components/admin/profile/ProfileForm";
import { profile } from "@/data/profile";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile summary */}
        <ProfileCard profile={profile} />

        {/* Right: Editable form */}
        <div className="lg:col-span-2">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
