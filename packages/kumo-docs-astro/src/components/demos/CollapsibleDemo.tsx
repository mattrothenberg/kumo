import { Collapsible } from "@cloudflare/kumo";
import { useState } from "react";

export function CollapsibleBasicDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      label="What is Kumo?"
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      Kumo is Cloudflare's component library built on Base UI. It provides
      accessible, themeable React components for building modern web
      applications.
    </Collapsible>
  );
}
