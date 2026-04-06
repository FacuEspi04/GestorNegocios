import React, { useState, useEffect } from "react";
import { ArrowLeft, Wallet, CheckCircle, Wallet2, CalendarDays, Users, PlusCircle, Pencil, Trash2, History, EyeOff } from "lucide-react";
import {
  getVentasPendientes,
  type Venta,
  type FormaPago,
  registrarPagoCliente,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  type Cliente,
  type CreateClienteDto
} from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { formatearMoneda, formatearPeso, formatearPrecioInput, parsePrecioInput } from "../../utils/formatters";
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Tabs from '../ui/Tabs';
import * as S from '../ui/styles';

const CuentasCorrientes: React.FC = () => {
  const navigate = useNavigate();
  const [ventasPendientes, setVentasPendientes] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabKey, setTabKey] = useState("deudas");

  const [showModal, setShowModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(null);
  const [deudaTotalCliente, setDeudaTotalCliente] = useState<number>(0);
  const [montoPago, setMontoPago] = useState<string>("");
  const [formaPagoPago, setFormaPagoPago] = useState<FormaPago>("efectivo");
  const [interesPorcentajePago, setInteresPorcentajePago] = useState<string>("10");
  const [fechaPago, setFechaPago] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exito, setExito] = useState("");

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
  const [formCliente, setFormCliente] = useState<CreateClienteDto>({ nombre: "", telefono: "", email: "", direccion: "" });
  const [isSubmittingCliente, setIsSubmittingCliente] = useState(false);
  const [mostrarHistorialCompleto, setMostrarHistorialCompleto] = useState(false);

  const getTodayString = () => { const h = new Date(); return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,'0')}-${String(h.getDate()).padStart(2,'0')}`; };

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setIsLoading(true); setError(null);
    try {
      const [ventasData, clientesData] = await Promise.all([getVentasPendientes(), getClientes()]);
      setVentasPendientes(ventasData); setClientes(clientesData || []);
    } catch (err: any) { setError(err.message || "No se pudieron cargar los datos."); setVentasPendientes([]); } finally { setIsLoading(false); }
  };

  const ventasPendientesFiltradas = ventasPendientes.filter((v) => v.clienteId && clientes.some((c) => c.id === v.clienteId));

  const ventasPorCliente = ventasPendientesFiltradas.reduce((acc, venta) => {
    const key = venta.clienteNombre || "Cliente";
    if (!acc[key]) acc[key] = [];
    acc[key].push(venta);
    return acc;
  }, {} as { [cliente: string]: Venta[] });

  const calcularDeudaCliente = (cliente: string): number => ventasPorCliente[cliente].reduce((a, v) => a + (Number(v.total) - Number(v.monto_pagado || 0)), 0);

  const handleAbrirModalPago = (clienteNombre: string) => {
    setClienteSeleccionado(clienteNombre); setDeudaTotalCliente(calcularDeudaCliente(clienteNombre));
    setMontoPago(""); setFormaPagoPago("efectivo"); setInteresPorcentajePago("10"); setFechaPago(getTodayString());
    setError(null); setExito(""); setShowModal(true);
  };

  const handleRegistrarPago = async () => {
    if (!clienteSeleccionado || !montoPago || !fechaPago) return;
    const montoNumerico = parsePrecioInput(montoPago);
    if (isNaN(montoNumerico) || montoNumerico <= 0) { setError("Por favor ingrese un monto válido mayor a 0."); return; }
    setIsSubmitting(true); setError(null);
    const porcentaje = parseFloat(interesPorcentajePago) || 0;
    const montoConInteres = formaPagoPago === "credito" ? montoNumerico * (1 + (porcentaje / 100)) : montoNumerico;
    try {
      await registrarPagoCliente({ clienteNombre: clienteSeleccionado, monto: montoNumerico, formaPago: formaPagoPago, interes: montoConInteres - montoNumerico, fecha: fechaPago });
      setShowModal(false); setExito(`¡Pago de ${formatearMoneda(montoNumerico)} registrado correctamente para ${clienteSeleccionado}!`);
      await cargarDatos(); setTimeout(() => setExito(""), 5000);
    } catch (apiError: any) { setError(apiError.message || "Error al procesar el pago."); } finally { setIsSubmitting(false); }
  };

  const handleShowClienteModal = (cliente?: Cliente) => {
    if (cliente) { setClienteAEditar(cliente); setFormCliente({ nombre: cliente.nombre, telefono: cliente.telefono || "", email: cliente.email || "", direccion: cliente.direccion || "" }); }
    else { setClienteAEditar(null); setFormCliente({ nombre: "", telefono: "", email: "", direccion: "" }); }
    setShowClienteModal(true);
  };

  const handleGuardarCliente = async () => {
    if (!formCliente.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setIsSubmittingCliente(true); setError(null);
    try {
      if (clienteAEditar) { await updateCliente(clienteAEditar.id, formCliente); setExito(`Cliente ${formCliente.nombre} actualizado.`); }
      else { await createCliente(formCliente); setExito(`Cliente ${formCliente.nombre} creado.`); }
      setShowClienteModal(false); await cargarDatos(); setTimeout(() => setExito(""), 3000);
    } catch (err: any) { setError(err.message || "Error al guardar el cliente"); } finally { setIsSubmittingCliente(false); }
  };

  const handleEliminarCliente = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try { setIsLoading(true); await deleteCliente(id); setExito("Cliente eliminado"); await cargarDatos(); setTimeout(() => setExito(""), 3000); }
      catch { setError("No se puede eliminar el cliente porque tiene ventas asociadas o ocurrió un error."); setIsLoading(false); }
    }
  };

  const formatearFecha = (fechaISO: string | Date) => { const f = new Date(fechaISO); return `${String(f.getDate()).padStart(2,"0")}/${String(f.getMonth()+1).padStart(2,"0")}/${f.getFullYear()}`; };
  const formatearHora = (fechaISO: string | Date) => new Date(fechaISO).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className={`${S.card} mt-2`}>
        <div className={S.cardHeader}>
          <h5 className="text-base font-semibold flex items-center gap-2"><Wallet size={18} /> Cuentas Corrientes</h5>
          <button className={S.btnOutlineSecondary} onClick={() => navigate("/ventas")}><ArrowLeft size={16} className="mr-1" /> Volver</button>
        </div>
        <div className={S.cardBody}>
          {exito && <div className={S.alertSuccess}><CheckCircle size={24} className="shrink-0" /> {exito}</div>}
          {error && !showModal && <div className={S.alertDanger}><span className="flex-1">{error}</span><button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-2 cursor-pointer">✕</button></div>}

          {isLoading ? (
            <div className="text-center py-10"><Spinner /><p className="mt-2 text-slate-500">Cargando datos...</p></div>
          ) : (
            <>
              <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
                <Tabs.Tab eventKey="deudas" title={<><Wallet size={16} className="mr-1 inline" /> Deudas Pendientes</>}>
                  <div className="mt-3">
                    {Object.keys(ventasPorCliente).length > 0 ? (
                      Object.keys(ventasPorCliente).map((cliente) => {
                        // Filtrar ventas según el estado del toggle
                        const ventasCliente = ventasPorCliente[cliente];
                        const ventasFiltradas = mostrarHistorialCompleto 
                          ? ventasCliente 
                          : ventasCliente.filter(v => {
                              const isRecibo = v.estado === 'Completada' && (!v.items || v.items.length === 0);
                              if (isRecibo) return true; // Siempre mostrar los recibos de pago
                              const total = Number(v.total);
                              const pagado = Number(v.monto_pagado || 0);
                              return (total - pagado) > 0; // Solo mostrar deudas con saldo pendiente
                            });
                        
                        // Si no hay ventas filtradas para mostrar, no renderizar la card del cliente
                        if (ventasFiltradas.length === 0) return null;

                        return (
                        <div key={cliente} className={`${S.card} mb-4`}>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200 rounded-t-xl">
                            <div className="flex items-center gap-2">
                              <Wallet2 size={20} className="text-slate-500" />
                              <span className="text-lg font-bold">{cliente}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`${S.badgeDanger} text-sm px-3 py-1`}>Deuda Total: {formatearMoneda(calcularDeudaCliente(cliente))}</span>
                              <button 
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                                onClick={() => setMostrarHistorialCompleto(!mostrarHistorialCompleto)}
                              >
                                {mostrarHistorialCompleto ? <><EyeOff size={14} /> Ocultar saldadas</> : <><History size={14} /> Ver historial</>}
                              </button>
                              <button className={S.btnSuccess} onClick={() => handleAbrirModalPago(cliente)}>Registrar Entrega / Pago</button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className={S.table}>
                              <thead className={S.tableHeaderBrand}>
                                <tr><th className={S.th}>Fecha y Hora</th><th className={S.th}>Medio de Pago</th><th className={S.th}>Detalle</th><th className={`${S.th} text-right`}>Monto/Estado</th></tr>
                              </thead>
                              <tbody>
                                {ventasFiltradas.map((venta) => {
                                  const total = Number(venta.total); const pagado = Number(venta.monto_pagado || 0); const resta = total - pagado;
                                  const isRecibo = venta.estado === 'Completada' && (!venta.items || venta.items.length === 0);
                                  return (
                                    <tr key={venta.id} className={isRecibo ? 'bg-emerald-50' : 'bg-red-50'}>
                                      <td className={`${S.td} align-middle`}>
                                        <div className="font-medium text-slate-800">{formatearFecha(venta.fechaHora)} {formatearHora(venta.fechaHora)}</div>
                                      </td>
                                      <td className={`${S.td} align-middle`}><span className={S.badgeSecondary}>{venta.formaPago ? venta.formaPago.toUpperCase() : "CUENTA CORRIENTE"}</span></td>
                                      <td className={S.td}>
                                        {isRecibo ? <span className="text-emerald-600 font-bold">Entrega de dinero a favor</span>
                                          : <small className="text-slate-500">{venta.items.map(i => `${i.articulo?.nombre || 'Art.'} (x${i.articulo?.esPesable ? formatearPeso(Number(i.cantidad)) : i.cantidad})`).join(", ")}</small>}
                                      </td>
                                      <td className={`${S.td} text-right`}>
                                        {isRecibo ? <div className="text-emerald-600 font-bold">+{formatearMoneda(pagado)}</div>
                                          : pagado > 0 ? <div><span className="line-through text-slate-400 text-xs">Orig: {formatearMoneda(total)}</span><div className="text-red-600 font-bold">Restan: {formatearMoneda(resta)}</div></div>
                                          : <span className="font-bold text-red-600">{formatearMoneda(total)}</span>}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        );
                      })
                    ) : (
                      <div className={`${S.alertInfo} text-center`}>✅ No hay deudas pendientes</div>
                    )}
                  </div>
                </Tabs.Tab>

                <Tabs.Tab eventKey="directorio" title={<><Users size={16} className="mr-1 inline" /> Directorio de Clientes</>}>
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-slate-500 font-semibold">Clientes Registrados</h5>
                      <button className={S.btnSuccess} onClick={() => handleShowClienteModal()}><PlusCircle size={14} className="mr-1" /> Nuevo Cliente</button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className={S.table}>
                        <thead className={S.tableHeaderBrand}>
                          <tr><th className={S.th}>N° Interno</th><th className={S.th}>Nombre</th><th className={S.th}>Teléfono</th><th className={S.th}>Email</th><th className={`${S.th} text-center`}>Acciones</th></tr>
                        </thead>
                        <tbody>
                          {clientes.length > 0 ? clientes.map((c) => (
                            <tr key={c.id} className={`${S.trStriped} ${S.trHover}`}>
                              <td className={S.td}>{c.id}</td>
                              <td className={`${S.td} font-bold`}>{c.nombre}</td>
                              <td className={S.td}>{c.telefono || <small className="text-slate-400">N/A</small>}</td>
                              <td className={S.td}>{c.email || <small className="text-slate-400">N/A</small>}</td>
                              <td className={`${S.td} text-center`}>
                                <div className="flex gap-1.5 justify-center">
                                  <button className={S.btnOutlinePrimary} onClick={() => handleShowClienteModal(c)}><Pencil size={14} /></button>
                                  <button className={S.btnOutlineDanger} onClick={() => handleEliminarCliente(c.id)}><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={5} className={`${S.td} text-center text-slate-500`}>No hay clientes registrados de forma persistente.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Tabs.Tab>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Modal Pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton onHide={() => setShowModal(false)} className="modal-header-brand"><Modal.Title>Registrar Pago: {clienteSeleccionado}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <div className={S.alertDanger}>{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <div className="text-center p-3 bg-slate-50 rounded-lg mb-3">
                <h6 className="text-slate-500 uppercase text-xs mb-1">Deuda Actual</h6>
                <h2 className="text-red-600 font-bold text-2xl">{formatearMoneda(deudaTotalCliente)}</h2>
              </div>
              <div className={S.formGroup}>
                <label className={S.label}><CalendarDays size={14} className="inline mr-1" /> Fecha de ingreso en Caja</label>
                <input type="date" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} max={getTodayString()} className={S.input} />
                <p className={S.formText}>El dinero impactará en la caja de este día.</p>
              </div>
            </div>
            <div className="md:col-span-7">
              <div className={S.formGroup}>
                <label className={`${S.label} font-bold`}>¿Cuánto entrega el cliente?</label>
                <div className={S.inputGroupWrapper}>
                  <span className={S.inputGroupText}>$</span>
                  <input type="text" placeholder="Ej: 10.000" value={montoPago} onChange={(e) => setMontoPago(formatearPrecioInput(e.target.value))} inputMode="decimal" autoFocus className={S.inputGroupInput} />
                </div>
                {montoPago && !isNaN(parsePrecioInput(montoPago)) && (
                  <div className="mt-2 text-right"><small className="text-slate-500">Saldo restante: <strong className={deudaTotalCliente - parsePrecioInput(montoPago) > 0.01 ? "text-red-600 ml-1" : "text-emerald-600 ml-1"}>{formatearMoneda(Math.max(0, deudaTotalCliente - parsePrecioInput(montoPago)))}</strong></small></div>
                )}
              </div>
              <div className={S.formGroup}>
                <label className={S.label}>Forma de Pago</label>
                <select value={formaPagoPago} onChange={(e) => setFormaPagoPago(e.target.value as FormaPago)} className={S.select}>
                  <option value="efectivo">Efectivo</option><option value="debito">Débito</option><option value="credito">Crédito</option><option value="transferencia">Transferencia</option>
                </select>
              </div>
              {formaPagoPago === "credito" && (
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 mb-3">
                  <label className={S.label}>Interés Tarjeta (%)</label>
                  <div className="flex gap-2 items-center">
                    <input type="number" value={interesPorcentajePago} onChange={(e) => setInteresPorcentajePago(e.target.value)} className={S.input} style={{width:'80px'}} />
                    <span className="text-xs text-slate-500">Se cobrarán <strong>{formatearMoneda(((parsePrecioInput(montoPago)||0) * (parseFloat(interesPorcentajePago)||0)/100))}</strong> extra de interés.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className={S.btnSecondary} onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancelar</button>
          <button className={S.btnSuccess} onClick={handleRegistrarPago} disabled={isSubmitting || !montoPago || !fechaPago}>
            {isSubmitting ? <Spinner size="sm" /> : "Confirmar Pago"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal Cliente */}
      <Modal show={showClienteModal} onHide={() => setShowClienteModal(false)}>
        <Modal.Header closeButton onHide={() => setShowClienteModal(false)} className="modal-header-brand"><Modal.Title>{clienteAEditar ? "Editar Cliente" : "Nuevo Cliente"}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <div className={S.alertDanger}>{error}</div>}
          <div className={S.formGroup}><label className={S.label}>Nombre Completo <span className="text-red-500">*</span></label><input type="text" value={formCliente.nombre} onChange={(e) => setFormCliente({...formCliente, nombre: e.target.value})} className={S.input} /></div>
          <div className={S.formGroup}><label className={S.label}>Teléfono</label><input type="text" value={formCliente.telefono} onChange={(e) => setFormCliente({...formCliente, telefono: e.target.value})} className={S.input} /></div>
          <div className={S.formGroup}><label className={S.label}>Email</label><input type="email" value={formCliente.email} onChange={(e) => setFormCliente({...formCliente, email: e.target.value})} className={S.input} /></div>
          <div className={S.formGroup}><label className={S.label}>Dirección</label><input type="text" value={formCliente.direccion} onChange={(e) => setFormCliente({...formCliente, direccion: e.target.value})} className={S.input} /></div>
        </Modal.Body>
        <Modal.Footer>
          <button className={S.btnSecondary} onClick={() => setShowClienteModal(false)} disabled={isSubmittingCliente}>Cancelar</button>
          <button className={S.btnSuccess} onClick={handleGuardarCliente} disabled={isSubmittingCliente || !formCliente.nombre}>
            {isSubmittingCliente ? <Spinner size="sm" /> : "Guardar Cliente"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CuentasCorrientes;
