"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getExchangeRate, updateExchangeRate } from "@/services/adminService";
import { toast } from "sonner";

export default function RatesTab() {
  const [rate, setRate] = useState<number>(0);
  const [editing, setEditing] = useState(false);
  const [tempRate, setTempRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch rate from backend
  useEffect(() => {
    async function fetchRate() {
      setLoading(true);
      try {
        const res = await getExchangeRate();

        if (res?.data?.ngn_to_usd !== undefined) {
          setRate(res.data.ngn_to_usd);
          setTempRate(res.data.ngn_to_usd);
        } else {
          toast.error("Failed to fetch exchange rate.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching the exchange rate.");
      } finally {
        setLoading(false);
      }
    }

    fetchRate();
  }, []);

  // Save new rate to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateExchangeRate(tempRate);

      if (res?.data?.ngn_to_usd !== undefined) {
        setRate(res.data.ngn_to_usd);
        toast.success("Exchange rate updated successfully!");
      } else {
        toast.error("Failed to update exchange rate.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the exchange rate.");
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Naira → Dollar Exchange Rate</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {!editing && (
            <div className="flex items-center gap-4">
              <p className="text-xl font-medium">₦{rate} per $1</p>
              <Button size="sm" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </div>
          )}

          {editing && (
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={Number.isFinite(tempRate) ? tempRate : 0}
                placeholder="NGN per USD"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTempRate(
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  )
                }
                className="w-24"
              />
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setTempRate(rate);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
