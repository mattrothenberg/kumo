import { useState } from "react";
import { Tabs } from "@cloudflare/kumo";

export function TabsDefaultDemo() {
  return (
    <Tabs
      tabs={[
        { value: "tab1", label: "Tab 1" },
        { value: "tab2", label: "Tab 2" },
        { value: "tab3", label: "Tab 3" },
      ]}
      selectedValue="tab1"
    />
  );
}

export function TabsControlledDemo() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { value: "tab1", label: "Tab 1" },
          { value: "tab2", label: "Tab 2" },
          { value: "tab3", label: "Tab 3" },
        ]}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <p className="text-sm text-secondary">
        Active tab: <code className="text-sm">{activeTab}</code>
      </p>
    </div>
  );
}

export function TabsManyDemo() {
  return (
    <Tabs
      tabs={[
        { value: "overview", label: "Overview" },
        { value: "analytics", label: "Analytics" },
        { value: "reports", label: "Reports" },
        { value: "notifications", label: "Notifications" },
        { value: "settings", label: "Settings" },
        { value: "billing", label: "Billing" },
      ]}
      selectedValue="overview"
    />
  );
}
