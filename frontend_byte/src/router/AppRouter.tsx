// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }       from "../contexts/AuthContext";
import Login                  from "../pages/Login";
import HomePage               from "../pages/HomePage"; 
import Dashboard              from "../pages/Dashboard";
import NotFound               from "../pages/NotFound";
import NotAuthorized          from "../pages/NotAuthorized";
import MainLayout             from "../layout/MainLayout";
import Users                  from "../pages/Users";
import UserForm               from "../pages/UserForm";
import Clients                from "../pages/Clients";
import ClientForm             from "../pages/ClientForm";
import Presupuestos           from "../pages/Presupuestos";
import PresupuestoItemForm    from "../pages/PresupuestoItemForm";
import Subitems               from "../pages/Subitems";
import SubitemForm            from "../pages/SubitemForm";
import { AuthenticatedRoute } from "../components/AuthenticatedRoute";
import { AdminRoute }         from "../components/AdminRoute";
import { SalesRoute }         from "../components/SalesRoute";



export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Cualquier autenticado */}
          <Route path="homepage" element={<AuthenticatedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage/>} />

              {/* Solo admin */}
              <Route element={<AdminRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="usuarios" element={<Users />} />
                <Route path="usuarios/nuevo" element={<UserForm />} />
                <Route path="usuarios/:userId" element={<UserForm />} />
                <Route path="clientes/nuevo" element={<ClientForm />} />
              </Route>

              {/* Clientes: listar y detalle para cualquiera autenticado */}
              <Route path="clientes" element={<Clients />} />
              <Route path="clientes/:clientId" element={<ClientForm />} />

              {/* Presupuestos: listar cualquiera */}
              <Route path="presupuestos" element={<Presupuestos />} />

              {/* Crear/editar ítem: solo ventas y admin */}
              <Route element={<SalesRoute />}>
                <Route path="presupuestos/nuevo" element={<PresupuestoItemForm />} />
                <Route path="presupuestos/:itemId" element={<PresupuestoItemForm />} />
              </Route>

              {/* Subitems: listado cualquiera */}
              <Route path="presupuestos/:itemId/subitems" element={<Subitems />} />

              {/* Crear/editar subitem: solo ventas y admin */}
              <Route element={<SalesRoute />}>
                <Route path="presupuestos/:itemId/subitems/nuevo" element={<SubitemForm />} />
                <Route path="presupuestos/:itemId/subitems/:subId" element={<SubitemForm />} />
              </Route>
            </Route>
          </Route>

          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
