import { Stack, router } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import useInternetStatus from "../hooks/useInternet"; // Import custom hook
import { OfficeProvider, useOffice } from "../context/OfficeContext";

const isDeveloperMode = false;

function InnerLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConnected = useInternetStatus(); // Use the hook
  const {officeId, setOfficeId} = useOffice()

  useEffect(() => {
    if (isDeveloperMode) {
      console.log("🚀 Developer Mode Enabled: Skipping Authentication");
      setOfficeId("office123")
      console.log(officeId);
      router.replace("/(tabs)/(home)");
      return;
    }

    // Listen for auth state changes only if not in Developer Mode
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);

      if (user) {
        router.replace("/(tabs)/(home)");
      } else {
        router.replace("/");
      }
    });

    return () => unsubscribeAuth();
  }, [officeId]);

  

  if (isLoading && !isDeveloperMode) {
    return (
      <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Checking authentication...</Text>
        </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.centered}>
          <Text style={styles.errorText}>⚠️ No Internet Connection</Text>
          <Text>Please check your network and try again.</Text>
        </View>
    );
  }

  return (
    <Stack>
        <Stack.Screen name="index" options={{ title: "Login", headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}

export default function Layout() {
  return (
    <OfficeProvider>
      <InnerLayout />
    </OfficeProvider>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, fontWeight: "bold", color: "red" },
});
