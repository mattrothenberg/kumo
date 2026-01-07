import { PageHeader, Breadcrumbs, Button } from "@cloudflare/kumo";
import { Plus } from "@phosphor-icons/react";

export function PageHeaderDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
        </Breadcrumbs>
      }
    />
  );
}

export function PageHeaderSpacingDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm text-muted">Compact</p>
        <PageHeader
          spacing="compact"
          breadcrumbs={
            <Breadcrumbs>
              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
              <Breadcrumbs.Current>Current</Breadcrumbs.Current>
            </Breadcrumbs>
          }
          tabs={[
            { label: "General", value: "general" },
            { label: "Settings", value: "settings" },
          ]}
          defaultTab="general"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">Base</p>
        <PageHeader
          spacing="base"
          breadcrumbs={
            <Breadcrumbs>
              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
              <Breadcrumbs.Current>Current</Breadcrumbs.Current>
            </Breadcrumbs>
          }
          tabs={[
            { label: "General", value: "general" },
            { label: "Settings", value: "settings" },
          ]}
          defaultTab="general"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">Relaxed</p>
        <PageHeader
          spacing="relaxed"
          breadcrumbs={
            <Breadcrumbs>
              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
              <Breadcrumbs.Current>Current</Breadcrumbs.Current>
            </Breadcrumbs>
          }
          tabs={[
            { label: "General", value: "general" },
            { label: "Settings", value: "settings" },
          ]}
          defaultTab="general"
        />
      </div>
    </div>
  );
}

export function PageHeaderWithTabsDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "General", value: "general" },
        { label: "Security", value: "security" },
        { label: "Notifications", value: "notifications" },
        { label: "Billing", value: "billing" },
      ]}
      defaultTab="general"
    />
  );
}

export function PageHeaderWithActionsDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "Overview", value: "overview" },
        { label: "Analytics", value: "analytics" },
        { label: "Settings", value: "settings" },
      ]}
      defaultTab="overview"
    >
      <Button variant="secondary" size="sm">
        Export
      </Button>
      <Button variant="primary" size="sm">
        <Plus size={16} />
        New Item
      </Button>
    </PageHeader>
  );
}
