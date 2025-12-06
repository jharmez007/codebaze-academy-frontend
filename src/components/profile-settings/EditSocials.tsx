import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { X, Plus, ChevronDown, Globe, Mail } from "lucide-react";
import {
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaSnapchat,
  FaTiktok,
  FaPinterestP,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";
import { getProfile, updateProfile } from "@/services/profileService";

// TYPES
type SocialPlatform =
  | "YouTube"
  | "Instagram"
  | "Facebook"
  | "Snapchat"
  | "TikTok"
  | "Pinterest"
  | "LinkedIn"
  | "X"
  | "Bluesky"
  | "Website"
  | "Email";

interface EditSocialsProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

// SOCIAL OPTIONS
const socialOptions = [
  { name: "YouTube", icon: <FaYoutube />, color: "#FF0000", placeholder: "https://youtube.com/yourchannel" },
  { name: "Instagram", icon: <FaInstagram />, color: "#E4405F", placeholder: "https://instagram.com/username" },
  { name: "Facebook", icon: <FaFacebookF />, color: "#1877F2", placeholder: "https://facebook.com/username" },
  { name: "Snapchat", icon: <FaSnapchat />, color: "#FFFC00", placeholder: "https://snapchat.com/add/username" },
  { name: "TikTok", icon: <FaTiktok />, color: "#000000", placeholder: "https://tiktok.com/@username" },
  { name: "Pinterest", icon: <FaPinterestP />, color: "#E60023", placeholder: "https://pinterest.com/username" },
  { name: "LinkedIn", icon: <FaLinkedinIn />, color: "#0A66C2", placeholder: "https://linkedin.com/in/username" },
  { name: "X", icon: <FaXTwitter />, color: "#000000", placeholder: "https://x.com/username" },
  { name: "Bluesky", icon: <SiBluesky />, color: "#1185FE", placeholder: "https://bsky.app/profile/username" },
  { name: "Website", icon: <Globe />, color: "#5A5A5A", placeholder: "https://yourwebsite.com" },
  { name: "Email", icon: <Mail />, color: "#C71610", placeholder: "email@example.com" },
];

// MAP BACKEND DATA → LOCAL ARRAY
const backendToArray = (obj: Record<string, string>) =>
  Object.entries(obj || {}).map(([name, link]) => ({
    name: name as SocialPlatform,
    link,
  }));

// MAP ARRAY → BACKEND STRUCTURE
const arrayToBackend = (arr: { name: SocialPlatform; link: string }[]) => {
  const result: Record<string, string> = {};
  arr.forEach((item) => {
    result[item.name] = item.link;
  });
  return result;
};

const EditSocials: React.FC<EditSocialsProps> = ({ activeEdit, onEdit }) => {
  const [savedSocials, setSavedSocials] = useState<{ name: SocialPlatform; link: string }[]>([]);
  const [socials, setSocials] = useState<{ name: SocialPlatform; link: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  // LOAD DATA FROM BACKEND
  useEffect(() => {
    (async () => {
      const res = await getProfile();
      if (res.data?.social_handles) {
        const array = backendToArray(res.data.social_handles);
        setSavedSocials(array);
      }
    })();
  }, []);

  // Populate form when opening edit
  useEffect(() => {
    if (activeEdit === "socials") setSocials(savedSocials);
  }, [activeEdit, savedSocials]);

  // Close when clicking outside
  useEffect(() => {
    if (activeEdit !== "socials") return;

    const handler = (e: PointerEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onEdit(null);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [activeEdit]);

  // ADD / REMOVE / UPDATE
  const handleAddSocial = (platform: SocialPlatform) => {
    if (socials.some((s) => s.name === platform)) return;
    setSocials([...socials, { name: platform, link: "" }]);
    setDropdownOpen(false);
  };

  const handleRemove = (name: SocialPlatform) =>
    setSocials(socials.filter((s) => s.name !== name));

  const handleLinkChange = (name: SocialPlatform, value: string) =>
    setSocials((prev) => prev.map((s) => (s.name === name ? { ...s, link: value } : s)));

  // SAVE TO BACKEND
  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const payload = {
      social_handles: arrayToBackend(socials),
    };

    const res = await updateProfile(payload);

    if (res.status === 200) {
      toast.success("Socials updated");
      setSavedSocials(socials);
      onEdit(null);
    } else {
      toast.error(res.message || "Failed to update socials");
    }
  };

  const isFormValid = socials.every((s) => s.link.trim() !== "");

  return (
    <div>
      {/* VIEW MODE */}
      {activeEdit !== "socials" && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Socials</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              {savedSocials.length === 0 ? (
                <span className="text-gray-400">Link to your socials from profile.</span>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {savedSocials.map((s) => {
                    const p = socialOptions.find((opt) => opt.name === s.name);
                    if (!p) return null;
                    return (
                      <div
                        key={s.name}
                        className="flex items-center gap-1 text-xs border border-gray-200 rounded-full px-2 py-1"
                      >
                        <span style={{ color: p.color }}>{p.icon}</span>
                        {s.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              onClick={() => onEdit("socials")}
              className="cursor-pointer text-gray-700 hover:bg-gray-300 py-2 px-4 rounded-md transition"
            >
              Edit
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {activeEdit === "socials" && (
        <>
          <div className="fixed inset-0 bg-transparent z-40" aria-hidden />

          <div
            ref={formRef}
            className="edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm"
          >
            <div className="px-6 pt-5 font-semibold">Socials</div>

            <div className="px-6 py-5">
              <form onSubmit={handleSave}>
                {/* ADDED SOCIALS */}
                <div className="flex flex-col gap-3 mb-3">
                  {socials.map((s) => {
                    const p = socialOptions.find((o) => o.name === s.name);
                    if (!p) return null;

                    return (
                      <div key={s.name} className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: `${p.color}1A`, color: p.color }}
                        >
                          {p.icon}
                        </div>

                        <input
                          type="url"
                          placeholder={p.placeholder}
                          value={s.link}
                          onChange={(e) => handleLinkChange(s.name, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                        />

                        <button type="button" onClick={() => handleRemove(s.name)}>
                          <X className="text-gray-400 hover:text-red-500 w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* ADD BUTTON */}
                <div className="relative mb-5">
                  <button
                    type="button"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 flex items-center gap-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <Plus className="w-4 h-4" /> Add Socials
                    <ChevronDown className="ml-auto w-4 h-4" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md">
                      {socialOptions.map((o) => (
                        <button
                          key={o.name}
                          type="button"
                          onClick={() => handleAddSocial(o.name as SocialPlatform)}
                          className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-100"
                        >
                          <span style={{ color: o.color }}>{o.icon}</span>
                          {o.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(null)}
                    className="px-3 py-1 border rounded-md"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`px-3 py-1 rounded-md text-white ${
                      isFormValid ? "bg-black" : "bg-gray-300 pointer-events-none"
                    }`}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditSocials;
