import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui-style button variants. Use `buttonVariants()` on links so anchors
 * and buttons share one look.
 */
export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,box-shadow,transform] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.05em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-ink shadow-[0_10px_30px_-12px_var(--accent)] hover:shadow-[0_14px_36px_-10px_var(--accent)]",
        ink: "bg-ink text-bg hover:bg-accent hover:text-accent-ink",
        outline: "border border-line bg-transparent text-ink hover:border-ink",
        ghost: "text-ink hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-4 text-step--1",
        md: "h-12 px-6 text-step-0",
        lg: "h-14 px-8 text-step-0",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
