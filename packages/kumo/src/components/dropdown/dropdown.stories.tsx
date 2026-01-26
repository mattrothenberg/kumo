import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu, KUMO_DROPDOWN_VARIANTS } from "./dropdown";
import { Button } from "../button/button";
import {
  TrashIcon,
  PencilIcon,
  CopyIcon,
  DownloadIcon,
  ShareIcon,
  WarningIcon,
  GearIcon,
  UserIcon,
  SignOutIcon,
  MoonIcon,
  CreditCardIcon,
  CheckIcon,
} from "@phosphor-icons/react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Dropdown",
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Open Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Item 1</DropdownMenu.Item>
        <DropdownMenu.Item>Item 2</DropdownMenu.Item>
        <DropdownMenu.Item>Item 3</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const ItemVariants: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger render={<Button>Open Menu</Button>} />
      <DropdownMenu.Content>
        {Object.keys(KUMO_DROPDOWN_VARIANTS.variant).map((variant) => (
          <DropdownMenu.Item
            key={variant}
            variant={variant as keyof typeof KUMO_DROPDOWN_VARIANTS.variant}
          >
            {variant} item
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Open: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Menu (Open)</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item icon={DownloadIcon}>Download</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const DangerVariant: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button variant="destructive">Danger Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Destructive Actions</DropdownMenu.Label>
          <DropdownMenu.Item icon={WarningIcon} variant="danger">
            Remove from project
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={TrashIcon} variant="danger">
            Delete permanently
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon}>Copy</DropdownMenu.Item>
        <DropdownMenu.Item icon={ShareIcon}>Share</DropdownMenu.Item>
        <DropdownMenu.Item icon={DownloadIcon}>Download</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithLabelsAndGroups: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>User Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Account</DropdownMenu.Label>
          <DropdownMenu.Item icon={UserIcon}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item icon={GearIcon}>Settings</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={SignOutIcon} variant="danger">
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>View Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Display</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem checked>
            Show sidebar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={false}>
            Show line numbers
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked>
            Word wrap
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Edit</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={CopyIcon}>
          Copy
          <DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={PencilIcon}>
          Edit
          <DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon} disabled>
          Copy (disabled)
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={ShareIcon}>Share</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger" disabled>
          Delete (disabled)
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const MixedVariants: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Resource Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item icon={PencilIcon}>Edit resource</DropdownMenu.Item>
          <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item icon={DownloadIcon}>Export</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Label>Danger Zone</DropdownMenu.Label>
          <DropdownMenu.Item icon={WarningIcon} variant="danger">
            Disable resource
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={TrashIcon} variant="danger">
            Delete resource
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

/**
 * Nested menu example matching the Stratus user dropdown pattern.
 * Demonstrates submenus for Language and Timezone selection.
 */
export const NestedMenu: Story = {
  render: () => {
    const languages = [
      { code: "de", label: "Deutsch" },
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
      { code: "fr", label: "Français" },
      { code: "it", label: "Italiano" },
      { code: "pt", label: "Português" },
      { code: "ko", label: "한국어" },
      { code: "ja", label: "日本語" },
      { code: "zh-CN", label: "简体中文" },
      { code: "zh-TW", label: "繁體中文" },
    ];

    const timezones = [
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
      { value: "Europe/Paris", label: "Central European Time (CET)" },
      { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    ];

    const selectedLanguage = "en";
    const selectedTimezone = "America/Los_Angeles";

    return (
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>
          <Button icon={UserIcon}>Account</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={UserIcon}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item icon={CreditCardIcon}>Billing</DropdownMenu.Item>
          <DropdownMenu.Item icon={MoonIcon}>Dark mode</DropdownMenu.Item>

          {/* Language submenu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent side="left">
              {languages.map((lang) => (
                <DropdownMenu.Item
                  key={lang.code}
                  selected={lang.code === selectedLanguage}
                >
                  {lang.label}
                  {lang.code === selectedLanguage && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          {/* Timezone submenu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Set Timezone</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent side="left">
              {timezones.map((tz) => (
                <DropdownMenu.Item
                  key={tz.value}
                  selected={tz.value === selectedTimezone}
                >
                  {tz.label}
                  {tz.value === selectedTimezone && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />
          <DropdownMenu.Item icon={SignOutIcon} variant="danger">
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

/**
 * Simple nested menu example showing the basic submenu pattern.
 */
export const SimpleNestedMenu: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon}>Copy</DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger icon={ShareIcon}>
            Share
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Copy link</DropdownMenu.Item>
            <DropdownMenu.Item>Email</DropdownMenu.Item>
            <DropdownMenu.Item>Slack</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

/**
 * Radio items for single-selection scenarios.
 * Use RadioGroup and RadioItem when only one option can be selected at a time.
 */
export const WithRadioItems: Story = {
  render: function RadioItemsStory() {
    const [sortOrder, setSortOrder] = useState("date-desc");

    return (
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>
          <Button>Sort By</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Label>Sort Order</DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              value={sortOrder}
              onValueChange={setSortOrder}
            >
              <DropdownMenu.RadioItem value="date-desc">
                Date (Newest first)
                <DropdownMenu.RadioItemIndicator />
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="date-asc">
                Date (Oldest first)
                <DropdownMenu.RadioItemIndicator />
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="name-asc">
                Name (A-Z)
                <DropdownMenu.RadioItemIndicator />
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="name-desc">
                Name (Z-A)
                <DropdownMenu.RadioItemIndicator />
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

const languages = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
];

const timezones = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
];

/**
 * Nested menu with RadioGroup for proper single-selection semantics.
 * This is the recommended pattern for language/timezone selectors.
 */
export const NestedMenuWithRadioItems: Story = {
  render: function NestedMenuWithRadioItemsStory() {
    const [language, setLanguage] = useState("en");
    const [timezone, setTimezone] = useState("America/Los_Angeles");

    return (
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>
          <Button icon={UserIcon}>Account</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={UserIcon}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item icon={CreditCardIcon}>Billing</DropdownMenu.Item>
          <DropdownMenu.Item icon={MoonIcon}>Dark mode</DropdownMenu.Item>

          {/* Language submenu with RadioGroup */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent side="left">
              <DropdownMenu.Group>
                <DropdownMenu.RadioGroup
                  value={language}
                  onValueChange={setLanguage}
                >
                  {languages.map((lang) => (
                    <DropdownMenu.RadioItem key={lang.code} value={lang.code}>
                      {lang.label}
                      <DropdownMenu.RadioItemIndicator />
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Group>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          {/* Timezone submenu with RadioGroup */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Set Timezone</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent side="left">
              <DropdownMenu.Group>
                <DropdownMenu.RadioGroup
                  value={timezone}
                  onValueChange={setTimezone}
                >
                  {timezones.map((tz) => (
                    <DropdownMenu.RadioItem key={tz.value} value={tz.value}>
                      {tz.label}
                      <DropdownMenu.RadioItemIndicator />
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Group>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />
          <DropdownMenu.Item icon={SignOutIcon} variant="danger">
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};
