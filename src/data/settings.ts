// 🔑 Types
export type BrandingSettings = {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  theme: "Light" | "Dark" | "System";
};

export type NotificationSettings = {
  emailEnabled: boolean;
  smsEnabled: boolean;
  smtpServer: string;
  smsApiKey: string;
};

// 📝 Mock Data
export const brandingSettings: BrandingSettings = {
  logo: null,
  primaryColor: "#2563eb",
  secondaryColor: "#10b981",
  theme: "Light",
};

export const notificationSettings: NotificationSettings = {
  emailEnabled: true,
  smsEnabled: false,
  smtpServer: "",
  smsApiKey: "",
};
