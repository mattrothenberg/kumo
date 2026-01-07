import { DropdownMenu, Button } from "@cloudflare/kumo";
import { PlusIcon } from "@phosphor-icons/react";

export function DropdownBasicDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button icon={PlusIcon}>Add</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Item>Worker</DropdownMenu.Item>
        <DropdownMenu.Item>Pages</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Import Project</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
