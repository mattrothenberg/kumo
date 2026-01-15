import { useState } from "react";
import {
  Button,
  Input,
  Surface,
  Checkbox,
  Select,
  Switch,
  Dialog,
  DropdownMenu,
  Tooltip,
  TooltipProvider,
  Toasty,
  Toast,
  Collapsible,
  Combobox,
  CodeBlock,
  Banner,
  Loader,
  Badge,
  SkeletonLine,
  InputArea,
  Tabs,
  Pagination,
  Meter,
  LayerCard,
} from "@cloudflare/kumo";
import {
  PlusIcon,
  WarningIcon,
  WarningOctagonIcon,
} from "@phosphor-icons/react";

interface ComponentItem {
  name: string;
  id: string;
  route: string | null;
}

const componentRoutes: Record<string, string> = {
  button: "/components/button",
  input: "/components/input",
  select: "/components/select",
  combobox: "/components/combobox",
  switch: "/components/switch",
  dialog: "/components/dialog",
  tooltip: "/components/tooltip",
  dropdown: "/components/dropdown",
  collapsible: "/components/collapsible",
  checkbox: "/components/checkbox",
  "layer-card": "/components/layer-card",
  loader: "/components/loader",
  "skeleton-line": "/components/skeleton-line",
  surface: "/components/surface",
  code: "/components/code",
  banner: "/components/banner",
  badge: "/components/badge",
  tabs: "/components/tabs",
};

function ToastTriggerButton() {
  const toastManager = Toast.useToastManager();
  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: `Toast created`,
          description: "This is a toast notification.",
        })
      }
    >
      Give me a toast
    </Button>
  );
}

