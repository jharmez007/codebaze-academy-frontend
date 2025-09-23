export type Profile = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export const profile: Profile = {
  id: 1,
  name: "Admin User",
  email: "admin@platform.com",
  role: "Super Admin",
  avatar: "",
};
