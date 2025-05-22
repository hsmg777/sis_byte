// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";
import type { AxiosResponse } from "axios";

export interface Usuario {
  id_usuario: number;
  nombre:     string;
  email:      string;
  rol:        string;
}

export interface AuthResponse {
  access_token: string;
  usuario:      Usuario;
}

// Payload para registro
export interface RegisterData {
  nombre:     string;
  email:      string;
  contraseña: string;
  rol:        "administrador" | "cosecha" | "contable";
}

interface AuthContextType {
  user:  Usuario | null;
  ready: boolean;                              // <-- nuevo flag
  login: (data: { email: string; contraseña: string }) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,  setUser]  = useState<Usuario | null>(null);
  const [ready, setReady] = useState(false);    // <-- hidratación pendiente

  // Al montar, recupera token y usuario de localStorage
  useEffect(() => {
    const token  = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(stored));
    }
    setReady(true);  // <-- ya hemos intentado restaurar la sesión
  }, []);

  // Login: guarda token y usuario en localStorage y contexto
  const login = async (data: { email: string; contraseña: string }) => {
    const resp: AxiosResponse<AuthResponse> = await api.post("/auth/login", data);
    const { access_token, usuario } = resp.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(usuario));
    api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    setUser(usuario);
  };

  // Logout: limpia todo
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  // Registro
  const register = async (data: RegisterData) => {
    await api.post<Usuario>("/auth/register", data);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
