import { useState, type ReactNode } from "react";
import { Tabs } from "../../components/tabs";
import { Text } from "../../components/text/text";
import { Badge } from "../../components/badge/badge";
import { Select } from "../../components/select/select";
import { Button } from "../../components/button";
import {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "../../components/dialog/dialog";
import { Banner } from "../../components/banner/banner";
import { Field } from "../../components/field/field";
import { LayerCard } from "../../components/layer-card/layer-card";
import { Input } from "../../components/input/input";
import { Checkbox } from "../../components/checkbox/checkbox";
import {
  getManagedProfileCommunicationPreferences,
  getManagedProfileSSO,
  getManagedProfileTwoFactorMethods,
  getManagedProfileUser,
  getManagedProfileUserDetails,
  updateNotificationSubscription,
} from "./managed-profile-mocks";

type ManagedProfileView =
  | "profile/managed-profile/preferences"
  | "preferences-sso"
  | "preferences-email-update"
  | "preferences-email-delete-1"
  | "preferences-email-delete-2"
  | "preferences-email-delete-3"
  | "preferences-email-pending"
  | "profile/managed-profile/notifications"
  | "profile/managed-profile/authentication"
  | "authentication-sso";

export function ManagedProfileApp({ view }: { view: ManagedProfileView }) {
  const user = getManagedProfileUser();
  const userDetails = getManagedProfileUserDetails();
  const communicationPreferences = getManagedProfileCommunicationPreferences();
  const sso = getManagedProfileSSO();
  const twoFactorMethods = getManagedProfileTwoFactorMethods();

  const initialTab: "preferences" | "notifications" | "authentication" =
    view.startsWith("profile/managed-profile/notifications")
      ? "notifications"
      : view.startsWith("profile/managed-profile/authentication") ||
          view === "authentication-sso"
        ? "authentication"
        : "preferences";

  const [currentTab, setCurrentTab] = useState<
    "preferences" | "notifications" | "authentication"
  >(initialTab);

  return (
    <div className="min-h-[100vh] bg-surface p-8 text-secondary">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-2">
          <Text variant="secondary" size="sm">
            {user.email}
          </Text>
          <Text variant="heading2">Profile</Text>
        </div>

        {/* Tabs */}
        <Tabs
          className="w-fit"
          tabs={[
            { label: "Settings", value: "preferences" },
            ...(initialTab === "authentication"
              ? [
                  {
                    label: "Security and Authentication",
                    value: "authentication",
                  },
                ]
              : []),
            { label: "Notifications", value: "notifications" },
          ]}
          value={currentTab}
          onValueChange={(value) =>
            setCurrentTab(
              value as "preferences" | "notifications" | "authentication",
            )
          }
        />
      </div>

      <main className="mx-auto mt-8 max-w-4xl space-y-10">
        {currentTab === "preferences" && (
          <PreferencesView
            userEmail={user.email}
            userEmailVerified={user.email_verified}
            view={view}
            sso={sso}
            pendingEmail={
              view === "preferences-email-pending"
                ? userDetails.newUserEmail
                : undefined
            }
          />
        )}
        {currentTab === "notifications" && (
          <NotificationsView
            preferences={communicationPreferences.preferences}
          />
        )}
        {currentTab === "authentication" && (
          <AuthenticationView
            _is2FAEnabled={Boolean(user.two_factor_authentication_enabled)}
            _sso={sso}
            twoFactorMethods={twoFactorMethods}
          />
        )}
      </main>
    </div>
  );
}

function SettingsHeading({ children }: { children: ReactNode }) {
  return (
    <Text variant="heading3" DANGEROUS_className="mb-4">
      {children}
    </Text>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text variant="body" bold DANGEROUS_className="mb-2">
      {children}
    </Text>
  );
}

function PreferencesView({
  userEmail,
  userEmailVerified,
  view,
  sso,
  pendingEmail,
}: {
  userEmail: string;
  userEmailVerified: boolean;
  view: ManagedProfileView;
  sso: boolean;
  pendingEmail?: string | null;
}) {
  const initialEmailDialogOpen = view === "preferences-email-update";
  const initialDeleteDialogOpen = view.startsWith("preferences-email-delete-");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(
    initialEmailDialogOpen,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(
    initialDeleteDialogOpen,
  );
  const deleteStep: "warning" | "form" | "confirm" | undefined =
    view === "preferences-email-delete-1"
      ? "warning"
      : view === "preferences-email-delete-2"
        ? "form"
        : view === "preferences-email-delete-3"
          ? "confirm"
          : undefined;

  return (
    <div className="max-w-fit">
      <SettingsHeading>Settings</SettingsHeading>

      {/* Email Section */}
      <FieldLabel>Email</FieldLabel>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Text variant="secondary">{userEmail}</Text>
          <Badge variant={userEmailVerified ? "secondary" : "destructive"}>
            {userEmailVerified ? "Verified" : "Unverified"}
          </Badge>
          <DialogRoot
            open={isEmailDialogOpen}
            onOpenChange={setIsEmailDialogOpen}
          >
            <DialogTrigger
              render={
                <Button size="sm" variant="outline" disabled={sso}>
                  Update email
                </Button>
              }
            />
            <UpdateEmailDialog currentEmail={userEmail} />
          </DialogRoot>
        </div>
        {pendingEmail && <PendingEmailBanner newEmail={pendingEmail} />}
      </div>

      {/* Language Section */}
      <FieldLabel>Language</FieldLabel>
      <div className="mb-6">
        <Select
          className="w-[300px]"
          placeholder="Select a Language"
          defaultValue="en"
        >
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="ja">日本語</Select.Option>
          <Select.Option value="es">Español</Select.Option>
          <Select.Option value="de">Deutsch</Select.Option>
          <Select.Option value="fr">Français</Select.Option>
        </Select>
      </div>

      {/* Dashboard Appearance Section */}
      <FieldLabel>Dashboard appearance</FieldLabel>
      <div className="mb-6">
        <Select
          className="w-[300px]"
          placeholder="Select a display color preference"
          defaultValue="system"
        >
          <Select.Option value="system">System</Select.Option>
          <Select.Option value="light">Light</Select.Option>
          <Select.Option value="dark">Dark</Select.Option>
        </Select>
      </div>

      {/* Divider */}
      <hr className="my-8 border-border" />

      {/* Delete Profile Section */}
      <Text variant="heading3" DANGEROUS_className="mb-2">
        Delete your profile
      </Text>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Text variant="secondary">Permanently delete the user {userEmail}</Text>
        <DialogRoot
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogTrigger
            render={
              <Button
                size="sm"
                variant="outline"
                className="border-destructive text-error hover:bg-destructive/10"
                disabled={sso}
              >
                Delete User
              </Button>
            }
          />
          <DeleteUserDialog step={deleteStep} />
        </DialogRoot>
      </div>
    </div>
  );
}

function NotificationsView({
  preferences,
}: {
  preferences: Record<string, { subscribed: boolean }>;
}) {
  const MARKETING_NOTIFICATION_OPTIONS = [
    {
      label: "Blog",
      description:
        "Stay up to date on the trends from the technical visionaries building our next generation network.",
      value: "blog",
    },
    {
      label: "Education and Resources",
      description:
        "Get the most from your Cloudflare subscription with helpful content and resources.",
      value: "education",
    },
    {
      label: "Events",
      description:
        "Get updates on upcoming in-person and online events, conferences, and webinars from Cloudflare.",
      value: "events",
    },
    {
      label: "Product News and Promotions",
      description:
        "Learn about the latest Cloudflare products, features, and promotions.",
      value: "product_news",
    },
  ];

  const DOMAIN_NOTIFICATION_OPTIONS = [
    {
      label: "Analytics",
      description:
        "Gain visibility into the performance and security of your domain with in-depth analytics.",
      value: "analytics",
    },
  ];

  const allOptions = [
    { group: "Marketing", options: MARKETING_NOTIFICATION_OPTIONS },
    { group: "Domain", options: DOMAIN_NOTIFICATION_OPTIONS },
  ];

  return (
    <div className="space-y-6">
      {allOptions.map(({ group, options }) => (
        <div key={group} className="space-y-3">
          <Text variant="body" bold size="sm">
            {group}
          </Text>
          <div className="space-y-4">
            {options.map(({ label, description, value }) => {
              const subscribed = preferences[value]?.subscribed;
              return (
                <div key={value} className="space-y-1">
                  <Checkbox
                    label={label}
                    checked={subscribed}
                    onValueChange={(checked) =>
                      updateNotificationSubscription(value, checked)
                    }
                    className="text-sm font-medium text-secondary"
                  />
                  <Text
                    variant="secondary"
                    size="sm"
                    DANGEROUS_className="ml-6"
                  >
                    {description}
                  </Text>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AuthenticationView({
  _is2FAEnabled,
  _sso,
  twoFactorMethods,
}: {
  _is2FAEnabled: boolean;
  _sso: boolean;
  twoFactorMethods: { webauthn: unknown[]; totp: boolean };
}) {
  const hasSecurityKey = twoFactorMethods.webauthn.length > 0;
  const hasAuthenticatorApp = twoFactorMethods.totp;

  return (
    <div className="space-y-8">
      {/* Two-factor authentication (2FA) header */}
      <div>
        <div className="flex items-start justify-between">
          <div className="max-w-xl">
            <Text variant="heading3">Two-factor authentication (2FA)</Text>
            <Text variant="secondary" size="sm" DANGEROUS_className="mt-1">
              Require a verification code, physical security key, or biometrics
              in addition to your password when you log in.
            </Text>
          </div>
          <Button size="sm" variant="primary">
            Set up
          </Button>
        </div>
      </div>

      {/* 2FA methods */}
      <div>
        <Text variant="body" bold size="sm" DANGEROUS_className="mb-4">
          2FA methods
        </Text>
        <div className="divide-y divide-border">
          {/* Security key or biometrics */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-8">
              <Text variant="body" bold size="sm">
                Security key or biometrics
              </Text>
              <Text variant="secondary" size="sm">
                Use a physical security key or biometrics as your second factor
                of authentication.
              </Text>
            </div>
            {!hasSecurityKey && (
              <Button size="sm" variant="primary">
                Set up
              </Button>
            )}
          </div>

          {/* Authenticator App */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-8">
              <Text variant="body" bold size="sm">
                Authenticator App
              </Text>
              <Text variant="secondary" size="sm">
                Use a third-party authentication app as your second factor of
                authentication.
              </Text>
            </div>
            {!hasAuthenticatorApp && (
              <Button size="sm" variant="primary">
                Set up
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Recovery Codes */}
      <div>
        <Text variant="body" bold size="sm">
          Recovery Codes
        </Text>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function PendingEmailBanner({ newEmail }: { newEmail: string }) {
  return (
    <Banner
      icon={<InfoIcon />}
      text={`You have requested to change your email address to ${newEmail}. Please verify your new email address to continue.`}
    />
  );
}

function UpdateEmailDialog({ currentEmail }: { currentEmail: string }) {
  return (
    <Dialog className="w-[400px]">
      <div className="flex items-center justify-between p-4">
        <DialogTitle className="text-base font-semibold text-secondary">
          Update Email
        </DialogTitle>
        <DialogClose className="text-muted-foreground hover:text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </DialogClose>
      </div>
      <div className="space-y-4 p-4">
        <Field label="Current Email">
          <Input
            value={currentEmail}
            disabled
            className="bg-surface-secondary"
          />
        </Field>
        <Field label="Updated Email">
          <Input placeholder="" />
        </Field>
        <Field label="Confirm Updated Email">
          <Input placeholder="" />
        </Field>
        <Field label="Password">
          <Input type="password" placeholder="" />
        </Field>
      </div>
      <div className="flex justify-end gap-2 p-4">
        <DialogClose
          render={
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          }
        />
        <Button size="sm" variant="primary">
          Update
        </Button>
      </div>
    </Dialog>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className ?? ""}`}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function DeleteUserDialog({
  step = "warning",
}: {
  step?: "warning" | "form" | "confirm";
}) {
  return (
    <Dialog className="w-[400px]">
      <div className="flex items-center justify-between p-4">
        <DialogTitle className="text-base font-semibold text-secondary">
          Delete User
        </DialogTitle>
        <DialogClose className="text-muted-foreground hover:text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </DialogClose>
      </div>

      {step === "warning" && <DeleteUserWarningContent />}
      {step === "form" && <DeleteUserFormContent />}
      {step === "confirm" && <DeleteUserConfirmContent />}
    </Dialog>
  );
}

function DeleteUserWarningContent() {
  return (
    <>
      <div className="space-y-4 p-4">
        <Text variant="body" size="sm">
          <span className="font-semibold">Important:</span>{" "}
          <a href="#" className="text-info hover:underline">
            Follow these prerequisites <ExternalLinkIcon />
          </a>{" "}
          before deleting your user account.
        </Text>
        <Text variant="body" size="sm">
          All domains and Workers associated with your primary account and any
          other accounts where you were the last active member will be deleted.
        </Text>
        <Text variant="body" size="sm">
          Learn more about{" "}
          <a href="#" className="text-info hover:underline">
            deleting your user account <ExternalLinkIcon />
          </a>
        </Text>
        <LayerCard>
          <LayerCard.Primary className="flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="text-error" />
              <Text variant="body" size="sm">
                Deletion is permanent and the associated email address cannot be
                used to create a new Cloudflare account.
              </Text>
            </div>
          </LayerCard.Primary>
        </LayerCard>
      </div>
      <div className="flex justify-end p-4">
        <Button
          size="sm"
          variant="primary"
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete user
        </Button>
      </div>
    </>
  );
}

function DeleteUserFormContent() {
  return (
    <>
      <div className="space-y-4 p-4">
        <Field label="Enter email">
          <Input placeholder="" />
        </Field>
        <Field label="Enter password">
          <Input type="password" placeholder="" />
        </Field>
        <Field label="Type DELETE to confirm">
          <Input placeholder="" />
        </Field>
        <Text variant="secondary" size="sm">
          Note: It could take up to 12 months to delete your information
          completely. Cloudflare will purge your personal information within a
          year of your deletion request unless we are required to retain it to
          fulfill our legal obligations (such as ongoing abuse investigations or
          pending litigation).
        </Text>
      </div>
      <div className="flex justify-end gap-2 p-4">
        <DialogClose
          render={
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          }
        />
        <Button
          size="sm"
          variant="primary"
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete user
        </Button>
      </div>
    </>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function DeleteUserConfirmContent() {
  return (
    <div className="space-y-4 p-4">
      <Banner
        icon={<CheckCircleIcon />}
        text="Cloudflare is committed to privacy. Our network and all of our products are built with protection in mind."
      />
      <Text variant="body" size="sm" DANGEROUS_className="text-info">
        You will be logged out in 5 seconds.
      </Text>
    </div>
  );
}
