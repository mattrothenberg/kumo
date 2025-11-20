import { useEffect, useState, type PropsWithChildren } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button } from "../../components/button";
import { SkeletonLine } from "../../components/loader/skeleton-line";
import { useLinkComponent } from "../../utils/link-provider";

interface BreadcrumbsItemProps {
  href: string;
  icon?: React.ReactNode;
}

const Link = ({
  href,
  icon,
  children,
}: PropsWithChildren<BreadcrumbsItemProps>) => {
  const LinkComponent = useLinkComponent();

  return (
    <LinkComponent
      to={href}
      className="flex items-center gap-1 min-w-0 text-muted no-underline"
    >
      {!!icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children}
    </LinkComponent>
  );
};

interface BreadcrumbsCurrentProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

function Current({
  children,
  icon,
  loading,
}: PropsWithChildren<BreadcrumbsCurrentProps>) {
  if (loading) {
    return (
      <div className="w-[125px] flex items-center gap-1 min-w-0">
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}
        <SkeletonLine />
      </div>
    );
  }

  return (
    <div
      className="font-medium truncate flex items-center gap-1"
      aria-current="page"
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children}
    </div>
  );
}

function Separator() {
  return (
    <span
      className="text-neutral-400 dark:text-neutral-600 flex items-center"
      aria-hidden="true"
    >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M10.75 8.75L14.25 12L10.75 15.25"
        />
      </svg>
    </span>
  );
}

function Clipboard({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopyDeeplink = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy deeplink:", err);
    }
  };

  return (
    <Button
      variant="ghost"
      shape="square"
      size="sm"
      className="group-hover:opacity-100 opacity-0 transition-[opacity]"
      onClick={handleCopyDeeplink}
      title="Click to copy"
      aria-label="Copy"
    >
      {isCopied ? (
        <CheckIcon weight="bold" className="text-green-600" />
      ) : (
        <CopyIcon weight="regular" />
      )}
    </Button>
  );
}

export function Breadcrumb({ children }: PropsWithChildren) {
  return (
    <nav
      className="text-base hidden sm:flex grow items-center gap-1 min-w-0 mr-4 h-12 group"
      aria-label="breadcrumb"
    >
      {children}
    </nav>
  );
}

Breadcrumb.Link = Link;
Breadcrumb.Current = Current;
Breadcrumb.Separator = Separator;
Breadcrumb.Clipboard = Clipboard;
