/**
 * Live Preview Component
 *
 * Safely renders user-generated JSX code with comprehensive error handling
 */

import React, { useEffect, useState, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { compileAndExecuteJSX, wrapInComponent } from "../../lib/jsx-runtime";
import {
  cn,
  Button,
  Input,
  InputArea,
  Surface,
  Loader as LoaderComponent,
  SkeletonLine,
  Badge,
  Select,
  Checkbox,
  Switch,
  Field,
  Dialog,
  Tooltip,
  TooltipProvider,
  DropdownMenu,
  MenuBar,
  Banner,
  BannerVariant,
  Expandable,
  ClipboardText,
  CodeBlock,
  Combobox,
  LayerCard,
} from "@cloudflare/kumo";

// Import common icons
import {
  PlusIcon,
  XIcon,
  CheckIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  WarningIcon,
  InfoIcon,
  GearIcon,
  UserIcon,
  WarningOctagonIcon,
  CalendarIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  ChatIcon,
  HouseIcon,
  DownloadIcon,
  UploadIcon,
} from "@phosphor-icons/react";

interface LivePreviewProps {
  code: string;
  className?: string;
}

/**
 * Component scope - all components and utilities available in preview
 */
const COMPONENT_SCOPE = {
  // React
  React,

  // Kumo Components
  Button,
  Input,
  InputArea,
  Select,
  Checkbox,
  Switch,
  Dialog,
  DialogRoot: Dialog.Root,
  DialogTrigger: Dialog.Trigger,
  DialogTitle: Dialog.Title,
  DialogDescription: Dialog.Description,
  DialogClose: Dialog.Close,
  Tooltip,
  TooltipProvider,
  DropdownMenu,
  Surface,
  Field,
  Loader: LoaderComponent,
  SkeletonLine,
  Badge,
  Banner,
  BannerVariant,
  Expandable,
  ClipboardText,
  CodeBlock,
  LayerCard,
  Combobox,
  MenuBar,

  // Icons
  PlusIcon,
  XIcon,
  CheckIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  WarningIcon,
  InfoIcon,
  GearIcon,
  UserIcon,
  WarningOctagonIcon,
  CalendarIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  ChatIcon,
  HouseIcon,
  DownloadIcon,
  UploadIcon,

  // Utilities
  cn,
};

/**
 * Error fallback component
 */
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-950/20">
      <WarningOctagonIcon
        className="mb-4 h-12 w-12 text-red-500"
        weight="fill"
      />
      <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
        Preview Error
      </h3>
      <p className="mb-4 max-w-md text-center text-sm text-red-700 dark:text-red-300">
        {error.message}
      </p>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
}

/**
 * Compilation error display
 */
function CompilationError({
  error,
}: {
  error: { type: string; message: string; details?: string };
}) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-start justify-center rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950/20">
      <div className="mb-4 flex items-start gap-3">
        <WarningIcon
          className="mt-0.5 h-6 w-6 shrink-0 text-yellow-600 dark:text-yellow-400"
          weight="fill"
        />
        <div>
          <h3 className="mb-1 text-base font-semibold text-yellow-900 dark:text-yellow-100">
            {error.type === "validation"
              ? "Validation Error"
              : error.type === "compilation"
                ? "Compilation Error"
                : "Runtime Error"}
          </h3>
          <p className="mb-2 text-sm text-yellow-800 dark:text-yellow-200">
            {error.message}
          </p>
          {error.details && (
            <pre className="overflow-x-auto rounded bg-yellow-100 p-3 font-mono text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
              {error.details}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state
 */
function EmptyState() {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-neutral-400">
      <CodeBlock lang="tsx" code="<Button>Hello World</Button>" />
      <p className="mt-4 text-sm">
        Generate or write code to see a live preview
      </p>
    </div>
  );
}

/**
 * Main LivePreview component
 */
export function LivePreview({ code, className }: LivePreviewProps) {
  const [key, setKey] = useState(0);

  // Compile the code
  const compilationResult = useMemo(() => {
    if (!code || code.trim().length === 0) {
      return null;
    }

    // Wrap code in component if needed
    const wrappedCode = wrapInComponent(code);

    // Compile and execute
    return compileAndExecuteJSX(wrappedCode, COMPONENT_SCOPE);
  }, [code]);

  // Reset error boundary when code changes
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [code]);

  // Empty state
  if (!code || code.trim().length === 0) {
    return (
      <div className={cn("h-full w-full", className)}>
        <EmptyState />
      </div>
    );
  }

  // Compilation error
  if (compilationResult && !compilationResult.success) {
    return (
      <div className={cn("h-full w-full", className)}>
        <CompilationError error={compilationResult.error!} />
      </div>
    );
  }

  // Success - render component
  const PreviewComponent = compilationResult?.component;

  if (!PreviewComponent) {
    return (
      <div className={cn("h-full w-full", className)}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <ErrorBoundary
        key={key}
        FallbackComponent={ErrorFallback}
        onReset={() => setKey((prev) => prev + 1)}
      >
        <div className="p-8">
          <PreviewComponent />
        </div>
      </ErrorBoundary>
    </div>
  );
}
