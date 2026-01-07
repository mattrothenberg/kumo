import { Banner } from "@cloudflare/kumo";
import { WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react";

export function BannerVariantsDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Banner text="This is a default banner." />
      <Banner
        icon={<WarningIcon weight="fill" />}
        text="This is an alert banner."
        variant="alert"
      />
      <Banner
        icon={<WarningOctagonIcon weight="fill" />}
        text="This is an error banner."
        variant="error"
      />
    </div>
  );
}
