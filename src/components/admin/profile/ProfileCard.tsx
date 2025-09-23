"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/data/profile";

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white h-60 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-4">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} />
          ) : (
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className="text-lg font-semibold">{profile.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profile.role}
        </p>
      </div>
    </div>
  );
}
