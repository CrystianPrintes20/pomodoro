import { Pressable, StyleSheet, Text } from "react-native";

interface props {
  active: boolean;
  onPress: () => void;
  display: string;
}

const ActionButton = ({ active, onPress, display }: props) => {
  return (
    <Pressable
      style={active ? styles.contextButtonActive : null}
      onPress={onPress}
    >
      <Text style={styles.contextButtonText}>{display}</Text>
    </Pressable>
  );
}
export default ActionButton;

const styles = StyleSheet.create({
  contextButtonText: {
    color: "#FFF",
    padding: 8,
    fontSize: 12.5,
  },

  contextButtonActive: {
    backgroundColor: "#144480",
    borderRadius: 8,
  },
});
