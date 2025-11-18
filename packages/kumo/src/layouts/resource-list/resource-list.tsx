import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface ResourceListPageProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  usage?: ReactNode;
  additionalContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * ResourceListPage - A layout component for resource list pages
 * 
 * Layouts are page-level components that provide consistent structure
 * for common page patterns like resource lists, dashboards, and settings.
 */
export function ResourceListPage({
  title,
  description,
  icon,
  usage,
  additionalContent,
  children,
  className,
}: ResourceListPageProps) {
  return (
    <div className={cn("w-full h-full min-h-screen bg-bg-secondary", className)}>
      <div className="flex flex-col p-6 md:p-8 lg:px-10 lg:py-9 md:gap-4 xl:gap-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col">
          <div className="mb-1.5 flex items-center gap-1.5">
            {icon && icon}
            <h1 className="font-heading text-3xl font-semibold m-0 p-0">{title}</h1>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg hidden md:block leading-normal text-pretty p-0">
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse xl:flex-row gap-6 xl:gap-8">
          <div className="min-w-0 grow">{children}</div>

          {(usage || additionalContent) && (
            <div
              className={`xl:w-[380px] w-full xl:sticky top-22 h-fit flex flex-col gap-4 shrink-0`}
            >
              {usage && usage}

              <div
                className={cn("hidden xl:block", usage ? "mt-6" : "")}
              >
                {additionalContent && additionalContent}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 xl:hidden">{additionalContent}</div>
      </div>
    </div>
  );
}
