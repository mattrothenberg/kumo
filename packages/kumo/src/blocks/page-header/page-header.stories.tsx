import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader, KUMO_PAGE_HEADER_VARIANTS } from "./page-header";
import { Breadcrumbs } from "../breadcrumbs";
import { Button } from "../../components/button";
import { PlusIcon } from "@phosphor-icons/react";
import { propTester } from "../../utils/prop-tester";

const meta = {
  title: "Blocks/PageHeader",
  component: PageHeader,
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { breadcrumbs: undefined as any },
  render: () => (
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
  ),
};

export const Spacing: Story = {
  args: {
    breadcrumbs: (
      <Breadcrumbs>
        <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>Current</Breadcrumbs.Current>
      </Breadcrumbs>
    ),
  },
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_PAGE_HEADER_VARIANTS.spacing),
        "spacing",
        <PageHeader
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
        />,
      )}
    </>
  ),
};

export const WithTabs: Story = {
  render: () => (
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
  ),
  args: { breadcrumbs: undefined as any },
};

export const WithTabsAndActions: Story = {
  render: () => (
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
      <Button variant="outline" size="sm">
        Export
      </Button>
      <Button variant="primary" size="sm">
        <PlusIcon size={16} />
        New Item
      </Button>
    </PageHeader>
  ),
  args: { breadcrumbs: undefined as any },
};
