import { useState } from "react";
import { Switch } from "@cloudflare/kumo";

export function SwitchBasicDemo() {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onClick={() => setChecked(!checked)} />;
}

export function SwitchDisabledDemo() {
  return <Switch checked={false} disabled />;
}
