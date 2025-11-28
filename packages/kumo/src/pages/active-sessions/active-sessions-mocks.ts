export type ActiveSession = {
  id: string;
  deviceName: string;
  os: string;
  browser: string;
  ipAddress: string;
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
    browser: "Chrome",
    ipAddress: "2a09:bac5:6191:1b2d::2b5:14",
    lastSeen: "November 28, 2025 at 6:36 AM, last seen 5 seconds ago",
    location: "US",
    isCurrentSession: true,
  },
];

export function resetActiveSessionsMocks() {
  sessions = [
    {
      id: "1",
      deviceName: "Macintosh",
      os: "macOS",
      browser: "Chrome",
      ipAddress: "2a09:bac5:6191:1b2d::2b5:14",
      lastSeen: "November 28, 2025 at 6:36 AM, last seen 5 seconds ago",
      location: "US",
      isCurrentSession: true,
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
