// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }         from "../contexts/AuthContext";
import Login                    from "../pages/Login";
import Dashboard                from "../pages/Dashboard";
import NotFound                 from "../pages/NotFound";
import NotAuthorized            from "../pages/NotAuthorized";
import MainLayout               from "../layout/MainLayout";
import Users                    from "../pages/Users";
import UserForm                 from "../pages/UserForm";
import Clients                  from "../pages/Clients";
import ClientForm               from "../pages/ClientForm";
import { AdminRoute }           from "../components/AdminRoute";
import { AuthenticatedRoute }   from "../components/AuthenticatedRoute";
export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/** -- pública -- */}
          <Route path="/" element={<Login />} />

          {/** -- rutas protegidas: cualquier usuario autenticado -- */}
          <Route path="/dashboard" element={<AuthenticatedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />

              {/** Usuarios: todo lo gestionan solo admins */}
              <Route element={<AdminRoute />}>
                <Route path="usuarios"         element={<Users />} />
                <Route path="usuarios/nuevo"   element={<UserForm />} />
                <Route path="usuarios/:userId" element={<UserForm />} />
              </Route>

              {/** Clientes */}
              {/** listar y detalle: cualquiera autenticado */}
              <Route path="clientes" element={<Clients />} />
              <Route path="clientes/:clientId" element={<ClientForm />} />

              {/** crear y editar clientes: solo admin */}
              <Route element={<AdminRoute />}>
                <Route path="clientes/nuevo"   element={<ClientForm />} />
              </Route>
            </Route>
          </Route>

          {/** no autorizado y catch-all */}
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
