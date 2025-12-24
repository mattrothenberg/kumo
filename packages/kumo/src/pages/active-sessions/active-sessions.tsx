import { Text } from "../../components/text/text";
import { Badge } from "../../components/badge/badge";
import { LayerCard } from "../../components/layer-card/layer-card";
import { getActiveSessions, type ActiveSession } from "./active-sessions-mocks";

type ActiveSessionsView = "profile/sessions";

export function ActiveSessionsApp({
  view: _view,
}: {
  view: ActiveSessionsView;
}) {
  const sessions = getActiveSessions();

  return (
    <div className="min-h-screen bg-surface p-8 text-surface">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-2">
          <Text variant="heading2">Active Sessions</Text>
          <Text variant="secondary" size="sm" DANGEROUS_className="mt-1">
            Active devices and sessions on your account.
          </Text>
        </div>

        {/* Documentation link pill */}
        <div className="mt-4 mb-6">
          <a
            href="https://developers.cloudflare.com/fundamentals/setup/manage-account/active-sessions/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-transparent px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-color hover:text-surface"
          >
            <BookOpenIcon />
            Active sessions documentation
          </a>
        </div>

        {/* Sessions list */}
        <main className="space-y-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </main>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: ActiveSession }) {
  return (
    <LayerCard>
      <LayerCard.Primary className="gap-3">
        {/* Header row with device info and badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MonitorIcon />
            <Text variant="body" bold>
              {session.deviceName} • {session.os}
            </Text>
          </div>
          {session.isCurrentSession && (
            <Badge variant="primary">Current Session</Badge>
          )}
        </div>

        {/* Session details */}
        <div className="flex flex-col gap-1.5 text-muted">
          <div className="flex items-center gap-2">
            <BrowserIcon />
            <Text variant="secondary" size="sm">
              {session.browser} • {session.ipAddress}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon />
            <Text variant="secondary" size="sm">
              {session.lastSeen}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <LocationIcon />
            <Text variant="secondary" size="sm">
              {session.location}
            </Text>
          </div>
        </div>
      </LayerCard.Primary>
    </LayerCard>
  );
}

function BookOpenIcon() {
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
      className="shrink-0"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function MonitorIcon() {
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
      className="shrink-0 text-surface"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function BrowserIcon() {
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
      className="shrink-0"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function ClockIcon() {
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
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LocationIcon() {
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
      className="shrink-0"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
