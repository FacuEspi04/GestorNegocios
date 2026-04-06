import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle,
  Calendar,
  Banknote,
  CheckCircle,
  Trash2,
  ArrowDownFromLine,
  FileDown,
  Menu,
  Wallet,
  CreditCard,
  ArrowLeftRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  type Venta,
  getVentasPorFecha,
  type VentaEstado,
  type FormaPago,
  deleteVenta,
  getRetirosPorFecha,
  type Retiro,
} from '../../services/apiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatearMoneda, formatearPeso } from "../../utils/formatters";
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Dropdown from '../ui/Dropdown';
import * as S from '../ui/styles';

const VentasList: React.FC = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [retiros, setRetiros] = useState<Retiro[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');

  const [ventaAEliminar, setVentaAEliminar] = useState<Venta | null>(null);
  const [showModalEliminar, setShowModalEliminar] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const getTodayString = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => { setFechaSeleccionada(getTodayString()); }, []);
  useEffect(() => { if (fechaSeleccionada) cargarDatosDelDia(fechaSeleccionada); }, [fechaSeleccionada]);

  const cargarDatosDelDia = async (fecha: string) => {
    setIsLoading(true); setError(null); setExito(null);
    try {
      const [ventasData, retirosData] = await Promise.all([getVentasPorFecha(fecha), getRetirosPorFecha(fecha)]);
      setVentas(ventasData); setRetiros(retirosData);
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los datos del día.');
      setVentas([]); setRetiros([]);
    } finally { setIsLoading(false); }
  };

  const determinarTurno = (fechaHoraISO: Date | string): 'mañana' | 'tarde' | 'fuera' => {
    const fecha = new Date(fechaHoraISO);
    const tiempoEnMinutos = fecha.getHours() * 60 + fecha.getMinutes();
    if (tiempoEnMinutos >= 510 && tiempoEnMinutos <= 810) return 'mañana';
    if (tiempoEnMinutos >= 990 && tiempoEnMinutos <= 1290) return 'tarde';
    return 'fuera';
  };

  // --- CÁLCULOS ---
  const retirosComputados = useMemo(() => {
    const mañana = retiros.filter((r) => determinarTurno(r.fechaHora) === 'mañana');
    const tarde = retiros.filter((r) => determinarTurno(r.fechaHora) === 'tarde');
    return { mañana, tarde };
  }, [retiros]);
  const { mañana: retirosMañana, tarde: retirosTarde } = retirosComputados;
  const totalRetirosMañana = useMemo(() => retirosMañana.reduce((t, r) => t + Number(r.monto), 0), [retirosMañana]);
  const totalRetirosTarde = useMemo(() => retirosTarde.reduce((t, r) => t + Number(r.monto), 0), [retirosTarde]);
  const totalRetirosDelDia = useMemo(() => retiros.reduce((t, r) => t + Number(r.monto), 0), [retiros]);

  const ventasComputadas = useMemo(() => {
    const mañana = ventas.filter((v) => determinarTurno(v.fechaHora) === 'mañana');
    const tarde = ventas.filter((v) => determinarTurno(v.fechaHora) === 'tarde');
    return { mañana, tarde };
  }, [ventas]);
  const { mañana: ventasMañana, tarde: ventasTarde } = ventasComputadas;

  const filtrarVentasCobradas = (lista: Venta[]) => lista.filter(v => v.estado === 'Completada' && !!v.formaPago && Number(v.monto_pagado || 0) > 0);

  const calcularRecaudadoPorFormaPago = (lista: Venta[]) => {
    const totales: { [key: string]: number } = { 'efectivo': 0, 'debito': 0, 'credito': 0, 'transferencia': 0 };
    filtrarVentasCobradas(lista).forEach((v) => {
      const pagado = Number(v.monto_pagado || 0);
      if (pagado > 0 && v.formaPago && totales.hasOwnProperty(v.formaPago)) totales[v.formaPago]! += pagado;
    });
    return totales;
  };

  const totalesDia = useMemo(() => calcularRecaudadoPorFormaPago(ventas), [ventas]);
  const totalesMañana = useMemo(() => calcularRecaudadoPorFormaPago(ventasMañana), [ventasMañana]);
  const totalesTarde = useMemo(() => calcularRecaudadoPorFormaPago(ventasTarde), [ventasTarde]);

  const calcularTotalReal = (lista: Venta[]) => filtrarVentasCobradas(lista).reduce((t, v) => t + Number(v.monto_pagado || 0), 0);

  const totalRecaudadoMañana = useMemo(() => calcularTotalReal(ventasMañana), [ventasMañana]);
  const totalRecaudadoTarde = useMemo(() => calcularTotalReal(ventasTarde), [ventasTarde]);
  const totalRecaudadoDia = useMemo(() => calcularTotalReal(ventas), [ventas]);

  const netoMañana = useMemo(() => totalRecaudadoMañana - totalRetirosMañana, [totalRecaudadoMañana, totalRetirosMañana]);
  const netoTarde = useMemo(() => totalRecaudadoTarde - totalRetirosTarde, [totalRecaudadoTarde, totalRetirosTarde]);
  const netoTotalDia = useMemo(() => totalRecaudadoDia - totalRetirosDelDia, [totalRecaudadoDia, totalRetirosDelDia]);

  const clientesGenerales = useMemo(() => {
    let contador = 0;
    const mapa = new Map<number, string>();
    ventas.forEach((venta) => {
      const nombre = (venta.clienteNombre || '').trim() || 'Cliente General';
      if (nombre === 'Cliente General') { contador += 1; mapa.set(venta.id, `Cliente General ${contador}`); } else { mapa.set(venta.id, nombre); }
    });
    return mapa;
  }, [ventas]);
  const getNombreCliente = (venta: Venta) => clientesGenerales.get(venta.id) || venta.clienteNombre || 'Cliente General';

  // --- FORMATO ---
  const formatearFecha = (fechaISO: string | Date): string => {
    let fecha: Date;
    if (fechaISO instanceof Date) {
      fecha = fechaISO;
    } else if (typeof fechaISO === 'string' && !fechaISO.includes('T')) {
      // Solo fecha "YYYY-MM-DD" → parsear como local para evitar desfase UTC
      const [y, m, d] = fechaISO.split('-').map(Number);
      fecha = new Date(y, m - 1, d);
    } else {
      // DateTime completo (ISO con T) → new Date() lo parsea correctamente
      fecha = new Date(fechaISO);
    }
    return `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
  };
  const formatearHora = (fechaISO: string | Date): string => {
    let fecha: Date;
    if (typeof fechaISO === 'string' && !fechaISO.includes('T')) { const [y, m, d] = fechaISO.split('-').map(Number); fecha = new Date(y, m - 1, d); } else { fecha = new Date(fechaISO); }
    return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  };

  // --- ACTIONS ---
  const abrirModalEliminar = (venta: Venta) => { setVentaAEliminar(venta); setError(null); setShowModalEliminar(true); };
  const confirmarEliminacion = async () => {
    if (!ventaAEliminar) return;
    setIsSubmitting(true); setError(null);
    try {
      await deleteVenta(ventaAEliminar.id);
      setVentas((prev) => prev.filter((v) => v.id !== ventaAEliminar.id));
      setExito(`Venta N° ${ventaAEliminar.numeroVenta} eliminada correctamente.`);
      setTimeout(() => setExito(null), 3000);
      setShowModalEliminar(false); setVentaAEliminar(null);
    } catch (apiError: any) { setError(apiError.message || "No se pudo eliminar la venta."); } finally { setIsSubmitting(false); }
  };
  const cancelarEliminacion = () => { setShowModalEliminar(false); setVentaAEliminar(null); };

  const getEstadoBadge = (venta: Venta) => {
    const pagado = Number(venta.monto_pagado || 0);
    if (pagado > 0 && pagado < Number(venta.total)) return S.badgeWarning;
    if (venta.estado === 'Completada') return S.badgeSuccess;
    return S.badgeDanger;
  };
  const getTextoEstado = (venta: Venta) => {
    const pagado = Number(venta.monto_pagado || 0);
    if (pagado > 0 && pagado < Number(venta.total)) return 'Parcial';
    if (venta.estado === 'Completada') return "Completada";
    return "Pendiente";
  };
  const getFormaPagoBadgeClass = (fp: FormaPago) => {
    const map: Record<string, string> = { 'efectivo': S.badgeSuccess, 'debito': S.badgeInfo, 'credito': S.badgeWarning, 'transferencia': S.badgePrimary };
    return map[fp] || S.badgeSecondary;
  };
  const formatearFormaPago = (fp: FormaPago | null, _e: VentaEstado) => {
    if (!fp) return "Cta. Cte.";
    switch (fp) { case 'efectivo': return "Efectivo"; case 'debito': return "Débito"; case 'credito': return "Crédito"; case 'transferencia': return "Transferencia"; default: return fp; }
  };

  // --- PDF (unchanged logic) ---
  const addPDFHeader = (doc: jsPDF, title: string, _fechaForm: string) => {
    const margin = 14; doc.setFillColor(30, 41, 59); doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text(title, margin, 20);
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const rightText = `Generado: ${formatearFecha(new Date())} - ${formatearHora(new Date())}`;
    doc.text(rightText, doc.internal.pageSize.width - margin - doc.getTextWidth(rightText), 20);
    doc.setTextColor(50, 50, 50);
  };
  const handleDownloadPDF = () => {
    if (isLoading || (ventas.length === 0 && retiros.length === 0)) return;
    const doc = new jsPDF(); const margin = 14;
    addPDFHeader(doc, 'Resumen General de Caja', formatearFecha(fechaSeleccionada));
    let currentY = 40;
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text("Totales Generales del Día", margin, currentY);
    autoTable(doc, {
      startY: currentY + 4,
      head: [['Concepto', 'Monto']],
      body: [
        ['Recaudación: Efectivo', formatearMoneda(totalesDia.efectivo)],
        ['Recaudación: Débito', formatearMoneda(totalesDia.debito)],
        ['Recaudación: Crédito', formatearMoneda(totalesDia.credito)],
        ['Recaudación: Transferencia', formatearMoneda(totalesDia.transferencia)],
        ['Total Facturado (Ingresos Reales)', formatearMoneda(totalRecaudadoDia)],
        ['Total Retiros de Caja', `-${formatearMoneda(totalRetirosDelDia)}`],
        ['NETO EN CAJA', formatearMoneda(netoTotalDia)]
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], halign: 'left', fontSize: 11 },
      bodyStyles: { fontStyle: 'bold', fontSize: 11 },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
      margin: { left: margin, right: margin },
      didParseCell: (data) => {
        if (data.row.index >= 4 && data.section === 'body') { data.cell.styles.fillColor = [240, 240, 240]; data.cell.styles.textColor = [30, 41, 59]; }
      }
    });
    doc.save(`ResumenCaja_${fechaSeleccionada}.pdf`);
  };

  const handleDownloadPDFMañana = () => {
    if (isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)) return;
    const doc = new jsPDF(); const margin = 14;
    addPDFHeader(doc, 'Resumen Turno Mañana', formatearFecha(fechaSeleccionada));
    let currentY = 40;
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text("Totales del Turno Mañana", margin, currentY);
    autoTable(doc, {
      startY: currentY + 4,
      head: [['Concepto', 'Monto']],
      body: [
        ['Recaudación: Efectivo', formatearMoneda(totalesMañana.efectivo)],
        ['Recaudación: Débito', formatearMoneda(totalesMañana.debito)],
        ['Recaudación: Crédito', formatearMoneda(totalesMañana.credito)],
        ['Recaudación: Transferencia', formatearMoneda(totalesMañana.transferencia)],
        ['Total Facturado (Ingresos Reales)', formatearMoneda(totalRecaudadoMañana)],
        ['Total Retiros de Caja', `-${formatearMoneda(totalRetirosMañana)}`],
        ['NETO EN CAJA', formatearMoneda(netoMañana)]
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], halign: 'left', fontSize: 11 },
      bodyStyles: { fontStyle: 'bold', fontSize: 11 },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
      margin: { left: margin, right: margin },
      didParseCell: (data) => {
        if (data.row.index >= 4 && data.section === 'body') { data.cell.styles.fillColor = [240, 240, 240]; data.cell.styles.textColor = [30, 41, 59]; }
      }
    });
    doc.save(`ResumenCajaMañana_${fechaSeleccionada}.pdf`);
  };

  const handleDownloadPDFAuditoria = () => {
    if (isLoading || (ventas.length === 0 && retiros.length === 0)) return;
    const doc = new jsPDF(); const margin = 14;

    // Separar ventas normales de pagos de cuenta corriente
    const ventasNormales = ventas.filter(v => v.items && v.items.length > 0);
    const pagosCuentaCorriente = ventas.filter(v => !v.items || v.items.length === 0);

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("Movimientos del día", margin, 18);

    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const subtitulo = `Emisión: ${formatearFecha(new Date())} ${formatearHora(new Date())}`;
    doc.text(subtitulo, margin, 28);

    let currentY = 50;
    doc.setTextColor(50, 50, 50);

    let seccionNumero = 1;

    // Sección 1: Retiros de Caja
    if (retiros.length > 0) {
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text(`${seccionNumero}. Detalle de Retiros de Caja`, margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'Motivo', 'Monto']],
        body: retiros.map(r => [formatearHora(r.fechaHora), r.motivo, formatearMoneda(r.monto)]),
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85], halign: 'left', fontSize: 10 },
        columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 12;
      seccionNumero++;
    }

    // Sección 2: Ventas Normales
    if (ventasNormales.length > 0) {
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text(`${seccionNumero}. Detalle de Ventas`, margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'N° Venta', 'Cliente', 'Forma Pago', 'Artículos', 'Total']],
        body: ventasNormales.flatMap((v) => {
          const total = formatearMoneda(Number(v.total));
          const items = (v.items || []).map(i => `${i.articulo?.esPesable ? formatearPeso(Number(i.cantidad)) : i.cantidad}x ${i.articulo?.nombre || 'Art'}`);
          const itemsTxt = items.length > 1 ? items.map(item => `• ${item}`).join('\n') : (items[0] || '-');
          return [[
            formatearHora(v.fechaHora),
            v.numeroVenta?.toString() || v.id.toString(),
            getNombreCliente(v),
            formatearFormaPago(v.formaPago, v.estado),
            itemsTxt,
            total
          ]];
        }),
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85], halign: 'left', fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: { 5: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 12;
      seccionNumero++;
    }

    // Sección 3: Cobro de Deuda
    if (pagosCuentaCorriente.length > 0) {
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text(`${seccionNumero}. Cobro de Deuda`, margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'N° Venta', 'Cliente', 'Forma Pago', 'Tipo', 'Monto']],
        body: pagosCuentaCorriente.map((v) => {
          // Determinar si es pago parcial o total
          // Si monto_pagado < total, es parcial; si monto_pagado == total, es total
          const montoPagado = Number(v.monto_pagado || 0);
          const totalVenta = Number(v.total || 0);
          const esPagoTotal = montoPagado >= totalVenta;
          const tipoPago = esPagoTotal ? 'Total' : 'Parcial';
          
          return [
            formatearHora(v.fechaHora),
            v.numeroVenta?.toString() || v.id.toString(),
            getNombreCliente(v),
            formatearFormaPago(v.formaPago, v.estado),
            tipoPago,
            formatearMoneda(Number(v.total))
          ];
        }),
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85], halign: 'left', fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: { 5: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: margin, right: margin }
      });
    }

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`MovimientosDelDia_${fechaSeleccionada}.pdf`);
  };

  return (
    <div>
      <div className="mt-2">
        <div className={`${S.card} mb-3`}>
          <div className={S.cardHeader}>
            <h5 className="text-base font-semibold">Resumen de Caja</h5>
            {/* Desktop buttons */}
            <div className="hidden md:flex gap-2">
              <Dropdown>
                <Dropdown.Toggle size="sm"><FileDown size={14} className="mr-1" /> Descargar PDF</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleDownloadPDF} disabled={isLoading || ventas.length === 0}>Día Completo (Resumen)</Dropdown.Item>
                  <Dropdown.Item onClick={handleDownloadPDFMañana} disabled={isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)}>Turno mañana (Resumen)</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleDownloadPDFAuditoria} disabled={isLoading || (ventas.length === 0 && retiros.length === 0)}>Movimientos del día (Detalle)</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button className={S.btnOutlineDanger} onClick={() => navigate("/ventas/nuevo-retiro")}><ArrowDownFromLine size={14} className="mr-1" /> Retiros</button>
              <button className={S.btnWarning} onClick={() => navigate("/ventas/cuentas-corrientes")}><Banknote size={14} className="mr-1" /> Cuentas Ctes</button>
              <button className={S.btnSuccess} onClick={() => navigate("/ventas/nueva")}><PlusCircle size={14} className="mr-1" /> Nueva Venta</button>
            </div>
            {/* Mobile menu */}
            <div className="flex md:hidden">
              <Dropdown>
                <Dropdown.Toggle size="sm"><Menu size={18} /></Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={handleDownloadPDF} disabled={isLoading || ventas.length === 0}><FileDown size={16} className="mr-2 inline" /> Resumen (Día)</Dropdown.Item>
                  <Dropdown.Item onClick={handleDownloadPDFMañana} disabled={isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)}><FileDown size={16} className="mr-2 inline" /> Resumen (Mañana)</Dropdown.Item>
                  <Dropdown.Item onClick={handleDownloadPDFAuditoria} disabled={isLoading || (ventas.length === 0 && retiros.length === 0)}><FileDown size={16} className="mr-2 inline text-brand-600" /> Movimientos (Detalle)</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate("/ventas/nuevo-retiro")}><ArrowDownFromLine size={16} className="mr-2 inline text-red-500" /> Retiros</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/ventas/cuentas-corrientes")}><Banknote size={16} className="mr-2 inline text-amber-600" /> Cuentas Ctes</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/ventas/nueva")}><PlusCircle size={16} className="mr-2 inline text-emerald-600" /> Nueva Venta</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className={S.cardBody}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col justify-end">
                <label className={S.label}><Calendar size={14} className="inline mr-1" /> Seleccionar Fecha</label>
                <input type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} max={new Date().toISOString().split("T")[0]} className={S.input} />
              </div>
              <div className="flex flex-col justify-end">
                <div className={`${S.alertInfo} mb-0 w-full py-2`}>
                  <strong>Fecha:</strong> {fechaSeleccionada ? formatearFecha(fechaSeleccionada) : "Ninguna"}
                </div>
              </div>
            </div>

            {exito && <div className={S.alertSuccess}><CheckCircle size={24} className="shrink-0" /> {exito}</div>}
            {error && <div className={S.alertDanger}><span className="flex-1">{error}</span><button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-2 cursor-pointer">✕</button></div>}

            {isLoading ? (
              <div className="text-center py-10"><Spinner /></div>
            ) : (ventas.length > 0 || retiros.length > 0) ? (
              <>
                {ventas.length > 0 ? (
                  <>
                    <h5 className="font-semibold mb-3">Ventas del Día</h5>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-4">
                      <table className={S.table}>
                        <thead className={S.tableHeaderBrand}>
                          <tr>
                            <th className={S.th}>Hora</th><th className={S.th}>Cliente</th><th className={S.th}>Turno</th>
                            <th className={S.th}>Artículos</th><th className={S.th}>Pago</th><th className={S.th}>Total Venta</th>
                            <th className={S.th}>Estado</th><th className={S.th}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventas.map((venta) => {
                            const isRecibo = venta.estado === 'Completada' && (!venta.items || venta.items.length === 0) && !venta.clienteId;
                            return (
                              <tr key={venta.id} className={`${S.trStriped} ${S.trHover}`}>
                                <td className={S.td}>{formatearHora(venta.fechaHora)}</td>
                                <td className={S.td}>{getNombreCliente(venta)}</td>
                                <td className={`${S.td} capitalize`}>{determinarTurno(venta.fechaHora)}</td>
                                <td className={S.td}>{isRecibo ? <span className={S.badgeInfo}>COBRO DE DEUDA</span> : <small>{venta.items?.length || 0} items</small>}</td>
                                <td className={S.td}><span className={venta.formaPago ? getFormaPagoBadgeClass(venta.formaPago) : S.badgeSecondary}>{formatearFormaPago(venta.formaPago, venta.estado)}</span></td>
                                <td className={S.td}>
                                  <div><strong>{formatearMoneda(Number(venta.total))}</strong></div>
                                  {Number(venta.monto_pagado) < Number(venta.total) && <small className="text-slate-500">Pagado: {formatearMoneda(Number(venta.monto_pagado))}</small>}
                                </td>
                                <td className={S.td}><span className={getEstadoBadge(venta)}>{getTextoEstado(venta)}</span></td>
                                <td className={S.td}><button className={S.btnOutlineDanger} onClick={() => abrirModalEliminar(venta)}><Trash2 size={14} /></button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : <div className={`${S.alertInfo} mb-4`}>No hay ventas hoy.</div>}

                {/* Tabla detallada de Retiros */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      <ArrowDownFromLine size={16} className="text-red-500" />
                      Retiros de Caja
                    </h5>
                    {retiros.length > 0 && (
                      <span className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                        Total: -{formatearMoneda(totalRetirosDelDia)}
                      </span>
                    )}
                  </div>
                  {retiros.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-red-200">
                      <table className={S.table}>
                        <thead className="bg-red-700 text-white">
                          <tr>
                            <th className={`${S.th} !text-white`}>Fecha y Hora</th>
                            <th className={`${S.th} !text-white`}>Motivo / Descripción</th>
                            <th className={`${S.th} !text-white`}>Forma de Pago</th>
                            <th className={`${S.th} !text-white text-right`}>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {retiros.map((r) => {
                            const fechaHoraFmt = `${formatearFecha(r.fechaHora)} ${formatearHora(r.fechaHora)}`;
                            const fpLabel = (() => {
                              switch (r.formaPago?.toLowerCase()) {
                                case 'efectivo': return 'Efectivo';
                                case 'debito': return 'Débito';
                                case 'credito': return 'Crédito';
                                case 'transferencia': return 'Transferencia';
                                default: return r.formaPago || 'Efectivo';
                              }
                            })();
                            const fpBadge = (() => {
                              switch (r.formaPago?.toLowerCase()) {
                                case 'efectivo': return S.badgeSuccess;
                                case 'debito': return S.badgeInfo;
                                case 'credito': return S.badgeWarning;
                                case 'transferencia': return S.badgePrimary;
                                default: return S.badgeSecondary;
                              }
                            })();
                            return (
                              <tr key={r.id} className={`${S.trStriped} ${S.trHover}`}>
                                <td className={`${S.td} text-slate-600 text-sm`}>{fechaHoraFmt}</td>
                                <td className={`${S.td} font-medium`}>{r.motivo}</td>
                                <td className={S.td}><span className={fpBadge}>{fpLabel}</span></td>
                                <td className={`${S.td} text-right font-bold text-red-600`}>-{formatearMoneda(r.monto)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-red-50">
                          <tr>
                            <td colSpan={3} className={`${S.td} text-right font-bold text-slate-700`}>Total Retiros:</td>
                            <td className={`${S.td} text-right font-bold text-red-600 text-base`}>-{formatearMoneda(totalRetirosDelDia)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm">
                      <ArrowDownFromLine size={14} className="shrink-0" />
                      No se registraron retiros para esta fecha.
                    </div>
                  )}
                </div>

                {/* Totales del día */}
                <div className="totales-card rounded-xl p-5 mb-4">
                  <h5 className="font-semibold mb-3">Totales del día</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Wallet size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wide">Efectivo</span>
                      </div>
                      <strong className="text-slate-800">{formatearMoneda(totalesDia.efectivo)}</strong>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-1.5 text-sky-600">
                        <CreditCard size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wide">Débito</span>
                      </div>
                      <strong className="text-slate-800">{formatearMoneda(totalesDia.debito)}</strong>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <CreditCard size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wide">Crédito</span>
                      </div>
                      <strong className="text-slate-800">{formatearMoneda(totalesDia.credito)}</strong>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <ArrowLeftRight size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wide">Transferencia</span>
                      </div>
                      <strong className="text-slate-800">{formatearMoneda(totalesDia.transferencia)}</strong>
                    </div>
                  </div>
                  <hr className="border-slate-200 my-3" />
                  <div className="flex justify-between items-center"><h6 className="font-semibold">Total Ventas</h6><h5 className="text-emerald-600 font-bold">{formatearMoneda(totalRecaudadoDia)}</h5></div>
                  <div className="flex justify-between items-center mt-2 text-red-600"><h6 className="font-semibold">Total Retiros</h6><h5 className="font-bold">-{formatearMoneda(totalRetirosDelDia)}</h5></div>
                  <hr className="border-slate-200 my-3" />
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h5 className="font-bold text-brand-500">NETO EN CAJA</h5>
                    <h3 className="font-bold text-brand-500 text-2xl">{formatearMoneda(netoTotalDia)}</h3>
                  </div>
                </div>

                {/* Turnos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4">
                    <h6 className="font-bold text-blue-600 mb-2">Turno Mañana</h6>
                    <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
                      <span>Efectivo: {formatearMoneda(totalesMañana.efectivo)}</span><span>Débito: {formatearMoneda(totalesMañana.debito)}</span>
                      <span>Crédito: {formatearMoneda(totalesMañana.credito)}</span><span>Transferencia: {formatearMoneda(totalesMañana.transferencia)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold"><span>Ventas:</span><span>{formatearMoneda(totalRecaudadoMañana)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Retiros:</span><span>-{formatearMoneda(totalRetirosMañana)}</span></div>
                    <hr className="my-1 border-blue-200" />
                    <div className="flex justify-between font-bold text-blue-600"><span>Neto Mañana:</span><span>{formatearMoneda(netoMañana)}</span></div>
                  </div>
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4">
                    <h6 className="font-bold text-amber-700 mb-2">Turno Tarde</h6>
                    <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
                      <span>Efectivo: {formatearMoneda(totalesTarde.efectivo)}</span><span>Débito: {formatearMoneda(totalesTarde.debito)}</span>
                      <span>Crédito: {formatearMoneda(totalesTarde.credito)}</span><span>Transferencia: {formatearMoneda(totalesTarde.transferencia)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold"><span>Ventas:</span><span>{formatearMoneda(totalRecaudadoTarde)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Retiros:</span><span>-{formatearMoneda(totalRetirosTarde)}</span></div>
                    <hr className="my-1 border-amber-200" />
                    <div className="flex justify-between font-bold text-amber-700"><span>Neto Tarde:</span><span>{formatearMoneda(netoTarde)}</span></div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`${S.alertWarning} text-center`}>No hay movimientos para esta fecha.</div>
            )}
          </div>
        </div>

        <Modal show={showModalEliminar} onHide={cancelarEliminacion}>
          <Modal.Header closeButton onHide={cancelarEliminacion}><Modal.Title>Eliminar Venta</Modal.Title></Modal.Header>
          <Modal.Body>
            <p>¿Seguro? Se devolverá el stock.</p>
            {ventaAEliminar && <p>Total: {formatearMoneda(ventaAEliminar.total)}</p>}
          </Modal.Body>
          <Modal.Footer>
            <button className={S.btnSecondary} onClick={cancelarEliminacion}>Cancelar</button>
            <button className={S.btnDanger} onClick={confirmarEliminacion} disabled={isSubmitting}>Confirmar</button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VentasList;
