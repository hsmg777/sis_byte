import api from "./api";

// -----------------------------
// Interfaces (Tipos de datos)
// -----------------------------

export interface Venta {
  id_venta: number;
  id_cliente: number;
  fecha: string;
  forma_pago: string;
  valor_total: number;
  abono: number;
  saldo_pendiente: number;
  numero_documento: string;
  estado: string;
  comentarios?: string;
  detalles?: DetalleVenta[];
  pagos?: PagoVenta[];
  cliente?: { 
    id_cliente: number;
    nombre: string;
  };
}


export interface VentaCreate {
  id_cliente: number;
  fecha: string;
  forma_pago: string;
  numero_documento: string;
  comentarios?: string;
  detalles: DetalleVentaCreate[];
}


export interface DetalleVenta {
  id_detalle: number;
  id_venta: number;
  id_stock: number;
  kilos: number;
  precio: number;
  subtotal: number;
}

export interface DetalleVentaCreate {
  id_stock: number;
  kilos: string;    // como string por Decimal(as_string=True)
  precio: string;
  subtotal: string;
}

export interface PagoVenta {
  id_pago: number;
  id_venta: number;
  fecha_pago: string;
  monto: number;
  nro_documento: string;
  observaciones?: string;
}

export interface PagoVentaCreate {
  fecha_pago: string;
  monto: number;
  nro_documento: string;
  observaciones?: string;
}

export interface VentaFilters {
  cliente?: string;   
  producto?: string;  
}

// -----------------------------
// Funciones API REST
// -----------------------------

// 🧾 Ventas
export function listVentas(filters: VentaFilters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "")
  );
  return api.get<Venta[]>("/ventas", { params: cleanFilters });
}

export function getVenta(id_venta: number) {
  return api.get<Venta>(`/ventas/${id_venta}`);
}

export function createVenta(data: VentaCreate) {
  return api.post<Venta>("/ventas/", data); // 🔥 nota: slash final obligatorio
}

export function updateVenta(id_venta: number, data: Partial<Venta>) {
  return api.put<Venta>(`/ventas/${id_venta}`, data);
}

export function deleteVenta(id_venta: number) {
  return api.delete<void>(`/ventas/${id_venta}`);
}

// 📦 Detalles de venta
export function listDetallesByVenta(id_venta: number) {
  return api.get<DetalleVenta[]>(`/ventas/${id_venta}/detalles`);
}

export function addDetalleToVenta(id_venta: number, data: DetalleVentaCreate) {
  return api.post<DetalleVenta>(`/ventas/${id_venta}/detalles`, data);
}

export function updateDetalle(id_detalle: number, data: Partial<DetalleVenta>) {
  return api.put<DetalleVenta>(`/ventas/detalles/${id_detalle}`, data);
}

export function deleteDetalle(id_detalle: number) {
  return api.delete<void>(`/ventas/detalles/${id_detalle}`);
}

// 💰 Pagos de venta
export function listPagosByVenta(id_venta: number) {
  return api.get<PagoVenta[]>(`/ventas/${id_venta}/pagos`);
}

export function addPagoToVenta(id_venta: number, data: PagoVentaCreate) {
  return api.post<PagoVenta>(`/ventas/${id_venta}/pagos`, data);
}

export function updatePago(id_pago: number, data: Partial<PagoVenta>) {
  return api.put<PagoVenta>(`/ventas/pagos/${id_pago}`, data);
}

export function deletePago(id_pago: number) {
  return api.delete<void>(`/ventas/pagos/${id_pago}`);
}


