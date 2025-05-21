// src/components/AuthenticatedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children?: ReactNode;
}

/**
 * Ruta que permite el acceso a cualquier usuario autenticado.
 * Si la sesión aún no se ha hidratado (ready = false), devuelve null (o un spinner).
 * Si no hay usuario, redirige al login.
 */
export function AuthenticatedRoute({ children }: Props) {
  const { user, ready } = useAuth();
  const location = useLocation();

  // Mientras restauramos la sesión, no renderizamos nada
  if (!ready) {
    return null; // o un <Spinner />
  }

  // Si no hay usuario, vamos al login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Renderizamos children (o Outlet para rutas hijas)
  return children ? <>{children}</> : <Outlet />;
}
