import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { X, Plus, ChevronDown, Globe, Mail } from 'lucide-react';
import {
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaSnapchat,
  FaTiktok,
  FaPinterestP,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';

interface EditSocialsProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

type SocialPlatform =
  | 'YouTube'
  | 'Instagram'
  | 'Facebook'
  | 'Snapchat'
  | 'TikTok'
  | 'Pinterest'
  | 'LinkedIn'
  | 'X'
  | 'Bluesky'
  | 'Website'
  | 'Email';

const socialOptions: {
  name: SocialPlatform;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
}[] = [
  { name: 'YouTube', icon: <FaYoutube className="w-4 h-4" />, color: '#FF0000', placeholder: 'https://youtube.com/yourchannel' },
  { name: 'Instagram', icon: <FaInstagram className="w-4 h-4" />, color: '#E4405F', placeholder: 'https://instagram.com/username' },
  { name: 'Facebook', icon: <FaFacebookF className="w-4 h-4" />, color: '#1877F2', placeholder: 'https://facebook.com/username' },
  { name: 'Snapchat', icon: <FaSnapchat className="w-4 h-4" />, color: '#FFFC00', placeholder: 'https://snapchat.com/add/username' },
  { name: 'TikTok', icon: <FaTiktok className="w-4 h-4" />, color: '#000000', placeholder: 'https://tiktok.com/@username' },
  { name: 'Pinterest', icon: <FaPinterestP className="w-4 h-4" />, color: '#E60023', placeholder: 'https://pinterest.com/username' },
  { name: 'LinkedIn', icon: <FaLinkedinIn className="w-4 h-4" />, color: '#0A66C2', placeholder: 'https://linkedin.com/in/username' },
  { name: 'X', icon: <FaXTwitter className="w-4 h-4" />, color: '#000000', placeholder: 'https://x.com/username' },
  { name: 'Bluesky', icon: <SiBluesky className="w-4 h-4" />, color: '#1185FE', placeholder: 'https://bsky.app/profile/username' },
  { name: 'Website', icon: <Globe className="w-4 h-4" />, color: '#5A5A5A', placeholder: 'https://yourwebsite.com' },
  { name: 'Email', icon: <Mail className="w-4 h-4" />, color: '#C71610', placeholder: 'example@email.com' },
];

const EditSocials: React.FC<EditSocialsProps> = ({ activeEdit, onEdit }) => {
  const [savedSocials, setSavedSocials] = useState<{ name: SocialPlatform; link: string }[]>([]);
  const [socials, setSocials] = useState<{ name: SocialPlatform; link: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  // Populate form when edit opens
  useEffect(() => {
    if (activeEdit === 'socials') {
      setSocials(savedSocials);
    }
  }, [activeEdit, savedSocials]);

  // Close edit when clicking outside
  useEffect(() => {
    if (activeEdit !== 'socials') return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!formRef.current) return;
      if (target && !formRef.current.contains(target)) {
        onEdit && onEdit(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeEdit, onEdit]);

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit('socials');
  };

  const handleAddSocial = (platform: SocialPlatform) => {
    setSocials([...socials, { name: platform, link: '' }]);
    setDropdownOpen(false);
  };

  const handleRemove = (name: SocialPlatform) => {
    setSocials(socials.filter((s) => s.name !== name));
  };

  const handleLinkChange = (name: SocialPlatform, value: string) => {
    setSocials((prev) =>
      prev.map((s) => (s.name === name ? { ...s, link: value } : s))
    );
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setSocials(savedSocials);
    onEdit && onEdit(null);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSavedSocials(socials);
    onEdit && onEdit(null);
    toast.success('Socials updated');
  };

  const isFormValid = socials.every((s) => s.link.trim() !== '');

  return (
    <div>
      {/* Display mode */}
      {activeEdit !== 'socials' && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Socials</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              <span className="text-gray-400">
                {savedSocials.length === 0
                  ? 'Link to your socials from profile.'
                  : ''}
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {savedSocials.map((s) => {
                  const platform = socialOptions.find((opt) => opt.name === s.name);
                  if (!platform) return null;
                  return (
                    <div
                      key={s.name}
                      className="flex items-center gap-1 text-xs border border-gray-200 rounded-full px-2 py-1"
                    >
                      <span
                        className="flex items-center"
                        style={{ color: platform.color }}
                      >
                        {platform.icon}
                      </span>
                      <span>{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Edit button */}
            <div
              onClick={openEdit}
              className={`cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4
                ${activeEdit ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-300'}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (!activeEdit && e.key === 'Enter') openEdit();
              }}
              aria-disabled={!!activeEdit}
            >
              <span className={activeEdit ? 'text-gray-500' : ''}>Edit</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit form */}
      {activeEdit === 'socials' && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onMouseDown={() => onEdit && onEdit(null)}
            aria-hidden
          />

          <div
            ref={formRef}
            className="edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm"
          >
            {/* header */}
            <div className="flex justify-between items-center px-6 pt-5">
              <div className="font-semibold">Socials</div>
            </div>

            {/* body */}
            <div className="px-6 py-5">
              <form onSubmit={handleSave}>
                {/* added socials */}
                <div className="flex flex-col gap-3 mb-3">
                  {socials.map((s) => {
                    const platform = socialOptions.find((opt) => opt.name === s.name);
                    if (!platform) return null;
                    return (
                      <div key={s.name} className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center w-9 h-9 rounded-full transition-transform hover:scale-105"
                          style={{ backgroundColor: `${platform.color}1A`, color: platform.color }}
                        >
                          {platform.icon}
                        </div>
                        <input
                          type="url"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          placeholder={platform.placeholder}
                          value={s.link}
                          onChange={(e) =>
                            handleLinkChange(s.name, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemove(s.name)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add social dropdown */}
                <div className="relative mb-5">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-100 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Socials
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-50">
                      {socialOptions.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => handleAddSocial(option.name)}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 transition"
                        >
                          <span
                            className="flex items-center"
                            style={{ color: option.color }}
                          >
                            {option.icon}
                          </span>
                          {option.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* actions */}
                <div className="flex justify-end flex-wrap gap-2">
                  <button
                    onClick={handleDiscard}
                    className="cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition ease-in"
                    type="button"
                  >
                    Discard
                  </button>
                  <button
                    className={`cursor-pointer text-white rounded-md py-1 px-3 text-sm 
                      ${
                        isFormValid
                          ? 'bg-[#06040E] border border-[#06040E]'
                          : 'bg-gray-300 border border-gray-300 pointer-events-none'
                      }`}
                    type="submit"
                    disabled={!isFormValid}
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
