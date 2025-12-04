import { PencilRulerIcon } from "@phosphor-icons/react";
import { Empty, Button } from "@cloudflare/kumo";

export default function Figma() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-surface-secondary pr-12 dark:border-neutral-800">
        <div className="mx-auto flex h-12 items-center border-r border-neutral-200 px-4 dark:border-neutral-800">
          <p className="ml-auto font-mono text-base text-neutral-500">
            @cloudflare/kumo
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex grow flex-col pr-12">
        <div className="mx-auto flex w-full grow items-center justify-center border-r border-neutral-200 dark:border-neutral-800">
          <div className="p-8">
            <Empty
              icon={<PencilRulerIcon size={48} className="text-neutral-400" />}
              title="Figma Resources Coming Soon"
              description="We're preparing a comprehensive Figma design system that mirrors all Kumo components. Stay tuned for design files, component libraries, and design tokens."
              contents={
                <Button variant="outline" disabled>
                  View Figma Library
                </Button>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
