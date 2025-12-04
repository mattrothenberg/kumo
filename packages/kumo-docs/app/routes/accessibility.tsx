export default function Accessibility() {
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

      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-surface-secondary pr-12 dark:border-neutral-800">
        <div className="mx-auto border-r border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-surface">
              Accessibility
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Learn how to make the most of Kumo's accessibility features and
              guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex grow flex-col pr-12">
        <div className="mx-auto w-full grow border-r border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="space-y-12 text-neutral-700 dark:text-neutral-300">
              {/* Introduction */}
              <section className="space-y-4 leading-relaxed">
                <p className="text-[17px]">
                  Accessibility is a top priority for Kumo. Built on{" "}
                  <a
                    href="https://base-ui.com/react/overview/accessibility"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    Base UI
                  </a>
                  , Kumo components handle many complex accessibility details
                  including ARIA attributes, role attributes, pointer
                  interactions, keyboard navigation, and focus management. The
                  goal is to provide an accessible user experience out of the
                  box, with intuitive APIs for configuration.
                </p>
                <p className="text-[17px]">
                  This page highlights some of the key accessibility features of
                  Kumo, as well as some ways you will need to augment the
                  library, in order to ensure that your application is
                  accessible to everyone.
                </p>
              </section>

              {/* Keyboard Navigation */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-surface">
                  Keyboard Navigation
                </h2>
                <p className="text-[17px] leading-relaxed">
                  Kumo components adhere to the{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    WAI-ARIA Authoring Practices
                  </a>{" "}
                  to provide basic keyboard accessibility out of the box. This
                  is critical for users who have difficulty using a pointer
                  device, but it's also important for users who prefer
                  navigating with a keyboard or other input mode.
                </p>
                <p className="text-[17px] leading-relaxed">
                  Many components provide support for arrow keys, alphanumeric
                  keys,{" "}
                  <kbd className="rounded border border-neutral-200 bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800">
                    Home
                  </kbd>
                  ,{" "}
                  <kbd className="rounded border border-neutral-200 bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800">
                    End
                  </kbd>
                  ,{" "}
                  <kbd className="rounded border border-neutral-200 bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800">
                    Enter
                  </kbd>
                  , and{" "}
                  <kbd className="rounded border border-neutral-200 bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800">
                    Esc
                  </kbd>
                  .
                </p>
              </section>

              {/* Focus Management */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-surface">
                  Focus Management
                </h2>
                <p className="text-[17px] leading-relaxed">
                  Kumo components manage focus automatically following a user
                  interaction. Additionally, some components provide props like{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    initialFocus
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    finalFocus
                  </code>
                  , to configure focus management.
                </p>
                <p className="text-[17px] leading-relaxed">
                  While Kumo components manage focus, it's the developer's
                  responsibility to visually indicate focus. This is typically
                  handled by styling the{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    :focus
                  </code>{" "}
                  or{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    :focus-visible
                  </code>{" "}
                  CSS pseudo-classes.{" "}
                  <a
                    href="https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    WCAG provides guidelines on focus appearance
                  </a>
                  .
                </p>
              </section>

              {/* Color Contrast */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-surface">
                  Color Contrast
                </h2>
                <p className="text-[17px] leading-relaxed">
                  When styling elements, it's important to meet the minimum
                  requirements for color contrast between each foreground
                  element and its corresponding background element. Unless your
                  application has strict requirements around compliance with
                  current standards, consider adhering to{" "}
                  <a
                    href="https://www.myndex.com/APCA/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    APCA
                  </a>
                  , which is slated to become the new standard in WCAG 3.
                </p>
              </section>

              {/* Accessible Labels */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-surface">
                  Accessible Labels
                </h2>
                <p className="text-[17px] leading-relaxed">
                  Kumo provides components like{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    Field
                  </code>
                  ,{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    Input
                  </code>
                  , and{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    Checkbox
                  </code>{" "}
                  to automatically associate form controls. Additionally, you
                  can use the native HTML{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    &lt;label&gt;
                  </code>{" "}
                  element to provide context to corresponding inputs.
                </p>
                <p className="text-[17px] leading-relaxed">
                  Most applications will present custom controls that require
                  accessible names provided by markup features such as{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    alt
                  </code>
                  ,{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    aria-label
                  </code>{" "}
                  or{" "}
                  <code className="rounded bg-neutral-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                    aria-labelledby
                  </code>
                  .{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    WAI-ARIA provides guidelines on providing accessible names
                    to custom controls
                  </a>
                  .
                </p>
              </section>

              {/* Testing */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-surface">
                  Testing
                </h2>
                <p className="text-[17px] leading-relaxed">
                  Kumo components, built on Base UI, are tested on a broad
                  spectrum of browsers, devices, platforms, screen readers, and
                  environments to ensure accessibility across different user
                  contexts.
                </p>
              </section>

              {/* Learn More */}
              <section className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
                <p className="mb-4 text-[17px] leading-relaxed">
                  For more detailed information about the accessibility features
                  provided by Base UI, visit the{" "}
                  <a
                    href="https://base-ui.com/react/overview/accessibility"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    official accessibility documentation
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
