"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { admins as initialAdmins, Admin } from "@/data/admins";
import { AdminModal } from "./AdminModal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function RolesTab() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [open, setOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const handleSave = (admin: Admin) => {
    if (editingAdmin) {
      // Update existing
      setAdmins(admins.map((a) => (a.id === admin.id ? admin : a)));
    } else {
      // Add new
      setAdmins([...admins, { ...admin, id: admins.length + 1 }]);
    }
    setEditingAdmin(null);
  };

  const handleDelete = (admin: Admin) => {
    setAdmins(admins.filter((a) => a.id !== admin.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Admins & Roles</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditingAdmin(null);
            setOpen(true);
          }}
        >
          Add Admin
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell>
                <span className={admin.active ? "text-green-600" : "text-red-600"}>
                  {admin.active ? "Active" : "Suspended"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingAdmin(admin);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    
                    <ConfirmModal
                        trigger={<button className="w-full text-left px-2 py-1.5 text-red-600 text-sm hover:bg-red-100 rounded-sm">Delete</button>}
                        title="Delete Admin"
                        description={`Are you sure you want to delete ${admin.name}? This action cannot be undone.`}
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(admin)}
                    />
                    
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Modal */}
      <AdminModal
        open={open}
        setOpen={setOpen}
        onSave={handleSave}
        admin={editingAdmin}
      />
    </div>
  );
}
