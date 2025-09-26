import { Pressable, StyleSheet, Text } from "react-native";

interface props {
  title: string;
  icons?: React.ReactNode;
  onPress: () => void;

}
const FocusButton = ({ title, icons, onPress }: props) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      {icons}
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

export default FocusButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#B872ff",
    borderRadius: 32,
    padding: 8,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  }
});
