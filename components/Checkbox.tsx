import { COLORS } from "@/constants"
import Icon from "@expo/vector-icons/Feather"
import { StyleSheet, TouchableOpacity } from "react-native"

interface CheckboxProps {
  checked: boolean
  onToggle: () => void
  size?: number
}

const Checkbox = ({ checked, onToggle, size = 22 }: CheckboxProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[
        styles.checkbox,
        {
          width: size,
          height: size,
          borderRadius: size / 4,
        },
        checked ? styles.checked : styles.unchecked,
      ]}
    >
      {checked && <Icon name="check" size={size - 8} color={COLORS.white} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  checkbox: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  checked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  unchecked: {
    backgroundColor: "transparent",
    borderColor: COLORS.lightGray3,
  },
})

export default Checkbox
