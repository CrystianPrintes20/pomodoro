import { StyleSheet, Text } from "react-native";

interface props {
  totalSeconds: number;
}
const Timer = ({ totalSeconds }: props) => {
  const date = new Date(totalSeconds * 1000);
  const options = { minute: "2-digit", second: "2-digit" } as const;
  return (
    <Text style={styles.timer}>{date.toLocaleTimeString("pt-BR", options)}</Text>
  );
};

export default Timer;


const styles = StyleSheet.create({  
    timer: {
        fontSize: 54,
        color: "#FFF",
        fontWeight: "bold",
        textAlign: "center",
      },
});