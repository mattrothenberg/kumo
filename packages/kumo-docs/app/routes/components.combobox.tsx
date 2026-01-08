import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { useState } from "react";
import { Text, Combobox } from "@cloudflare/kumo";

const fruits = [
  "Apple",
  "Orange",
  "Banana",
  "Grape",
  "Strawberry",
  "Blueberry",
  "Cherry",
  "Watermelon",
  "Peach",
  "Pear",
];

const languages = [
  { value: "en", label: "English", emoji: "🇬🇧" },
  { value: "fr", label: "French", emoji: "🇫🇷" },
  { value: "de", label: "German", emoji: "🇩🇪" },
  { value: "es", label: "Spanish", emoji: "🇪🇸" },
  { value: "it", label: "Italian", emoji: "🇮🇹" },
  { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
];

export default function ComboboxDoc() {
  return (
    <DocLayout
      title="Combobox"
      description="A searchable select component that allows users to filter and select from a list of options."
      sourceFile="components/combobox"
      storybookPath="story/components-combobox"
      baseUIComponent="combobox"
    >
      <ExampleInputTrigger />
      <ExampleInputInsidePopup />
      <ExampleGroupLabel />
      <ExampleMultiple />
      <ExampleMultiple2 />
    </DocLayout>
  );
}

function ExampleInputTrigger() {
  const [value, setValue] = useState<string | null>("Apple");

  return (
    <ComponentSection>
      <ComponentExample
        code={`
function App() {
  const [value, setValue] = useState<string | null>("Apple");

  return (
    <Combobox value={value} onValueChange={(v) => setValue(v as any)} items={fruits}>  
      <Combobox.TriggerInput placeholder="Please select" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          {(item: string) => (
            <Combobox.Item key={item.value} value={item.value}>
              {item.emoji} {item.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>  
  );
}


const fruits = [
  "Apple",
  "Orange",
  "Banana",
  "Grape",
  "Strawberry",
  "Blueberry",
  "Cherry",
  "Watermelon",
  "Peach",
  "Pear",
];
`}
      >
        <Combobox
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={fruits}
        >
          <Combobox.TriggerInput placeholder="Please select" />
          <Combobox.Content>
            <Combobox.Empty />
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
                  {item}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      </ComponentExample>
    </ComponentSection>
  );
}

function ExampleInputInsidePopup() {
  const [value, setValue] = useState<Language>(languages[0]);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Searchable Item (Inside)</Text>
        <Text variant="secondary">
          A searchable select component inside popup that allows users to filter
          and select
        </Text>
      </p>
      <ComponentExample
        code={`function App() {
  const [value, setValue] = useState<Language | null>(languages[0]);

  return (
    <Combobox
      value={value}
      onValueChange={(v) => setValue(v)}
      items={languages}
    >
      <Combobox.TriggerValue className="w-[200px]" />
      <Combobox.Content>
        <Combobox.Input /> // ✅ Add this to make item searchable
        <Combobox.Empty /> 
        <Combobox.List>
          {(item: Language) => (
            <Combobox.Item key={item.value} value={item.value}>
              {item.emoji} {item.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}

interface Language {
  value: string;
  label: string;
  emoji: string;
}

const languages: Language[] = [
  { value: "en", label: "English", emoji: "🇬🇧" },
  { value: "fr", label: "French", emoji: "🇫🇷" },
  { value: "de", label: "German", emoji: "🇩🇪" },
  { value: "es", label: "Spanish", emoji: "🇪🇸" },
  { value: "it", label: "Italian", emoji: "🇮🇹" },
  { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
];
`}
      >
        <Combobox
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={languages}
        >
          <Combobox.TriggerValue className="w-[200px]" />
          <Combobox.Content>
            <Combobox.Input placeholder="Please select" />
            <Combobox.Empty />
            <Combobox.List>
              {(item: Language) => (
                <Combobox.Item key={item.value} value={item.value}>
                  {item.emoji} {item.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      </ComponentExample>
    </ComponentSection>
  );
}

interface Language {
  value: string;
  label: string;
  emoji: string;
}

interface ServerLocation {
  label: string;
  value: string;
}

interface ServerLocationGroup {
  value: string;
  items: ServerLocation[];
}

const server = [
  {
    value: "Asia",
    items: [
      { label: "Japan", value: "japan" },
      { label: "China", value: "china" },
      { label: "Singapore", value: "singapore" },
    ],
  },
  {
    value: "Europe",
    items: [
      { label: "Germany", value: "germany" },
      { label: "France", value: "france" },
      { label: "Italy", value: "italy" },
    ],
  },
];

function ExampleGroupLabel() {
  const [value, setValue] = useState<ServerLocation | null>(null);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Grouped</Text>
        <Text variant="secondary">
          Group items into categories using the Group and GroupLabel components.
        </Text>
      </p>

      <ComponentExample
        code={`
function App() {
  const [value, setValue] = useState<string | null>("singapore");

  return (
    <Combobox value={value} onValueChange={(v) => setValue(v as any)} items={server}>
      <Combobox.TriggerValue className="w-[200px]" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          {(group: ServerLocationGroup) => (
            <Combobox.Group key={group.value} items={group.items}>
              <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
              <Combobox.Collection>
                {(item: ServerLocation) => {
                  return (
                    <Combobox.Item key={item.value} value={item.value}>
                      {item.label}
                    </Combobox.Item>
                  );
                }}
              </Combobox.Collection>
            </Combobox.Group>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>  
  )
}

const server = [
  {
    value: "Asia",
    items: [
      { label: "Japan", value: "japan" },
      { label: "China", value: "china" },
      { label: "Singapore", value: "singapore" },
    ],
  },
  {
    value: "Europe",
    items: [
      { label: "Germany", value: "germany" },
      { label: "France", value: "france" },
      { label: "Italy", value: "italy" },
    ],
  },
];

interface ServerLocation {
  label: string;
  value: string;
}

interface ServerLocationGroup {
  value: string;
  items: ServerLocation[];
}
`}
      >
        <Combobox
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={server}
        >
          <Combobox.TriggerInput
            className="w-[200px]"
            placeholder="Select server"
          />
          <Combobox.Content>
            <Combobox.Empty />
            <Combobox.List>
              {(group: ServerLocationGroup) => (
                <Combobox.Group key={group.value} items={group.items}>
                  <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
                  <Combobox.Collection>
                    {(item: ServerLocation) => {
                      return (
                        <Combobox.Item key={item.value} value={item}>
                          {item.label}
                        </Combobox.Item>
                      );
                    }}
                  </Combobox.Collection>
                </Combobox.Group>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      </ComponentExample>
    </ComponentSection>
  );
}

function ExampleMultiple() {
  const [value, setValue] = useState<string[]>(["Apple", "Orange"]);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Multiple</Text>
        <Text variant="secondary">
          Allow users to select multiple options from the list.
        </Text>
      </p>

      <ComponentExample
        code={`
function App() {
  const [value, setValue] = useState<string[]>(["Apple", "Orange"]);
  
  return (
    <Combobox multiple value={value} onValueChange={(v) => setValue(v as any)} items={fruits}>
      <Combobox.TriggerMultipleInput 
        placeholder="Select fruit"
        renderItem={(selected: string) => (
          <Combobox.Chip key={selected}>{selected}</Combobox.Chip>
        )}
      />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          {(item: string) => (
            <Combobox.Item key={item} value={item}>
              {item}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>  
  )
}

const fruits = [
  "Apple",
  "Orange",
  "Banana",
  "Grape",
  "Strawberry",
  "Blueberry",
  "Cherry",
  "Watermelon",
  "Peach",
  "Pear",
];
`}
      >
        <Combobox
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={fruits}
          multiple
        >
          <Combobox.TriggerMultipleWithInput
            placeholder="Select fruit"
            renderItem={(selected: string) => (
              <Combobox.Chip key={selected}>{selected}</Combobox.Chip>
            )}
          />
          <Combobox.Content>
            <Combobox.Empty />
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
                  {item}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      </ComponentExample>
    </ComponentSection>
  );
}

type BotType = {
  label: string;
  author: string;
  value: string;
};

const botList: BotType[] = [
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
];

function ExampleMultiple2() {
  const [value, setValue] = useState<BotType[]>([]);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Multiple Example 2</Text>
        <Text variant="secondary">
          Allow users to select multiple options from the list.
        </Text>
      </p>

      <ComponentExample code={``}>
        <Combobox
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={botList}
          isItemEqualToValue={(bot, selectedValue) =>
            bot.value === selectedValue.value
          }
          multiple
        >
          <Combobox.TriggerMultipleWithInput
            className="w-full"
            placeholder="Select bot"
            renderItem={(selected: BotType) => (
              <Combobox.Chip key={selected.value}>
                {selected.label}
              </Combobox.Chip>
            )}
            inputSide="top"
          />
          <Combobox.Content className="min-w-auto">
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
      </ComponentExample>
    </ComponentSection>
  );
}
