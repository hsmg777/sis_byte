// src/components/CosechaRoute.tsx
import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children?: ReactNode;
}

export function CosechaRoute({ children }: Props) {
  const { user, ready } = useAuth();
  const location = useLocation();

  // Mientras se restaura la sesión, no mostramos nada (o un spinner)
  if (!ready) {
    return null;
  }

  // Si no está autenticado, lo enviamos al login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Solo administradores o usuarios de cosecha pueden acceder
  if (user.rol !== "administrador" && user.rol !== "cosecha") {
    return <Navigate to="/not-authorized" replace />;
  }

  // Renderiza las rutas hijas (o los children si se pasan)
  return children ? <>{children}</> : <Outlet />;
}
