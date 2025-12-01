import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./combobox";
import { useMemo, useState } from "react";
import { Text } from "../text";
import { Button } from "../button";

const meta = {
  title: "Components/Combobox",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
  inputSide: "top" | "right";
}> = {
  args: {
    placeholder: "Select bot",
    inputSide: "top",
  },
  argTypes: {
    inputSide: {
      control: { type: "select" },
      options: ["top", "right"],
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
            isItemEqualToValue={(bot, selectedValue) =>
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
