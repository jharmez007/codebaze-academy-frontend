"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Admin } from "@/data/admins";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (admin: Admin) => void;
  admin: Admin | null;
};

export function AdminModal({ open, setOpen, onSave, admin }: Props) {
  const [form, setForm] = useState<Partial<Admin>>({
    name: "",
    email: "",
    role: "Instructor",
    active: true,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (admin) {
      setForm(admin);
    } else {
      setForm({ name: "", email: "", role: "Instructor", active: true });
    }
  }, [admin]);

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    onSave(form as Admin);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{admin ? "Edit Admin" : "Add New Admin"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label>Role</Label>
            <select
              className="mt-1 w-full border rounded-md p-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Admin["role"] })}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Instructor">Instructor</option>
              <option value="Support">Support</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch
              checked={form.active}
              onCheckedChange={(checked) => setForm({ ...form, active: checked })}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {admin ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
