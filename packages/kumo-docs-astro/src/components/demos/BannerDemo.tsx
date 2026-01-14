import { Banner } from "@cloudflare/kumo";
import { Info, WarningCircle } from "@phosphor-icons/react";

export function BannerVariantsDemo() {
  return (
    <div className="space-y-3">
      <Banner text="This is an informational banner." />
      <Banner variant="alert" text="This is an alert banner." />
      <Banner variant="error" text="This is an error banner." />
    </div>
  );
}

export function BannerDefaultDemo() {
  return <Banner text="This is an informational banner." />;
}

export function BannerAlertDemo() {
  return <Banner variant="alert" text="Your session will expire soon." />;
}

export function BannerErrorDemo() {
  return <Banner variant="error" text="We couldn't save your changes." />;
}

export function BannerWithIconDemo() {
  return (
    <Banner
      icon={<WarningCircle />}
      variant="alert"
      text="Review your billing information."
    />
  );
}