export function HomeGrid() {
  const [switchToggled, setSwitchToggled] = useState(true);
  const [checked, setChecked] = useState(true);

  const components: Array<{
    name: string;
    id: string;
    Component: React.ReactNode;
  }> = [
    {
      name: "Button",
      id: "button",
      Component: (
        <div className="grid gap-3">
          <Button icon={PlusIcon}>Create Worker</Button>
          <Button variant="primary" icon={PlusIcon}>
            Create Worker
          </Button>
          <Button loading>Create Worker</Button>
        </div>
      ),
    },
    {
      name: "Input",
      id: "input",
      Component: (
        <div className="grid gap-3">
          <Input placeholder="Type something..." />
          <Input variant="error" value="Invalid!" />
        </div>
      ),
    },
    {
      name: "Select",
      id: "select",
      Component: (
        <Select
          className="w-[200px]"
          renderValue={(v) => {
            const labels: Record<string, string> = {
              all: "All deployed versions",
              active: "Active versions",
              specific: "Specific versions",
            };
            if (!v) return "Select a version...";
            return labels[v as string];
          }}
        >
          <Select.Option value="all">All deployed versions</Select.Option>
          <Select.Option value="active">Active versions</Select.Option>
          <Select.Option value="specific">Specific versions</Select.Option>
        </Select>
      ),
    },
    {
      name: "Combobox",
      id: "combobox",
      Component: (
        <Combobox
          items={[
            { id: "bug", value: "bug" },
            { id: "docs", value: "documentation" },
            { id: "enhancement", value: "enhancement" },
            { id: "help-wanted", value: "help wanted" },
            { id: "good-first-issue", value: "good first issue" },
          ]}
        >
          <Combobox.TriggerInput placeholder="Select an issue..." />
          <Combobox.Content>
            <Combobox.List>
              {(item: { id: string; value: string }) => (
                <Combobox.Item key={item.id} value={item.value}>
                  {item.value}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      ),
    },
    {
      name: "Switch",
      id: "switch",
      Component: (
        <Switch
          checked={switchToggled}
          onClick={() => {
            setSwitchToggled(!switchToggled);
          }}
        />
      ),
    },
    {
      name: "Input (with validation)",
      id: "input",
      Component: (
        <Input
          label="Email"
          placeholder="name@example.com"
          type="email"
          variant="error"
          error={{
            message: "Please enter a valid email.",
            match: "typeMismatch",
          }}
          description="The email to send notifications to."
        />
      ),
    },
    {
      name: "Dialog",
      id: "dialog",
      Component: (
        <Dialog.Root>
          <Dialog.Trigger render={(p) => <Button {...p}>Click me!</Button>} />
          <Dialog>
            <Dialog.Title>Hello!</Dialog.Title>
            <Dialog.Description>I'm a dialog.</Dialog.Description>
          </Dialog>
        </Dialog.Root>
      ),
    },
    {
      name: "Tooltip",
      id: "tooltip",
      Component: (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip content="Add" asChild open>
              <Button shape="square" icon={PlusIcon} />
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
    {
      name: "Dropdown",
      id: "dropdown",
      Component: (
        <DropdownMenu open modal={false}>
          <DropdownMenu.Trigger render={<Button icon={PlusIcon}>Add</Button>} />
          <DropdownMenu.Content>
            <DropdownMenu.Item>Worker</DropdownMenu.Item>
            <DropdownMenu.Item>Pages</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    },
    {
      name: "Collapsible",
      id: "collapsible",
      Component: (
        <Collapsible label="What is Kumo?">
          Kumo is Cloudflare's component library.
        </Collapsible>
      ),
    },
    {
      name: "Checkbox",
      id: "checkbox",
      Component: (
        <Checkbox
          label="Max bandwidth"
          checked={checked}
          onValueChange={(checked) => {
            setChecked(checked);
          }}
        />
      ),
    },
    {
      name: "LayerCard",
      id: "layer-card",
      Component: (
        <LayerCard className="w-[200px]">
          <LayerCard.Secondary>Next Steps</LayerCard.Secondary>
          <LayerCard.Primary>Hello</LayerCard.Primary>
        </LayerCard>
      ),
    },
    {
      name: "Loader",
      id: "loader",
      Component: <Loader />,
    },
    {
      name: "SkeletonLine",
      id: "skeleton-line",
      Component: (
        <div className="flex w-[200px] flex-col gap-2">
          <SkeletonLine minWidth={50} maxWidth={100} />
          <SkeletonLine minWidth={100} />
          <SkeletonLine minWidth={50} maxWidth={150} />
        </div>
      ),
    },
    {
      name: "Surface",
      id: "surface",
      Component: (
        <Surface className="flex h-24 w-40 items-center justify-center rounded-lg bg-surface text-sm text-muted">
          <em>To put things over.</em>
        </Surface>
      ),
    },
    {
      name: "Code",
      id: "code",
      Component: (
        <CodeBlock lang="ts" code={`const a = callMyFunction("hello")`} />
      ),
    },
    {
      name: "Banner",
      id: "banner",
      Component: (
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
      ),
    },
    {
      name: "Tabs",
      id: "tabs",
      Component: (
        <Tabs
          tabs={[
            { value: "home", label: "Home" },
            { value: "about", label: "About" },
            { value: "contact", label: "Contact" },
          ]}
        />
      ),
    },
    {
      name: "Badge",
      id: "badge",
      Component: (
        <div className="flex flex-col gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="beta">Beta</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      ),
    },
    {
      name: "Toast",
      id: "toast",
      Component: (
        <Toasty>
          <ToastTriggerButton />
        </Toasty>
      ),
    },
    {
      name: "Pagination",
      id: "pagination",
      Component: (
        <Pagination page={1} perPage={10} totalCount={100} setPage={() => {}} />
      ),
    },
    {
      name: "InputArea",
      id: "input-area",
      Component: <InputArea placeholder="Enter your name" />,
    },
    {
      name: "Meter",
      id: "meter",
      Component: (
        <div className="w-full px-4">
          <Meter value={75} label="My meter" customValue="100 / 5,000" />
        </div>
      ),
    },
  ];

  return (
    <ul className="grid auto-rows-min grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {components.map((c) => {
        const route = componentRoutes[c.id] || null;
        return (
          <li
            className="relative flex aspect-square items-center justify-center bg-surface-secondary ring-1 ring-border"
            key={c.name}
          >
            {route ? (
              <a
                href={route}
                className="absolute top-4 left-4 text-base font-medium text-muted hover:text-surface"
              >
                {c.name}
              </a>
            ) : (
              <span className="absolute top-4 left-4 text-base font-medium text-muted italic">
                {c.name}
              </span>
            )}
            {c.Component ?? (
              <p className="text-base font-medium text-muted">TBD</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
