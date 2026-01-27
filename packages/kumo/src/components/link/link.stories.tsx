import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";

const meta = {
  title: "Components/Link",
  component: Link,
  args: {
    href: "#",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Learn more",
  },
};

export const InParagraph: Story = {
  render: () => (
    <p className="text-surface">
      This is a paragraph with an <Link href="#">inline link</Link> that flows
      naturally with the surrounding text.
    </p>
  ),
};

export const External: Story = {
  render: () => (
    <Link
      href="https://cloudflare.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit Cloudflare <Link.ExternalIcon />
    </Link>
  ),
};

export const CurrentVariant: Story = {
  render: () => (
    <p className="text-error">
      This error message contains a{" "}
      <Link href="#" variant="current">
        link
      </Link>{" "}
      that inherits the red color from its parent.
    </p>
  ),
};

export const PlainVariant: Story = {
  args: {
    variant: "plain",
    children: "Plain link",
  },
};

// Helper component simulating a framework link (e.g., React Router's Link)
const CustomRouterLink = ({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  // oxlint-disable-next-line anchor-has-content
  <a data-custom-router-link {...props}>
    {children}
  </a>
);

/**
 * Use `render` prop to compose Link styles onto framework-specific link components.
 * This example shows how you might use it with a custom component like React Router's Link.
 */
export const RenderComposition: Story = {
  render: () => (
    <Link render={<CustomRouterLink href="/dashboard" />} variant="inline">
      Dashboard (via render)
    </Link>
  ),
};

/**
 * External link composed with render prop - full control over the anchor element
 * while maintaining consistent Kumo link styling.
 */
export const ExternalWithRender: Story = {
  render: () => (
    <Link
      render={
        <CustomRouterLink
          href="https://developers.cloudflare.com"
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      variant="inline"
    >
      Cloudflare Docs <Link.ExternalIcon />
    </Link>
  ),
};

/**
 * Please don't do this. But you CAN render a Link as a button if you really want to.
 * The render prop accepts any element - even a <button>. This is a terrible idea
 * for accessibility and semantics, but it demonstrates the flexibility of useRender.
 */
export const HorribleButtonExample: Story = {
  render: () => (
    <Link
      render={
        // oxlint-disable-next-line react-a11y/prefer-button-title
        <button
          type="button"
          onClick={() =>
            alert("Why would you do this?! This is a LINK component!")
          }
        />
      }
      variant="inline"
    >
      I'm a "Link" but actually a button (please don't)
    </Link>
  ),
};
