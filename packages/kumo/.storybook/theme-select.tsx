import { Select } from "../src/components/select/select";

type Theme = "kumo" | "fedramp";

interface ThemeSelectProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

const themes: { value: Theme; label: string }[] = [
  { value: "kumo", label: "Kumo" },
  { value: "fedramp", label: "FedRAMP" },
];

export function ThemeSelect({
  theme,
  onThemeChange,
  className,
}: ThemeSelectProps) {
  return (
    <Select
      value={theme}
      onValueChange={(value) => {
        if (value) {
          onThemeChange(value as Theme);
        }
      }}
      className={className}
      aria-label="Select theme"
    >
      {themes.map((t) => (
        <Select.Option key={t.value} value={t.value}>
          {t.label}
        </Select.Option>
      ))}
    </Select>
  );
}

export type { Theme };
