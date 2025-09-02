import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "primary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
  primary: "bg-primary-themed text-white hover:opacity-90",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  ghost:
    "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 py-1",
  md: "h-10 px-4 py-2",
  lg: "h-12 px-6 py-3",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extraProps: any = {
        className: cn(classes, (child.props as any)?.className),
      };
      // TypeScript can't know the child's prop shape here; cast is safe for className augmentation.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return React.cloneElement(child, extraProps) as unknown as any;
    }
    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
