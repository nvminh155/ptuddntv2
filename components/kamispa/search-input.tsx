import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

type SearchInputProps = {
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
}

export function SearchInput({ placeholder = "Search...", value, onChangeText }: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#8e8e93" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8e8e93"
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#8e8e93" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: "100%",
    fontFamily: "Inter-Regular",
  },
  clearButton: {
    padding: 4,
  },
})
