import { Dialog, Button, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { X } from "@phosphor-icons/react";

type DialogExampleProps = {
  withButtons?: boolean;
};

function DialogExample({ withButtons = false }: DialogExampleProps) {
  return (
    <Dialog className="p-8">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <Dialog.Title className="text-2xl font-semibold">
            Modal Title
          </Dialog.Title>
        </div>
        <Dialog.Close
          aria-label="Close"
          render={(props) => (
            <Button
              {...props}
              variant="secondary"
              shape="square"
              icon={<X />}
            />
          )}
        />
      </div>
      <Dialog.Description className="text-sm text-neutral-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Dialog.Description>
      {withButtons && (
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Dialog.Close
            render={(props) => (
              <Button variant="destructive" {...props}>
                Delete
              </Button>
            )}
          />
        </div>
      )}
    </Dialog>
  );
}

export default function DialogDoc() {
  return (
    <DocLayout
      title="Dialog"
      description="A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
      baseUIComponent="dialog"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Dialog.Root>
  <Dialog.Trigger render={(p) => <Button {...p}>Open Dialog</Button>} />
  <Dialog className="p-8">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <Dialog.Title className="text-2xl font-semibold">
          Modal Title
        </Dialog.Title>
      </div>
      <Dialog.Close
        aria-label="Close"
        render={(props) => (
          <Button
            {...props}
            variant="secondary"
            shape="square"
            icon={<X />}
          />
        )}
      />
    </div>
    <Dialog.Description className="text-sm text-neutral-700">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </Dialog.Description>
    <div className="mt-8 flex justify-end gap-2">
      <Button variant="secondary">Cancel</Button>
      <Dialog.Close
        render={(props) => (
          <Button variant="destructive" {...props}>
            Delete
          </Button>
        )}
      />
    </div>
  </Dialog>
</Dialog.Root>`}
        >
          <Dialog.Root>
            <Dialog.Trigger
              render={(p) => <Button {...p}>Open Dialog</Button>}
            />
            <DialogExample withButtons />
          </Dialog.Root>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Dialog } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Dialog } from "@cloudflare/kumo/components/dialog";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Dialog, Button } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>Open</Button>} />
      <Dialog>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>
          Dialog content goes here.
        </Dialog.Description>
        <div className="flex justify-end gap-2 mt-4">
          <Dialog.Close
            render={(p) => (
              <Button variant="secondary" {...p}>
                Cancel
              </Button>
            )}
          />
        </div>
      </Dialog>
    </Dialog.Root>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Basic Dialog</h3>
            <ComponentExample
              code={`<Dialog.Root>
  <Dialog.Trigger render={(p) => <Button {...p}>Click me</Button>} />
  <Dialog className="p-8">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <Dialog.Title className="text-2xl font-semibold">
          Modal Title
        </Dialog.Title>
      </div>
      <Dialog.Close
        aria-label="Close"
        render={(props) => (
          <Button
            {...props}
            variant="secondary"
            shape="square"
            icon={<X />}
          />
        )}
      />
    </div>
    <Dialog.Description className="text-sm text-neutral-700">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </Dialog.Description>
  </Dialog>
</Dialog.Root>`}
            >
              <Dialog.Root>
                <Dialog.Trigger
                  render={(p) => <Button {...p}>Click me</Button>}
                />
                <DialogExample />
              </Dialog.Root>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Actions</h3>
            <ComponentExample
              code={`<Dialog.Root>
  <Dialog.Trigger render={(p) => <Button {...p}>Delete</Button>} />
  <Dialog className="p-8">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <Dialog.Title className="text-2xl font-semibold">
          Modal Title
        </Dialog.Title>
      </div>
      <Dialog.Close
        aria-label="Close"
        render={(props) => (
          <Button
            {...props}
            variant="secondary"
            shape="square"
            icon={<X />}
          />
        )}
      />
    </div>
    <Dialog.Description className="text-sm text-neutral-700">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </Dialog.Description>
    <div className="mt-8 flex justify-end gap-2">
      <Button variant="secondary">Cancel</Button>
      <Dialog.Close
        render={(props) => (
          <Button variant="destructive" {...props}>
            Delete
          </Button>
        )}
      />
    </div>
  </Dialog>
</Dialog.Root>`}
            >
              <Dialog.Root>
                <Dialog.Trigger
                  render={(p) => <Button {...p}>Delete</Button>}
                />
                <DialogExample withButtons />
              </Dialog.Root>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
