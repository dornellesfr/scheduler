import {
  Text as NativeText,
  type TextProps as NativeTextProps,
} from "react-native";

interface TextProps extends NativeTextProps {
  className?: string;
}

export function Text({ className, ...props }: TextProps): React.JSX.Element {
  return <NativeText className={className} {...props} />;
}
