export type Admin = {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Instructor" | "Support" | "Moderator";
  active: boolean;
};

export const admins: Admin[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@platform.com",
    role: "Super Admin",
    active: true,
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@platform.com",
    role: "Instructor",
    active: false,
  },
  {
    id: 3,
    name: "Sarah Lee",
    email: "sarah@platform.com",
    role: "Support",
    active: true,
  },
];
