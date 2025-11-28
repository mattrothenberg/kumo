export type ManagedProfileUser = {
  email: string;
  email_verified: boolean;
  two_factor_authentication_enabled?: boolean;
};

export type ManagedProfileUserDetails = {
  newUserEmail?: string | null;
};

export type ManagedProfileSettings = {
  darkMode: "on" | "off" | "system";
};

export type ManagedProfileCommunicationPreferences = {
  preferences: Record<string, { subscribed: boolean }>;
};

export type ManagedProfileTwoFactorMethods = {
  webauthn: unknown[];
  totp: boolean;
};

export type ManagedProfileOverrides = {
  user?: Partial<ManagedProfileUser>;
  verified?: boolean;
  sso?: boolean;
  newEmailRequested?: string | null;
};

let user: ManagedProfileUser = {
  email: "user@cloudflare.com",
  email_verified: true,
  two_factor_authentication_enabled: true,
};

let userDetails: ManagedProfileUserDetails = {
  newUserEmail: null,
};

let settings: ManagedProfileSettings = {
  darkMode: "system",
};

let communicationPreferences: ManagedProfileCommunicationPreferences = {
  preferences: {
    blog: { subscribed: true },
    education: { subscribed: true },
    events: { subscribed: false },
    product_news: { subscribed: true },
    analytics: { subscribed: true },
  },
};

let sso = false;

let twoFactorMethods: ManagedProfileTwoFactorMethods = {
  webauthn: [],
  totp: true,
};

export function resetManagedProfileMocks() {
  user = {
    email: "user@cloudflare.com",
    email_verified: true,
    two_factor_authentication_enabled: true,
  };

  userDetails = {
    newUserEmail: null,
  };

  settings = {
    darkMode: "system",
  };

  communicationPreferences = {
    preferences: {
      blog: { subscribed: true },
      education: { subscribed: true },
      events: { subscribed: false },
      product_news: { subscribed: true },
      analytics: { subscribed: true },
    },
  };

  sso = false;

  twoFactorMethods = {
    webauthn: [],
    totp: true,
  };
}

export function setupManagedProfileMocks(overrides?: ManagedProfileOverrides) {
  resetManagedProfileMocks();

  if (!overrides) return;

  if (overrides.user) {
    user = { ...user, ...overrides.user };
  }

  if (typeof overrides.verified !== "undefined") {
    user = { ...user, email_verified: overrides.verified };
  }

  if (typeof overrides.newEmailRequested !== "undefined") {
    userDetails = { ...userDetails, newUserEmail: overrides.newEmailRequested };
  }

  if (typeof overrides.sso !== "undefined") {
    sso = overrides.sso;
  }

  // Keep a flag available for any consumers that want a synchronous SSO hint
  (globalThis as unknown as { __MP_SSO__?: boolean }).__MP_SSO__ = Boolean(sso);
}

export function getManagedProfileUser() {
  return user;
}

export function getManagedProfileUserDetails() {
  return userDetails;
}

export function getManagedProfileSettings() {
  return settings;
}

export function getManagedProfileCommunicationPreferences() {
  return communicationPreferences;
}

export function getManagedProfileSSO() {
  return sso;
}

export function getManagedProfileTwoFactorMethods() {
  return twoFactorMethods;
}

export function updateNotificationSubscription(
  key: string,
  subscribed: boolean,
) {
  communicationPreferences = {
    ...communicationPreferences,
    preferences: {
      ...communicationPreferences.preferences,
      [key]: { subscribed },
    },
  };
}
