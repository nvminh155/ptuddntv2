import { COLORS } from "@/constants"
import { StyleSheet, Text, View } from "react-native"

interface PasswordStrengthIndicatorProps {
  password: string
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null

  // Calculate password strength
  const getStrength = (password: string): { level: number; label: string; color: string } => {
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1 // Has uppercase
    if (/[a-z]/.test(password)) strength += 1 // Has lowercase
    if (/[0-9]/.test(password)) strength += 1 // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1 // Has special char

    // Map strength level to label and color
    switch (true) {
      case strength <= 1:
        return { level: 1, label: "Yếu", color: COLORS.lightRed }
      case strength <= 3:
        return { level: 2, label: "Trung bình", color: COLORS.primary }
      case strength <= 4:
        return { level: 3, label: "Khá", color: COLORS.lightBlue }
      default:
        return { level: 4, label: "Mạnh", color: COLORS.lightGreen }
    }
  }

  const strength = getStrength(password)

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        <View style={[styles.bar, { backgroundColor: strength.level >= 1 ? strength.color : COLORS.lightGray3 }]} />
        <View style={[styles.bar, { backgroundColor: strength.level >= 2 ? strength.color : COLORS.lightGray3 }]} />
        <View style={[styles.bar, { backgroundColor: strength.level >= 3 ? strength.color : COLORS.lightGray3 }]} />
        <View style={[styles.bar, { backgroundColor: strength.level >= 4 ? strength.color : COLORS.lightGray3 }]} />
      </View>
      <Text style={[styles.label, { color: strength.color }]}>{strength.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 4,
  },
  bars: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
})

export default PasswordStrengthIndicator
