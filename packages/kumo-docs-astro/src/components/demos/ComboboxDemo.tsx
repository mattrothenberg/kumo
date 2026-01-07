import { useState } from "react";
import { Combobox, Text, Button } from "@cloudflare/kumo";

type DatabaseItem = {
  value: string;
  label: string;
};

const databases: DatabaseItem[] = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
  { value: "sqlite", label: "SQLite" },
];

export function ComboboxDemo() {
  const [value, setValue] = useState<DatabaseItem | null>(null);

  return (
    <div className="w-64">
      <Combobox items={databases} value={value} onValueChange={setValue}>
        <Combobox.TriggerInput placeholder="Select database" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: DatabaseItem) => (
              <Combobox.Item key={item.value} value={item}>
                {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

type BotItem = {
  value: string;
  label: string;
  author: string;
};

const bots: BotItem[] = [
  { value: "googlebot", label: "Googlebot", author: "Google" },
  { value: "bingbot", label: "Bingbot", author: "Microsoft" },
  { value: "yandexbot", label: "YandexBot", author: "Yandex" },
  { value: "duckduckbot", label: "DuckDuckBot", author: "DuckDuckGo" },
  { value: "baiduspider", label: "Baiduspider", author: "Baidu" },
];

export function ComboboxMultipleDemo() {
  const [value, setValue] = useState<BotItem[]>([]);

  return (
    <div className="flex gap-2">
      <Combobox
        value={value}
        onValueChange={setValue}
        items={bots}
        isItemEqualToValue={(bot: BotItem, selected: BotItem) =>
          bot.value === selected.value
        }
        multiple
      >
        <Combobox.TriggerMultipleWithInput
          className="w-[400px]"
          placeholder="Select bots"
          renderItem={(selected: BotItem) => (
            <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>
          )}
          inputSide="right"
        />
        <Combobox.Content className="max-h-[200px] min-w-auto overflow-y-auto">
          <Combobox.Empty />
          <Combobox.List>
            {(item: BotItem) => (
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
      <Button variant="primary">Submit</Button>
    </div>
  );
}

export function ComboboxWithFieldDemo() {
  const [value, setValue] = useState<DatabaseItem | null>(null);

  return (
    <div className="w-80">
      <Combobox
        items={databases}
        value={value}
        onValueChange={setValue}
        label="Database"
        description="Select your preferred database"
      >
        <Combobox.TriggerInput placeholder="Select database" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: DatabaseItem) => (
              <Combobox.Item key={item.value} value={item}>
                {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

export function ComboboxErrorDemo() {
  const [value, setValue] = useState<DatabaseItem | null>(null);

  return (
    <div className="w-80">
      <Combobox
        items={databases}
        value={value}
        onValueChange={setValue}
        label="Database"
        error={{ message: "Please select a database", match: true }}
      >
        <Combobox.TriggerInput placeholder="Select database" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: DatabaseItem) => (
              <Combobox.Item key={item.value} value={item}>
                {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
