const detectOS = (ua: string): string => {
  // WINDOWS (ANY VERSION)
  const winMatch = ua.match(/Windows NT (\d+(\.\d+)?)/i);
  if (winMatch) {
    const version = winMatch[1];

    const map: Record<string, string> = {
      "10.0": "Windows 10",
      "11.0": "Windows 11",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
    };

    // If known version, use mapped label
    if (map[version]) return map[version];

    // If UNMAPPED → Future versions (Windows 12, 13, 20…)
    const major = version.split(".")[0];
    return `Windows ${major}`;
  }

  // macOS
  const macMatch = ua.match(/Mac OS X (\d+[_\.]\d+[_\.]?\d*)/i);
  if (macMatch) {
    const clean = macMatch[1].replace(/_/g, ".");
    return `macOS ${clean}`;
  }

  // iOS
  const iosMatch = ua.match(/(iPhone|iPad).*OS (\d+[_\.]\d+)/i);
  if (iosMatch) {
    const clean = iosMatch[2].replace(/_/g, ".");
    return `iOS ${clean}`;
  }

  // Android
  const androidMatch = ua.match(/Android (\d+(\.\d+)?)/i);
  if (androidMatch) {
    return `Android ${androidMatch[1]}`;
  }

  // Linux
  if (/Linux/i.test(ua)) return "Linux";

  return "Unknown OS";
};

const detectBrowser = (ua: string): string => {
  // Chrome (exclude Edge because it contains "Chrome")
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return "Chrome";
  if (/Edg/i.test(ua)) return "Microsoft Edge";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Opera|OPR/i.test(ua)) return "Opera";

  return "Unknown Browser";
};

export const formatDevice = (ua: string): string => {
  const browser = detectBrowser(ua);
  const os = detectOS(ua);
  return `${browser} on ${os}`;
};

 // Convert timestamp → "Nov 2 at 3:23 PM GMT"
export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  }).replace(",", "").replace("GMT+1", "GMT");
};


