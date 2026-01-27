import { Link } from "@cloudflare/kumo";

export function LinkBasicDemo() {
  return (
    <div className="text-base grid md:grid-cols-3 gap-y-4 gap-x-6">
      <Link href="#">Default inline link</Link>
      <Link href="#" variant="current">
        Current color link
      </Link>
      <Link href="#" variant="plain">
        Plain inline link
      </Link>
    </div>
  );
}

export function LinkInParagraphDemo() {
  return (
    <p className="text-surface text-base max-w-md mx-auto leading-relaxed">
      This is a paragraph with an <Link href="#">inline link</Link> that flows
      naturally with the surrounding text. Links maintain proper underline
      offset for readability.
    </p>
  );
}

export function LinkExternalDemo() {
  return (
    <Link
      href="https://cloudflare.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-base"
    >
      Visit Cloudflare <Link.ExternalIcon />
    </Link>
  );
}

export function LinkCurrentVariantDemo() {
  return (
    <p className="text-error text-base">
      This error message contains a{" "}
      <Link href="#" variant="current">
        link
      </Link>{" "}
      that inherits the red color from its parent.
    </p>
  );
}

// Helper component simulating a framework link (e.g., React Router's Link)
const CustomRouterLink = ({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a data-custom-router-link {...props}>
    {children}
  </a>
);

export function LinkRenderDemo() {
  return (
    <div className="flex flex-col md:flex-row gap-x-6 gap-y-4 text-base">
      <Link render={<CustomRouterLink href="/dashboard" />} variant="inline">
        Dashboard (via render)
      </Link>
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
    </div>
  );
}


