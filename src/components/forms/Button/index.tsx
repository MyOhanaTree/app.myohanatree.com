import type { ButtonHTMLAttributes, ReactNode } from "react";
import SpinnerIcon from "@/components/icons/Spinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "dangerOutline"
  | "subtle";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  name?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  $submitting?: boolean;
  $disabled?: boolean;
};

const Button = ({
  name,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading,
  leftIcon,
  rightIcon,
  onClick,
  disabled,
  $submitting,
  $disabled,
  className,
  type = "button",
  ...rest
}: ButtonProps) => {
  const isLoading = loading ?? $submitting ?? false;
  const isDisabled = Boolean(disabled || $disabled || isLoading);

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const sizeClass: Record<ButtonSize, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-sm",
    icon: "h-10 w-10 p-0",
  };

  const variantClass: Record<ButtonVariant, string> = {
    primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    outline: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 shadow-none hover:bg-slate-100",
    danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    dangerOutline: "border border-rose-300 bg-white text-rose-700 shadow-sm hover:border-rose-400 hover:bg-rose-50",
    subtle: "border border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100",
  };

  const fullClass = [
    baseClass,
    sizeClass[size],
    variantClass[variant],
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = children ?? name;
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={fullClass}
      onClick={onClick}
      {...rest}
    >
      {isLoading && <SpinnerIcon />}
      {!isLoading && leftIcon}
      {content}
      {!isLoading && rightIcon}
    </button>
  );
};
export default Button;
