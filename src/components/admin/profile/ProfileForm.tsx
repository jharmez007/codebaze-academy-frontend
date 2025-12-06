"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { normalizeImagePath } from "@/utils/normalizeImagePath";

import {
  getProfile,
  updateProfile,
} from "@/services/profileService";

import {
  changePassword,
  changeEmail,
  verifyNewEmail,
} from "@/services/authService";

import { toast } from "sonner";

export default function ProfileForm() {
  const [form, setForm] = useState({
    full_name: "",
    photo_url: "",
    email: "",
  });

  const [email, setEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // verification
  const [emailPending, setEmailPending] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      if (res.data) {
        setForm({
          full_name: res.data?.full_name || "",
          photo_url: res.data?.profile_photo || "",
          email: res.data?.email || "",
        });
        setEmail(res.data?.email || "");
      }
    };

    fetchProfile();
  }, []);

  // Auto verify email from URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");

    if (!token || !emailParam) return;

    (async () => {
      setVerifying(true);
      setVerificationMessage(null);

      const res = await verifyNewEmail(emailParam, token);
      setVerifying(false);

      if (res.data) {
        toast.success("Email verified successfully.");
        setForm((prev) => ({ ...prev, email: emailParam }));
        setEmail(emailParam);
        setIsEditingEmail(false);
        setEmailPending(false);
        setVerificationMessage("Email verified successfully.");

        // remove query params
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("token");
        newUrl.searchParams.delete("email");
        window.history.replaceState({}, document.title, newUrl.toString());
      } else {
        toast.error(res.message || "Verification failed.");
        setVerificationMessage(res.message || "Verification failed.");
      }
    })();
  }, []);

  // Upload avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setNewPhoto(file);

      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          photo_url: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile
  const handleProfileSave = async () => {
    setLoading(true);

    const payload = {
      full_name: form.full_name,
      photo: newPhoto,
    };

    const res = await updateProfile(payload);
    setLoading(false);

    if (res.data) {
      toast.success("Profile updated!");
      setNewPhoto(null);
    } else {
      toast.error(res.message || "Failed to update profile.");
    }
  };

  // Save email request
  const handleEmailSave = async () => {
    if (!email) return toast.error("Email cannot be empty.");

    const res = await changeEmail(email);
    if (res.data) {
      toast.success("Verification email sent!");
      setIsEditingEmail(false);
      setEmailPending(true);
      if (res.data?.message) setVerificationMessage(res.data.message);
    } else {
      toast.error(res.message || "Failed to request email change.");
    }
  };

  // Manual token verify
  const handleVerifyToken = async () => {
    if (!verificationToken)
      return toast.error("Please paste the token that was emailed to you.");

    setVerifying(true);
    setVerificationMessage(null);

    const res = await verifyNewEmail(email, verificationToken);
    setVerifying(false);

    if (res.data) {
      toast.success("Email verified!");
      setForm((prev) => ({ ...prev, email }));
      setEmailPending(false);
      setIsEditingEmail(false);
      setVerificationToken("");
      setVerificationMessage("Email verified successfully.");
    } else {
      toast.error(res.message || "Verification failed.");
      setVerificationMessage(res.message || "Verification failed.");
    }
  };

  // Save password
  const handlePasswordSave = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      return toast.error("Fill all password fields.");
    }

    if (passwords.newPass !== passwords.confirm) {
      return toast.error("New passwords do not match.");
    }

    const res = await changePassword({
      old_password: passwords.current,
      new_password: passwords.newPass,
    });

    if (res.data) {
      toast.success("Password updated!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } else {
      toast.error(res.message || "Failed to update password.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 space-y-6">
      {/* Avatar */}
      <div>
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4 mt-2">
          <Avatar className="h-16 w-16">
            {form.photo_url ? (
              <AvatarImage src={normalizeImagePath(form.photo_url)} />
            ) : (
              <AvatarFallback>
                {form.full_name?.split(" ").map((n) => n[0]).join("")}
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
            <Button variant="outline" size="sm" onClick={() => document.getElementById("avatar-upload")?.click()}>
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <Label>Full Name</Label>
        <Input
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Full name"
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <div className="flex gap-2 items-center">
          <Input
            value={email}
            disabled={!isEditingEmail}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className={!isEditingEmail ? "bg-gray-100 dark:bg-gray-800" : ""}
          />

          {isEditingEmail ? (
            <Button size="sm" onClick={handleEmailSave}>Save</Button>
          ) : (
            <Button size="sm" onClick={() => setIsEditingEmail(true)}>Edit</Button>
          )}
        </div>

        {/* Manual verification */}
        {emailPending && (
          <div className="mt-3 space-y-2">
            <p className="text-sm">
              A verification token was sent to <strong>{email}</strong>.
            </p>

            <div className="flex gap-2 items-center">
              <Input
                placeholder="Verification token"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
              />
              <Button size="sm" onClick={handleVerifyToken} disabled={verifying}>
                {verifying ? "Verifying..." : "Verify"}
              </Button>
            </div>

            {verificationMessage && <p className="text-sm mt-1">{verificationMessage}</p>}
          </div>
        )}

        {!emailPending && verificationMessage && (
          <p className="text-sm mt-2">{verificationMessage}</p>
        )}
      </div>

      <div className="pt-2">
        <Button onClick={handleProfileSave} className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      {/* Password */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <div className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
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
