import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./combobox";
import { useMemo, useState } from "react";

const meta = {
  title: "Components/Combobox",
  component: () => <Example />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

function Example() {
  const items = useMemo(() => {
    return [
      { value: "1111-2222-3333", label: "goldfish-571" },
      { value: "1111-2222-3334", label: "humming-birds-231" },
      { value: "1111-2222-3335", label: "blue-bottles-131" },
    ];
  }, []);

  const [value, setValue] = useState<(typeof items)[number] | null>(null);

  return (
    <div>
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
    </div>
  );
}
