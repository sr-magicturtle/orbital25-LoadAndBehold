import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function QRLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
    </>
  );
}
