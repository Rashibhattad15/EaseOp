import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { UserConfigurationModel } from "../../commons/models/configurations/userconfiguration";
import { app, realtimedb } from "@/firebaseConfig";
import { useOffice } from "@/context/OfficeContext";

export const useUserConfig = () => {
  const [configs, setConfigs] = useState<UserConfigurationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {officeId} = useOffice();

  useEffect(() => {
    const userConfigRef = ref(realtimedb, `offices/${officeId}/users`);

    const unsubscribe = onValue(
      userConfigRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const userConfigs: UserConfigurationModel[] = Object.keys(data).map((uid) => ({
            uid,
            ...data[uid],
          }));

          setConfigs(userConfigs);
        } else {
          setConfigs([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Realtime Database Listen Error:", err);
        setError("Failed to fetch user configurations.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return { configs, loading, error };
};
