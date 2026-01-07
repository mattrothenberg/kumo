import { Badge } from "@cloudflare/kumo";

export function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="beta">Beta</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}
