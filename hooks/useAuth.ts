import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const reduxToken = useSelector((state: any) => state.auth.token);
  const [token, setToken] = useState<string | null>(reduxToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      if (reduxToken) {
        setToken(reduxToken);
      } else {
        const storedToken = await SecureStore.getItemAsync("token");
        setToken(storedToken);
      }
      setLoading(false);
    };

    loadToken();
  }, [reduxToken]);

  return { token, loading, isAuthenticated: !!token };
};
