"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Admin } from "@/data/admins";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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

  // Add role state for shadcn Select
  const [role, setRole] = useState<Admin["role"]>("Instructor");

  // Pre-fill form when editing
  useEffect(() => {
    if (admin) {
      setForm(admin);
      setRole(admin.role);
    } else {
      setForm({ name: "", email: "", role: "Instructor", active: true });
      setRole("Instructor");
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
            <Select value={role} onValueChange={(v) => {
              setRole(v as Admin["role"]);
              setForm({ ...form, role: v as Admin["role"] });
            }}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Instructor">Instructor</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
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
