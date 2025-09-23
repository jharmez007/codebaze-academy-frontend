// src/components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Tag,
  BarChart3,
  Settings,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Courses",
    icon: BookOpen,
    href: "/admin/courses",
  },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/system-settings", icon: Settings },
];

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
        />
      )}

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Admin
        </div>
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = href && pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href || "#"}
                className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${active
                    ? "text-white bg-green-600 dark:bg-green-500"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile sidebar (animated) */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:hidden top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col"
      >
        <div className="p-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Admin
        </div>
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = href && pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href || "#"}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${active
                    ? "text-white bg-green-600 dark:bg-green-500"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
