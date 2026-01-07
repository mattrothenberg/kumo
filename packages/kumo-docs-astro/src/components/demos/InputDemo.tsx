import { Input } from "@cloudflare/kumo";

export function InputBasicDemo() {
  return <Input placeholder="Type something..." />;
}

export function InputWithLabelDemo() {
  return (
    <Input
      label="Email"
      placeholder="name@example.com"
      description="We'll never share your email."
    />
  );
}

export function InputErrorDemo() {
  return (
    <Input
      label="Email"
      placeholder="name@example.com"
      type="email"
      variant="error"
      error={{
        message: "Please enter a valid email.",
        match: "typeMismatch",
      }}
      description="The email to send notifications to."
    />
  );
}

export function InputDisabledDemo() {
  return <Input placeholder="Disabled input" disabled />;
}
