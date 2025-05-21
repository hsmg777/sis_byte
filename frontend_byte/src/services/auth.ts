// src/services/auth.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface LoginPayload {
  email: string;
  contraseña: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  contraseña: string;
  // opcional: rol si quieres exponerlo
}

export interface AuthResponse {
  access_token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export async function login(data: LoginPayload): Promise<AuthResponse> {
  const resp = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!resp.ok) throw new Error((await resp.json()).mensaje || resp.statusText);
  return resp.json();
}

export async function register(data: RegisterPayload): Promise<void> {
  const resp = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!resp.ok) {
    const json = await resp.json();
    throw new Error(json.mensaje || resp.statusText);
  }
}
