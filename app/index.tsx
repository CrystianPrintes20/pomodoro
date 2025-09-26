// app/index.tsx (ou onde fica sua tela principal)
import ActionButton from "@/components/ActionButton";
import FocusButton from "@/components/FocusButton";
import { IconPause, IconPlay } from "@/components/Icons";
import Timer from "@/components/Timer";
import { pomodoro } from "@/constants/pomodoroData";

import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";

import { Audio } from "expo-av";

const SOUND_REQUIRE = require("../assets/audio/ding.wav");

export default function Index() {
  const [timerType, setTimerType] = useState(pomodoro[0]);
  const [seconds, setSeconds] = useState(pomodoro[0].initialValue);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const latestTimerTypeRef = useRef(timerType);
  useEffect(() => {
    latestTimerTypeRef.current = timerType;
  }, [timerType]);

  // ===== GERENCIAMENTO DO SOM (Expo-AV) =====
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(SOUND_REQUIRE, {
          shouldPlay: false,
          volume: 1.0,
        });
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch (e) {
        console.warn("Falha ao carregar som:", e);
      }
    })();

    // cleanup geral (intervalo + som)
    return () => {
      mounted = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const clear = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerRunning(false);
    }
  };

  const notify = async () => {
    Vibration.vibrate(400);

    try {
      await soundRef.current?.replayAsync();
    } catch {
      // se falhar, segue sem som
    }
  };

  const onFinish = async () => {
    await notify();
    const currentType = latestTimerTypeRef.current;
    setSeconds(currentType.initialValue);
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
      setSeconds((old) => {
        if (old <= 0) {
          clear();
          onFinish();
          return 0;
        }
        return old - 1;
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
        <Text style={styles.footerText}>© 2025 Fokus</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
