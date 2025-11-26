import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { api } from "../api/axiosClient";

type AuthContextType = {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

// Use undefined as default — ensures HMR-friendly checks
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api.get("/auth/profile")
      .then((res) => res.data?.id && mounted && setUser(res.data))
      .catch(() => mounted && setUser(null))
      .finally(() => mounted && setLoading(false));

    

    return () => { mounted = false; };
  }, []);

  // useMemo ensures the object identity is stable — HMR-safe
  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data.user);
      },
      logout: async () => {
        await api.post("/auth/logout");
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HMR-safe named export
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
