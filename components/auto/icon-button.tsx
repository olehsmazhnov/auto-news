import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className = "", type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      {...props}
    />
  );
}
