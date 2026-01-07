import { Breadcrumbs } from "@cloudflare/kumo";
import { House, Folder, File } from "@phosphor-icons/react";

export function BreadcrumbsDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsSizesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm text-muted">Small</p>
        <Breadcrumbs size="sm">
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Current</Breadcrumbs.Current>
        </Breadcrumbs>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">Base</p>
        <Breadcrumbs size="base">
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Current</Breadcrumbs.Current>
        </Breadcrumbs>
      </div>
    </div>
  );
}

export function BreadcrumbsWithIconsDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="/" icon={<House size={16} />}>
        Home
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/documents" icon={<Folder size={16} />}>
        Documents
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current icon={<File size={16} />}>
        File.txt
      </Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsLongDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects/web">Web Applications</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects/web/dashboard">
        Dashboard
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsWithClipboardDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
      <Breadcrumbs.Clipboard text="https://example.com/projects/current-project" />
    </Breadcrumbs>
  );
}
