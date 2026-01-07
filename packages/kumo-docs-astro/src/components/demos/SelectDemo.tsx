import { Select } from "@cloudflare/kumo";

export function SelectBasicDemo() {
  return (
    <Select
      className="w-[200px]"
      renderValue={(v) => {
        const labels: Record<string, string> = {
          all: "All deployed versions",
          active: "Active versions",
          specific: "Specific versions",
        };
        if (!v) return "Select a version...";
        return labels[v as string];
      }}
    >
      <Select.Option value="all">All deployed versions</Select.Option>
      <Select.Option value="active">Active versions</Select.Option>
      <Select.Option value="specific">Specific versions</Select.Option>
    </Select>
  );
}
