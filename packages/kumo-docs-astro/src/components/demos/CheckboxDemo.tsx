import { useState } from "react";
import { Checkbox } from "@cloudflare/kumo";

export function CheckboxBasicDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Accept terms"
      checked={checked}
      onValueChange={setChecked}
    />
  );
}

export function CheckboxDisabledDemo() {
  return <Checkbox label="Disabled option" checked={false} disabled />;
}
