import { Dialog, Button } from "@cloudflare/kumo";

export function DialogBasicDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>Open Dialog</Button>} />
      <Dialog>
        <Dialog.Title>Hello!</Dialog.Title>
        <Dialog.Description>
          This is a dialog. Click outside or press Escape to close.
        </Dialog.Description>
      </Dialog>
    </Dialog.Root>
  );
}
