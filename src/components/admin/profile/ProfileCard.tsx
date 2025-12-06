"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/services/profileService"; 
import { normalizeImagePath } from "@/utils/normalizeImagePath"; 

interface ProfileData {
  full_name: string;
  profile_photo: string;
  role: string;
}

export default function ProfileCard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        if (res.data) {
          setProfile(res.data);
        } else {
          setError(res.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-60 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-60 flex items-center justify-center text-red-500">
        {error || "Profile not available"}
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white h-60 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-4">
          {profile.profile_photo ? (
            <AvatarImage src={normalizeImagePath(profile.profile_photo)} />
          ) : (
            <AvatarFallback>
              {profile.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className="text-lg font-semibold">{profile.full_name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profile.role}
        </p>
      </div>
    </div>
  );
}
