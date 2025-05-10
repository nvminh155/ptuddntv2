import type React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"

type ButtonProps = {
  title?: string
  onPress: () => void
  variant?: "primary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  children,
}: ButtonProps) {
  const getButtonStyle = () => {
    const buttonStyle: StyleProp<ViewStyle> = [styles.button]

    // Add variant styles
    if (variant === "primary") {
      buttonStyle.push(styles.primaryButton)
    } else if (variant === "outline") {
      buttonStyle.push(styles.outlineButton)
    } else if (variant === "ghost") {
      buttonStyle.push(styles.ghostButton)
    }

    // Add size styles
    if (size === "small") {
      buttonStyle.push(styles.smallButton)
    } else if (size === "large") {
      buttonStyle.push(styles.largeButton)
    }

    // Add disabled style
    if (disabled) {
      buttonStyle.push(styles.disabledButton)
    }

    return buttonStyle
  }

  const getTextStyle = () => {
    const textStyleArray: StyleProp<TextStyle> = [styles.buttonText]

    // Add variant text styles
    if (variant === "primary") {
      textStyleArray.push(styles.primaryButtonText)
    } else if (variant === "outline") {
      textStyleArray.push(styles.outlineButtonText)
    } else if (variant === "ghost") {
      textStyleArray.push(styles.ghostButtonText)
    }

    // Add size text styles
    if (size === "small") {
      textStyleArray.push(styles.smallButtonText)
    } else if (size === "large") {
      textStyleArray.push(styles.largeButtonText)
    }

    // Add disabled text style
    if (disabled) {
      textStyleArray.push(styles.disabledButtonText)
    }

    return textStyleArray
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#007AFF"} size="small" />
      ) : (
        <>
          {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
          {children}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
  primaryButtonText: {
    color: "#fff",
  },
  outlineButtonText: {
    color: "#007AFF",
  },
  ghostButtonText: {
    color: "#007AFF",
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
})
