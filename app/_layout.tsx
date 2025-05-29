import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown:false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown:false }} />
      </Stack>
    </>
  )
}