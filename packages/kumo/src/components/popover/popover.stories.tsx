import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FunnelIcon } from "@phosphor-icons/react";
import { Popover } from "./popover";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Select } from "../select/select";

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>
          You are all caught up. Good job!
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Settings</Popover.Title>
        <Popover.Description>
          Configure your preferences below.
        </Popover.Description>
        <div className="mt-3">
          <Popover.Close asChild>
            <Button variant="secondary" size="sm">
              Close
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const SideTop: Story = {
  render: () => (
    <div className="pt-32">
      <Popover>
        <Popover.Trigger asChild>
          <Button>Open Above</Button>
        </Popover.Trigger>
        <Popover.Content side="top">
          <Popover.Title>Top Popover</Popover.Title>
          <Popover.Description>
            This popover appears above the trigger.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

export const SideLeft: Story = {
  render: () => (
    <div className="pl-64">
      <Popover>
        <Popover.Trigger asChild>
          <Button>Open Left</Button>
        </Popover.Trigger>
        <Popover.Content side="left">
          <Popover.Title>Left Popover</Popover.Title>
          <Popover.Description>
            This popover appears to the left.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

export const SideRight: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button>Open Right</Button>
      </Popover.Trigger>
      <Popover.Content side="right">
        <Popover.Title>Right Popover</Popover.Title>
        <Popover.Description>
          This popover appears to the right.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button>Controlled Popover</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Controlled State</Popover.Title>
            <Popover.Description>
              This popover is controlled externally.
            </Popover.Description>
          </Popover.Content>
        </Popover>
        <span className="text-sm text-muted">
          Status: {open ? "Open" : "Closed"}
        </span>
      </div>
    );
  },
};

export const OpenOnHover: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger openOnHover delay={300} asChild>
        <Button>Hover to Open</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Hover Trigger</Popover.Title>
        <Popover.Description>
          This popover opens on hover, similar to a tooltip.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button>User Profile</Button>
      </Popover.Trigger>
      <Popover.Content className="w-64" align="start" sideOffset={16}>
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-full bg-surface-3" />
          <div>
            <Popover.Title>Matt Rothenberg</Popover.Title>
            <p className="text-sm text-muted">mrothenberg@cloudflare.com</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 border-t border-border pt-3 justify-end">
          <div>
            <Popover.Close asChild>
              <Button variant="ghost" size="sm" className="flex-1">
                Close
              </Button>
            </Popover.Close>
          </div>
          <div>
            <Button variant="primary" size="sm" className="flex-1">
              View profile
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const WithOffsets: Story = {
  render: () => (
    <div className="flex gap-8">
      <Popover>
        <Popover.Trigger asChild>
          <Button>Default (8px)</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Default Offset</Popover.Title>
          <Popover.Description>sideOffset: 8px (default)</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger asChild>
          <Button>Large Gap</Button>
        </Popover.Trigger>
        <Popover.Content sideOffset={16}>
          <Popover.Title>Large Side Offset</Popover.Title>
          <Popover.Description>sideOffset: 16px</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger asChild>
          <Button>Shifted Right</Button>
        </Popover.Trigger>
        <Popover.Content align="start" alignOffset={20}>
          <Popover.Title>Align Offset</Popover.Title>
          <Popover.Description>
            align: start, alignOffset: 20px
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

export const FilterPanel: Story = {
  render: function FilterPanelExample() {
    const [filters, setFilters] = React.useState({
      status: "",
      country: "",
      path: "",
    });
    const activeCount = Object.values(filters).filter(Boolean).length;

    return (
      <Popover>
        <Popover.Trigger asChild>
          <Button variant="secondary" icon={FunnelIcon}>
            Filters{activeCount > 0 && ` (${activeCount})`}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-80" align="start" sideOffset={16}>
          <Popover.Title>Filter Requests</Popover.Title>
          <div className="mt-3 space-y-3">
            <div className="flex gap-3">
              <Select
                label="Status Code"
                placeholder="Any status"
                value={filters.status || undefined}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, status: value ?? "" }))
                }
              >
                <Select.Option value="2xx">2xx Success</Select.Option>
                <Select.Option value="3xx">3xx Redirect</Select.Option>
                <Select.Option value="4xx">4xx Client Error</Select.Option>
                <Select.Option value="5xx">5xx Server Error</Select.Option>
              </Select>
              <Select
                label="Country"
                placeholder="Any country"
                value={filters.country || undefined}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, country: value ?? "" }))
                }
              >
                <Select.Option value="US">United States</Select.Option>
                <Select.Option value="GB">United Kingdom</Select.Option>
                <Select.Option value="DE">Germany</Select.Option>
                <Select.Option value="FR">France</Select.Option>
                <Select.Option value="JP">Japan</Select.Option>
              </Select>
            </div>
            <Input
              label="Path contains"
              placeholder="/api/"
              value={filters.path}
              onChange={(e) =>
                setFilters((f) => ({ ...f, path: e.target.value }))
              }
            />
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ status: "", country: "", path: "" })}
            >
              Clear All
            </Button>
            <Popover.Close asChild>
              <Button variant="primary" size="sm">
                Apply Filters
              </Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    );
  },
};
