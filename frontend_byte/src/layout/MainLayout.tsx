// src/layout/MainLayout.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HomeIcon,
  UsersIcon,
  ClipboardIcon,     // en lugar de ClipboardListIcon
  BanknotesIcon,     // en lugar de CashIcon
  ShoppingCartIcon,
  CalendarIcon,
  FolderIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";



interface Props {
  children?: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
  { to: "/dashboard",                label: "Dashboard",      icon: HomeIcon },
  { to: "/dashboard/presupuestos",   label: "Presupuestos",   icon: ClipboardIcon },
  { to: "/dashboard/ingresos",       label: "Ingresos",       icon: BanknotesIcon },
  { to: "/dashboard/ventas",         label: "Ventas",         icon: ShoppingCartIcon },
  { to: "/dashboard/gastos",         label: "Gastos",         icon: FolderIcon },
  { to: "/dashboard/clientes",       label: "Clientes",       icon: UsersIcon },
  { to: "/dashboard/usuarios",       label: "Usuarios",       icon: UsersIcon },
  { to: "/dashboard/pendientes",     label: "Pendientes",     icon: ChartBarIcon },
];


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar móvil */}
      <div
        className={`fixed inset-0 z-30 transition-opacity bg-black bg-opacity-50 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-purple-700 text-white transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="h-16 flex items-center px-6">
          <span className="text-2xl font-bold">Byte App</span>
        </div>
        <nav className="mt-6">
          {menu.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center px-6 py-3 hover:bg-purple-600 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-purple-900 border-b border-gray-200 flex items-center px-4 md:px-6">
          {/* botón hamburguesa en móvil */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-300"
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? (
              <svg
                className="w-6 h-6 text-gray-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <div className="flex-1" />

          <button
            onClick={logout}
            className="text-gray-100 hover:text-gray-900 underline"
          >
            Salir
          </button>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
