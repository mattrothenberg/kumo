import { Text } from "../../components/text/text";
import { Badge } from "../../components/badge/badge";
import { Button } from "../../components/button/button";
import { LayerCard } from "../../components/layer-card/layer-card";
import { getActiveSessions, type ActiveSession } from "./active-sessions-mocks";
import {
  Desktop as DesktopIcon,
  DeviceMobile as DeviceMobileIcon,
  DeviceTablet as DeviceTabletIcon,
  Globe as GlobeIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
} from "@phosphor-icons/react";

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
        {/* Header with responsive documentation button */}
        <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Text variant="heading1" as="h1">
              Active Sessions
            </Text>
            <div className="hidden md:block">
              <Text variant="secondary" size="lg">
                Active devices and sessions on your account.
              </Text>
            </div>
          </div>
          <Button
            variant="secondary"
            size="base"
            className="hidden md:flex"
            onClick={() =>
              window.open(
                "https://developers.cloudflare.com/fundamentals/setup/account/account-security/manage-active-sessions/",
                "_blank",
              )
            }
          >
            Documentation
          </Button>
        </div>

        {/* Sessions list */}
        <main className="flex min-w-0 flex-col gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </main>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: ActiveSession }) {
  const deviceIcon = (() => {
    const iconProps = { size: 20, weight: "regular" as const };
    switch (session.deviceType) {
      case "mobile":
        return <DeviceMobileIcon {...iconProps} />;
      case "tablet":
        return <DeviceTabletIcon {...iconProps} />;
      case "desktop":
      default:
        return <DesktopIcon {...iconProps} />;
    }
  })();

  return (
    <LayerCard className="min-w-0">
      <LayerCard.Primary>
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            {deviceIcon}
            <div className="min-w-0">
              <Text variant="body" bold>
                {session.deviceName} · {session.os}
              </Text>
            </div>
          </div>
          {session.isCurrentSession ? (
            <Badge variant="primary">Current Session</Badge>
          ) : (
            <Button variant="secondary" size="sm">
              Revoke
            </Button>
          )}
        </div>
      </LayerCard.Primary>

      <LayerCard.Secondary>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <GlobeIcon
              size={14}
              weight="regular"
              className="shrink-0"
              aria-hidden
            />
            <div className="min-w-0">
              <Text variant="secondary" size="sm">
                Browser: {session.browser} · IP address: {session.ipAddress}
              </Text>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <ClockIcon
              size={14}
              weight="regular"
              className="shrink-0"
              aria-hidden
            />
            <div className="min-w-0">
              <Text variant="secondary" size="sm">
                Login: {session.loginTime} · Last Seen: {session.lastSeen}
              </Text>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <MapPinIcon
              size={14}
              weight="regular"
              className="shrink-0"
              aria-hidden
            />
            <div className="min-w-0">
              <Text variant="secondary" size="sm">
                Location: {session.location}
              </Text>
            </div>
          </div>
        </div>
      </LayerCard.Secondary>
    </LayerCard>
  );
}
