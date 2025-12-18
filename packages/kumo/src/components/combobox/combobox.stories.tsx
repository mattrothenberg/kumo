import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Combobox,
  KUMO_COMBOBOX_VARIANTS,
  KUMO_COMBOBOX_DEFAULT_VARIANTS,
  type KumoComboboxInputSide,
} from "./combobox";
import { useMemo, useState } from "react";
import { Text } from "../text";
import { Button } from "../button";

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    const items = useMemo(() => {
      return [
        { value: "1111-2222-3333", label: "goldfish-571" },
        { value: "1111-2222-3334", label: "humming-birds-231" },
        { value: "1111-2222-3335", label: "blue-bottles-131" },
      ];
    }, []);

    const [value, setValue] = useState<(typeof items)[number] | null>(null);

    return (
      <Combobox items={items} value={value} onValueChange={setValue}>
        <Combobox.TriggerInput placeholder="Please select database" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: (typeof items)[number]) => {
              return (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              );
            }}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    );
  },
};

type BotType = {
  label: string;
  author: string;
  value: string;
};

export const Multiple: StoryObj<{
  placeholder: string;
  inputSide: KumoComboboxInputSide;
}> = {
  args: {
    placeholder: "Select bot",
    inputSide: KUMO_COMBOBOX_DEFAULT_VARIANTS.inputSide,
  },
  argTypes: {
    inputSide: {
      control: "select",
      options: Object.keys(KUMO_COMBOBOX_VARIANTS.inputSide),
    },
  },
  render: (args) => {
    const botList = useMemo(
      () => [
        { label: "Amazonbot", author: "Amazon", value: "amazonbot" },
        { label: "Googlebot", author: "Google", value: "googlebot" },
        { label: "BingBot", author: "Bing", value: "bingbot" },
        { label: "CCBot", author: "Common Crawl", value: "ccbot" },
        { label: "DuckDuckBot", author: "DuckDuckGo", value: "duckduckbot" },
        { label: "FacebookBot", author: "Facebook", value: "facebookbot" },
        { label: "TwitterBot", author: "Twitter", value: "twitterbot" },
        { label: "LinkedInBot", author: "LinkedIn", value: "linkedinbot" },
        { label: "InstagramBot", author: "Instagram", value: "instagrambot" },
        { label: "WhatsAppBot", author: "WhatsApp", value: "whatsappbot" },
        { label: "SlackBot", author: "Slack", value: "slackbot" },
      ],
      [],
    );

    const [value, setValue] = useState<BotType[]>([]);

    return (
      <div className="flex gap-2">
        <div>
          <Combobox
            value={value}
            onValueChange={setValue}
            items={botList}
            isItemEqualToValue={(bot: BotType, selectedValue: BotType) =>
              bot.value === selectedValue.value
            }
            multiple
          >
            <Combobox.TriggerMultipleWithInput
              className="w-[400px]"
              placeholder={args.placeholder}
              renderItem={(selected: BotType) => (
                <Combobox.Chip key={selected.value}>
                  {selected.label}
                </Combobox.Chip>
              )}
              inputSide={args.inputSide}
            />
            <Combobox.Content
              className="max-h-[200px] min-w-auto overflow-y-auto"
              side={args.inputSide === "top" ? "top" : "bottom"}
            >
              <Combobox.Empty />
              <Combobox.List>
                {(item: BotType) => (
                  <Combobox.Item key={item.value} value={item}>
                    <div className="flex gap-2">
                      <Text>{item.label}</Text>
                      <Text variant="secondary">{item.author}</Text>
                    </div>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox>
        </div>
        {/* Demonstrates that the multi-select combobox maintains consistent height with other Kumo components */}
        <Button variant="primary">Submit</Button>
      </div>
    );
  },
};

const INITIAL_BOT_LIST: BotType[] = [
  { label: "Amazonbot", author: "Amazon", value: "amazonbot" },
  { label: "Googlebot", author: "Google", value: "googlebot" },
  { label: "BingBot", author: "Bing", value: "bingbot" },
];

const INITIAL_SELECTED: BotType[] = [INITIAL_BOT_LIST[0], INITIAL_BOT_LIST[1]];

export const MultipleWithPreselectedChips: Story = {
  render: () => {
    const [value, setValue] = useState<BotType[]>(INITIAL_SELECTED);

    return (
      <Combobox
        value={value}
        onValueChange={setValue}
        items={INITIAL_BOT_LIST}
        isItemEqualToValue={(bot: BotType, selectedValue: BotType) =>
          bot.value === selectedValue.value
        }
        multiple
      >
        <Combobox.TriggerMultipleWithInput
          className="w-[400px]"
          placeholder="Select bot"
          value={value}
          renderItem={(selected: BotType) => (
            <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>
          )}
          inputSide="top"
        />
        <Combobox.Content className="max-h-[200px] min-w-auto overflow-y-auto">
          <Combobox.Empty />
          <Combobox.List>
            {(item: BotType) => (
              <Combobox.Item key={item.value} value={item}>
                <div className="flex gap-2">
                  <Text>{item.label}</Text>
                  <Text variant="secondary">{item.author}</Text>
                </div>
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const items = useMemo(() => {
      return [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
      ];
    }, []);

    const [value, setValue] = useState<(typeof items)[number] | null>(null);

    return (
      <Combobox
        items={items}
        value={value}
        onValueChange={setValue}
        label="Country"
        description="Select your country of residence"
      >
        <Combobox.TriggerInput placeholder="Select country" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: (typeof items)[number]) => {
              return (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              );
            }}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const items = useMemo(() => {
      return [
        { value: "starter", label: "Starter Plan" },
        { value: "professional", label: "Professional Plan" },
        { value: "enterprise", label: "Enterprise Plan" },
      ];
    }, []);

    const [value, setValue] = useState<(typeof items)[number] | null>(null);

    return (
      <Combobox
        items={items}
        value={value}
        onValueChange={setValue}
        label="Subscription Plan"
        description="Choose a plan that fits your needs"
        error={{ message: "Please select a plan to continue", match: true }}
      >
        <Combobox.TriggerInput placeholder="Select plan" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: (typeof items)[number]) => {
              return (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              );
            }}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    );
  },
};

export const MultipleWithLabel: Story = {
  render: () => {
    const botList = useMemo(
      () => [
        { label: "Amazonbot", author: "Amazon", value: "amazonbot" },
        { label: "Googlebot", author: "Google", value: "googlebot" },
        { label: "BingBot", author: "Bing", value: "bingbot" },
        { label: "CCBot", author: "Common Crawl", value: "ccbot" },
        { label: "DuckDuckBot", author: "DuckDuckGo", value: "duckduckbot" },
      ],
      [],
    );

    const [value, setValue] = useState<BotType[]>([]);

    return (
      <Combobox
        value={value}
        onValueChange={setValue}
        items={botList}
        isItemEqualToValue={(bot, selectedValue) =>
          bot.value === selectedValue.value
        }
        multiple
        label="Bot Management"
        description="Select which bots are allowed to crawl your site"
      >
        <Combobox.TriggerMultipleWithInput
          className="w-[400px]"
          placeholder="Select bots"
          renderItem={(selected: BotType) => (
            <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>
          )}
          inputSide="right"
        />
        <Combobox.Content className="max-h-[200px] min-w-auto overflow-y-auto">
          <Combobox.Empty />
          <Combobox.List>
            {(item: BotType) => (
              <Combobox.Item key={item.value} value={item}>
                <div className="flex gap-2">
                  <Text>{item.label}</Text>
                  <Text variant="secondary">{item.author}</Text>
                </div>
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    );
  },
};
