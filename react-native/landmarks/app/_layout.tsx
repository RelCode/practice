import { Stack } from "expo-router";
import Index from ".";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ title: "Home" }} />
    <Stack.Screen name="landmarks" options={{ title: "Landmarks" }} />
  </Stack>;
}
