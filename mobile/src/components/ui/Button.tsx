import { Pressable, type PressableProps } from "react-native";

import { Text } from "./Text";

type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "destructive";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

const buttonClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 dark:bg-blue-500",
  secondary: "bg-slate-200 dark:bg-slate-800",
  outline: "border border-slate-300 bg-transparent dark:border-slate-700",
  ghost: "bg-transparent",
  destructive: "bg-red-600 dark:bg-red-500",
};

const textClasses: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-slate-900 dark:text-slate-50",
  outline: "text-slate-900 dark:text-slate-50",
  ghost: "text-blue-600 dark:text-blue-400",
  destructive: "text-white",
};

export function Button({
  children,
  className,
  disabled = false,
  loading = false,
  variant = "primary",
  ...props
}: ButtonProps): React.JSX.Element {
  const isDisabled: boolean = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      className={`min-h-11 items-center justify-center rounded-lg px-4 py-2 ${buttonClasses[variant]} ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`}
      disabled={isDisabled}
      {...props}
    >
      <Text
        className={`text-center text-sm font-semibold ${textClasses[variant]}`}
      >
        {loading ? "Processando..." : children}
      </Text>
    </Pressable>
  );
}
