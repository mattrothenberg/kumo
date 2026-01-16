export type ActiveSession = {
  id: string;
  deviceName: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  ipAddress: string;
  loginTime: string;
  lastSeen: string;
  location: string;
  isCurrentSession: boolean;
};

export type ActiveSessionsOverrides = {
  sessions?: ActiveSession[];
};

let sessions: ActiveSession[] = [
  {
    id: "1",
    deviceName: "Macintosh",
    os: "macOS",
    deviceType: "desktop",
    browser: "Chrome",
    ipAddress: "2a09:bac5:6191:1b2d::2b5:14",
    loginTime: "Nov 28, 2025 06:36:00",
    lastSeen: "5 seconds ago",
    location: "San Francisco, CA, US",
    isCurrentSession: true,
  },
  {
    id: "2",
    deviceName: "iPhone",
    os: "iOS 17",
    deviceType: "mobile",
    browser: "Safari",
    ipAddress: "192.168.1.100",
    loginTime: "Nov 27, 2025 14:22:15",
    lastSeen: "2 hours ago",
    location: "New York, NY, US",
    isCurrentSession: false,
  },
  {
    id: "3",
    deviceName: "iPad Pro",
    os: "iPadOS 17",
    deviceType: "tablet",
    browser: "Safari",
    ipAddress: "10.0.0.50",
    loginTime: "Nov 26, 2025 09:15:30",
    lastSeen: "1 day ago",
    location: "London, UK",
    isCurrentSession: false,
  },
];

export function resetActiveSessionsMocks() {
  sessions = [
    {
      id: "1",
      deviceName: "Macintosh",
      os: "macOS",
      deviceType: "desktop",
      browser: "Chrome",
      ipAddress: "2a09:bac5:6191:1b2d::2b5:14",
      loginTime: "Nov 28, 2025 06:36:00",
      lastSeen: "5 seconds ago",
      location: "San Francisco, CA, US",
      isCurrentSession: true,
    },
    {
      id: "2",
      deviceName: "iPhone",
      os: "iOS 17",
      deviceType: "mobile",
      browser: "Safari",
      ipAddress: "192.168.1.100",
      loginTime: "Nov 27, 2025 14:22:15",
      lastSeen: "2 hours ago",
      location: "New York, NY, US",
      isCurrentSession: false,
    },
    {
      id: "3",
      deviceName: "iPad Pro",
      os: "iPadOS 17",
      deviceType: "tablet",
      browser: "Safari",
      ipAddress: "10.0.0.50",
      loginTime: "Nov 26, 2025 09:15:30",
      lastSeen: "1 day ago",
      location: "London, UK",
      isCurrentSession: false,
    },
  ];
}

export function setupActiveSessionsMocks(overrides?: ActiveSessionsOverrides) {
  resetActiveSessionsMocks();

  if (!overrides) return;

  if (overrides.sessions) {
    sessions = overrides.sessions;
  }
}

export function getActiveSessions() {
  return sessions;
}
