"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    container?: React.HTMLAttributes<HTMLDivElement>;
  }
>(({ className, children, container, ...props }, ref) => {
  return (
    <div className={cn("relative", container?.className)}>
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
    </div>
  );
});
Select.displayName = "Select";

const SelectTrigger = ({ children }: { children: React.ReactNode }) => children;
const SelectValue = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, children, ...props }, ref) => (
  <option className={className} ref={ref} {...props}>
    {children}
  </option>
));
SelectItem.displayName = "SelectItem";

const SelectGroup = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
