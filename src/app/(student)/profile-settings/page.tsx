"use client";

import React, { useState } from "react";
import AccountSection from "../../../components/profile-settings/AccountSection";
import OptionsSection from "../../../components/profile-settings/OptionsSection";
import BillingSection from "../../../components/profile-settings/BillingSection";

export default function SettingsPage() {
  const [activeEdit, setActiveEdit] = useState<string | null>(null);

  const handleEdit = (key: string | null) => {
    setActiveEdit(key);
  };

  return (
    <div className="flex justify-center items-start bg-white sm:px-2">
      <div className="w-full max-w-7xl bg-white py-4 sm:p-8 mt-6">
        <h1 className="text-lg text-black font-semibold mb-6 max-sm:px-4">Settings</h1>

        <AccountSection
          activeEdit={activeEdit}
          onEdit={handleEdit}
        />

        <OptionsSection
          activeEdit={activeEdit}
          onEdit={handleEdit}
        />

        <BillingSection
          activeEdit={activeEdit}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
