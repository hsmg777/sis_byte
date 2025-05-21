// src/components/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminRoute() {
  const { user, ready } = useAuth();

  // 1) Mientras aún no sé si hay sesión (hydrating), no hago nada
  if (!ready) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  // 2) Si ya estoy listo y no hay user, voy al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3) Si estoy logueado pero no soy administrador, voy a "no autorizado"
  if (user.rol !== "administrador") {
    return <Navigate to="/not-authorized" replace />;
  }

  // 4) OK: renderiza las rutas hijas
  return <Outlet />;
}
