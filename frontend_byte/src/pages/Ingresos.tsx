import React, { useEffect, useState } from "react";
import { listVentas, type Venta } from "../services/ventas";

export default function Ingresos() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ cliente: "", producto: "" });

    const fetchVentas = async () => {
        setLoading(true);
        try {
            // Filtra los campos vacíos
            const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
            );

            const response = await listVentas(cleanFilters);
            console.log("Ventas recibidas:", response.data); // 👈 revisa en consola
            setVentas(response.data);
        } catch (error) {
            console.error("Error al obtener ventas", error);
        } finally {
            setLoading(false);
        }
    };


  useEffect(() => {
    fetchVentas();
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchVentas();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">📊 Ingresos</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Cliente
          </label>
          <input
            type="text"
            name="cliente"
            value={filters.cliente}
            onChange={handleFilterChange}
            placeholder="Buscar por cliente"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Producto
          </label>
          <select
            name="producto"
            value={filters.producto}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">Todos</option>
            <option value="Arroz">Arroz</option>
            <option value="Café">Café</option>
            <option value="Maíz">Maíz</option>
            {/* Agrega más productos aquí */}
          </select>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded-lg`}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow rounded-lg">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Cargando ventas...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abono
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventas.length > 0 ? (
                ventas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td className="px-4 py-2">{venta.id_venta}</td>
                    <td className="px-4 py-2">{venta.cliente?.nombre}</td>
                    <td className="px-4 py-2">
                      {new Date(venta.fecha).toLocaleDateString("es-EC")}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${venta.valor_total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${venta.abono.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${venta.saldo_pendiente.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{venta.estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-4 text-gray-500"
                  >
                    No se encontraron ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
