import ActionButton from "@/components/ActionButton";
import FocusButton from "@/components/FocusButton";
import { IconPause, IconPlay } from "@/components/Icons";
import Timer from "@/components/Timer";
import { useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const pomodoro = [
  {
    id: "focus",
    initialValue: 25 * 60,
    image: require("./assets/pomodoro.png"),
    display: "Focus",
  },
  {
    id: "short",
    initialValue: 5 * 60,
    image: require("./assets/short.png"),
    display: "Short break",
  },
  {
    id: "long",
    initialValue: 15 * 60,
    image: require("./assets/long.png"),
    display: "Long break",
  },
];

export default function Index() {
  const [timerType, setTimerType] = useState(pomodoro[0]);
  const [seconds, setSeconds] = useState(pomodoro[0].initialValue);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clear = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerRunning(false);
    }
  };

  const toggleTimerType = (newTimerType: (typeof pomodoro)[0]) => () => {
    setTimerType(newTimerType);
    setSeconds(newTimerType.initialValue);
    clear();
  };

  const toggleTimer = () => {
    if (timerRef.current) {
      clear();
      return;
    }

    setTimerRunning(true);

    const id = setInterval(() => {
      setSeconds((oldState) => {
        if (oldState === 0) {
          clear();
          return timerType.initialValue;
        }
        return oldState - 1;
      });
    }, 1000);
    timerRef.current = id;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={timerType.image} />
      <View style={styles.actions}>
        <View style={styles.context}>
          {pomodoro.map((item) => (
            <ActionButton
              key={item.id}
              active={item.id === timerType.id}
              onPress={toggleTimerType(item)}
              display={item.display}
            />
          ))}
        </View>

        <Timer totalSeconds={seconds} />
        <FocusButton
          title={timerRunning ? "Stop" : "Start"}
          icons={timerRunning ? <IconPause /> : <IconPlay />}
          onPress={toggleTimer}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Crystian Printes</Text>
        <Text style={styles.footerText}>© 2023 Fokus</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // permite o scroll ocupar todo o espaço
    backgroundColor: "#021123",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    paddingVertical: 32,
  },
  actions: {
    padding: 24,
    backgroundColor: "#14448080",
    width: "80%",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#144480",
    gap: 32,
  },
  footer: {
    width: "80%",
  },
  footerText: {
    textAlign: "center",
    color: "#98A0A8",
    fontSize: 12.5,
  },
  context: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
