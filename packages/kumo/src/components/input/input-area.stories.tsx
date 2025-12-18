import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputArea } from "./input-area";
import { propTester } from "../../utils/prop-tester";
import { KUMO_INPUT_VARIANTS } from "./input";

const meta: Meta<typeof InputArea> = {
  title: "Components/InputArea",
  component: InputArea,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_INPUT_VARIANTS.size),
        "size",
        <InputArea placeholder="Enter text..." />,
      )}
    </>
  ),
};

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_INPUT_VARIANTS.variant),
        "variant",
        <InputArea placeholder="Enter text..." />,
      )}
    </>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <InputArea
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone else"
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <InputArea
      label="Email"
      placeholder="Invalid input"
      defaultValue="error@example.com"
      variant="error"
      error="Please enter a valid email address"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputArea label="Disabled Field" placeholder="Disabled input" disabled />
  ),
};

export const BareTextarea: Story = {
  render: () => <InputArea placeholder="Textarea without Field wrapper" />,
};
