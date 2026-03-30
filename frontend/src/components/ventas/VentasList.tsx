import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  Badge,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Modal,
  Spinner,
  Dropdown,
} from 'react-bootstrap';
import {
  PlusCircle,
  Calendar,
  Banknote,
  CheckCircle,
  Trash2,
  ArrowDownFromLine,
  FileDown,
  Menu,
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

  useEffect(() => {
    setFechaSeleccionada(getTodayString());
  }, []);

  useEffect(() => {
    if (fechaSeleccionada) {
      cargarDatosDelDia(fechaSeleccionada);
    }
  }, [fechaSeleccionada]);

  const cargarDatosDelDia = async (fecha: string) => {
    setIsLoading(true);
    setError(null);
    setExito(null); 
    try {
      const [ventasData, retirosData] = await Promise.all([
        getVentasPorFecha(fecha),
        getRetirosPorFecha(fecha)
      ]);
      
      setVentas(ventasData);
      setRetiros(retirosData);
      
    } catch (err: any) {
      console.error('Error al cargar datos del día:', err);
      setError(err.message || 'No se pudieron cargar los datos del día.');
      setVentas([]);
      setRetiros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const determinarTurno = (fechaHoraISO: Date | string): 'mañana' | 'tarde' | 'fuera' => {
    const fecha = new Date(fechaHoraISO);
    const h = fecha.getHours();
    const m = fecha.getMinutes();
    const tiempoEnMinutos = h * 60 + m;
    if (tiempoEnMinutos >= 510 && tiempoEnMinutos <= 810) return 'mañana';
    if (tiempoEnMinutos >= 990 && tiempoEnMinutos <= 1290) return 'tarde';
    return 'fuera';
  };
  
  // --- CÁLCULOS RETIROS ---
  const retirosComputados = useMemo(() => {
    const mañana = retiros.filter((r) => determinarTurno(r.fechaHora) === 'mañana');
    const tarde = retiros.filter((r) => determinarTurno(r.fechaHora) === 'tarde');
    return { mañana, tarde };
  }, [retiros]);

  const { mañana: retirosMañana, tarde: retirosTarde } = retirosComputados;

  const totalRetirosMañana = useMemo(() => retirosMañana.reduce((total, r) => total + Number(r.monto), 0), [retirosMañana]);
  const totalRetirosTarde = useMemo(() => retirosTarde.reduce((total, r) => total + Number(r.monto), 0), [retirosTarde]);
  const totalRetirosDelDia = useMemo(() => retiros.reduce((total, r) => total + Number(r.monto), 0), [retiros]);

  // --- CÁLCULOS DE VENTAS ---
  const ventasComputadas = useMemo(() => {
    const mañana = ventas.filter((v) => determinarTurno(v.fechaHora) === 'mañana');
    const tarde = ventas.filter((v) => determinarTurno(v.fechaHora) === 'tarde');
    return { mañana, tarde };
  }, [ventas]);

  const { mañana: ventasMañana, tarde: ventasTarde } = ventasComputadas;

  const filtrarVentasCobradas = (listaVentas: Venta[]) => {
    return listaVentas.filter(
      (venta) => venta.estado === 'Completada' && !!venta.formaPago && Number(venta.monto_pagado || 0) > 0,
    );
  };

  // Función auxiliar: Solo sumar ventas efectivamente cobradas
  const calcularRecaudadoPorFormaPago = (listaVentas: Venta[]) => {
    const totales: { [key: string]: number } = {
      'efectivo': 0, 'debito': 0, 'credito': 0, 'transferencia': 0,
    };
    filtrarVentasCobradas(listaVentas).forEach((venta) => {
      const pagado = Number(venta.monto_pagado || 0);
      const formaPago = venta.formaPago;
      
      if (pagado > 0 && formaPago && totales.hasOwnProperty(formaPago)) {
        totales[formaPago]! += pagado;
      }
    });
    return totales;
  };

  const totalesDia = useMemo(() => calcularRecaudadoPorFormaPago(ventas), [ventas]);
  const totalesMañana = useMemo(() => calcularRecaudadoPorFormaPago(ventasMañana), [ventasMañana]);
  const totalesTarde = useMemo(() => calcularRecaudadoPorFormaPago(ventasTarde), [ventasTarde]);

  const calcularTotalReal = (lista: Venta[]) => {
    return filtrarVentasCobradas(lista).reduce((total, v) => {
      return total + Number(v.monto_pagado || 0);
    }, 0);
  };

  const totalRecaudadoMañana = useMemo(() => calcularTotalReal(ventasMañana), [ventasMañana]);
  const totalRecaudadoTarde = useMemo(() => calcularTotalReal(ventasTarde), [ventasTarde]);
  const totalRecaudadoDia = useMemo(() => calcularTotalReal(ventas), [ventas]);
  // -------------------------------

  const netoMañana = useMemo(() => totalRecaudadoMañana - totalRetirosMañana, [totalRecaudadoMañana, totalRetirosMañana]);
  const netoTarde = useMemo(() => totalRecaudadoTarde - totalRetirosTarde, [totalRecaudadoTarde, totalRetirosTarde]);
  const netoTotalDia = useMemo(() => totalRecaudadoDia - totalRetirosDelDia, [totalRecaudadoDia, totalRetirosDelDia]);

  const clientesGenerales = useMemo(() => {
    let contador = 0;
    const mapa = new Map<number, string>();
    ventas.forEach((venta) => {
      const nombre = (venta.clienteNombre || '').trim() || 'Cliente General';
      if (nombre === 'Cliente General') {
        contador += 1;
        mapa.set(venta.id, `Cliente General ${contador}`);
      } else {
        mapa.set(venta.id, nombre);
      }
    });
    return mapa;
  }, [ventas]);

  const getNombreCliente = (venta: Venta) => {
    return clientesGenerales.get(venta.id) || venta.clienteNombre || 'Cliente General';
  };

  // --- FORMATO ---
  const formatearFecha = (fechaISO: string | Date): string => {
    let fecha: Date;
    if (typeof fechaISO === 'string') {
      const [year, month, day] = fechaISO.split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    } else {
      fecha = fechaISO;
    }
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = fecha.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatearHora = (fechaISO: string | Date): string => {
    let fecha: Date;
    if (typeof fechaISO === 'string' && !fechaISO.includes('T')) {
      const [year, month, day] = fechaISO.split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    } else {
      fecha = new Date(fechaISO);
    }
    return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  };

  const abrirModalEliminar = (venta: Venta) => {
    setVentaAEliminar(venta);
    setError(null);
    setShowModalEliminar(true);
  };
  const confirmarEliminacion = async () => {
    if (!ventaAEliminar) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await deleteVenta(ventaAEliminar.id);
      setVentas((prev) => prev.filter((v) => v.id !== ventaAEliminar.id));
      setExito(`Venta N° ${ventaAEliminar.numeroVenta} eliminada correctamente.`);
      setTimeout(() => setExito(null), 3000);
      setShowModalEliminar(false);
      setVentaAEliminar(null);
    } catch (apiError: any) {
      console.error("Error al eliminar:", apiError);
      setError(apiError.message || "No se pudo eliminar la venta.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const cancelarEliminacion = () => {
    setShowModalEliminar(false);
    setVentaAEliminar(null);
  };

  const getEstadoBadge = (venta: Venta) => {
    const total = Number(venta.total);
    const pagado = Number(venta.monto_pagado || 0);
    if (pagado > 0 && pagado < total) return "warning";
    if (venta.estado === 'Completada') return "success";
    return "danger";
  };

  const getTextoEstado = (venta: Venta) => {
    const total = Number(venta.total);
    const pagado = Number(venta.monto_pagado || 0);
    if (pagado > 0 && pagado < total) return 'Parcial';
    if (venta.estado === 'Completada') return "Completada";
    return "Pendiente";
  };

  const getFormaPagoBadge = (formaPago: FormaPago) => {
    const badges: { [key: string]: string } = {
      'efectivo': "success",
      'debito': "info",
      'credito': "warning",
      'transferencia': "primary",
    };
    return badges[formaPago] || "secondary";
  };

  const formatearFormaPago = (formaPago: FormaPago | null, _estado: VentaEstado) => {
    if (!formaPago) return "Cta. Cte.";
    switch (formaPago) {
      case 'efectivo': return "Efectivo";
      case 'debito': return "Débito";
      case 'credito': return "Crédito";
      case 'transferencia': return "Transferencia";
      default: return formaPago;
    }
  };

  const addPDFHeader = (doc: jsPDF, title: string, _fechaForm: string) => {
    const margin = 14;
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(title, margin, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const rightText = `Generado: ${formatearFecha(new Date())} - ${formatearHora(new Date())}`;
    const textWidth = doc.getTextWidth(rightText);
    doc.text(rightText, doc.internal.pageSize.width - margin - textWidth, 20);
    
    doc.setTextColor(50, 50, 50);
  };

  const buildDetalleVentasBody = (lista: Venta[]) => {
    return lista.flatMap((v) => {
      const filaVenta = [
        formatearHora(v.fechaHora),
        getNombreCliente(v),
        formatearFormaPago(v.formaPago, v.estado),
        formatearMoneda(Number(v.total)),
      ];

      const filasItems = (v.items || []).map((it) => {
        const cantidadTxt = it.articulo?.esPesable
          ? formatearPeso(Number(it.cantidad))
          : String(it.cantidad);

        return [
          `→ ${cantidadTxt} ${it.articulo?.nombre ?? 'Artículo'}`,
          '',
          `@ ${formatearMoneda(Number(it.precioUnitario))}`,
          formatearMoneda(Number(it.subtotal)),
        ];
      });

      return [filaVenta, ...filasItems];
    });
  };

  const handleDownloadPDF = () => {
    if (isLoading || (ventas.length === 0 && retiros.length === 0)) return;
    const doc = new jsPDF();
    const margin = 14;
    
    addPDFHeader(doc, 'Resumen General de Caja', formatearFecha(fechaSeleccionada));

    let currentY = 40;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Totales Generales del Día", margin, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Concepto', 'Monto']],
      body: [
        ['Total Recaudado (Ingresos Reales)', formatearMoneda(totalRecaudadoDia)],
        ['Total Retiros de Caja', `-${formatearMoneda(totalRetirosDelDia)}`],
        ['NETO EN CAJA', formatearMoneda(netoTotalDia)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], halign: 'left', fontSize: 11 },
      bodyStyles: { fontStyle: 'bold', fontSize: 11 },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
      margin: { left: margin, right: margin },
      didParseCell: function (data) {
        if (data.row.index === 2 && data.section === 'body') {
           data.cell.styles.fillColor = [240, 240, 240];
           data.cell.styles.textColor = [30, 41, 59];
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;

    if (retiros.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detalle de Retiros", margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'Motivo', 'Medio de Pago', 'Monto']],
        body: retiros.map(r => [
          formatearHora(r.fechaHora),
          r.motivo.length > 30 ? r.motivo.substring(0, 30) + '...' : r.motivo,
          ((r as any).formaPago || 'Efectivo').toUpperCase(),
          formatearMoneda(r.monto)
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], halign: 'left', fontSize: 10 },
        bodyStyles: { fontSize: 10 },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 12;
    }

    if (ventas.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detalle de Movimientos de Venta", margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'Cliente', 'Forma Pago', 'Total Venta']],
        body: buildDetalleVentasBody(ventas),
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], halign: 'left', fontSize: 10 },
        bodyStyles: { fontSize: 10 },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        didParseCell: (data) => {
          if (data.section !== 'body') return;
          const raw = String(data.cell.raw || '');
          if (raw.startsWith('→')) {
            data.cell.styles.fontSize = 8;
            data.cell.styles.textColor = [100, 100, 100];
            data.cell.styles.fillColor = [248, 248, 248];
            data.cell.styles.lineColor = [220, 220, 220];
            data.cell.styles.lineWidth = 0.1;
            return;
          }

          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [235, 239, 245];
          data.cell.styles.textColor = [30, 41, 59];
        },
        margin: { left: margin, right: margin }
      });
    }

    doc.save(`ResumenCaja_${fechaSeleccionada}.pdf`);
  };

  const handleDownloadPDFMañana = () => {
    if (isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)) return;
    const doc = new jsPDF();
    const margin = 14;
    
    addPDFHeader(doc, 'Resumen Caja - Turno Mañana', formatearFecha(fechaSeleccionada));

    let currentY = 40;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Totales Generales (Turno Mañana)", margin, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Concepto', 'Monto']],
      body: [
        ['Total Recaudado', formatearMoneda(totalRecaudadoMañana)],
        ['Total Retiros', `-${formatearMoneda(totalRetirosMañana)}`],
        ['NETO EN CAJA', formatearMoneda(netoMañana)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], halign: 'left' },
      bodyStyles: { fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
      margin: { left: margin, right: margin },
      didParseCell: function (data) {
        if (data.row.index === 2 && data.section === 'body') {
           data.cell.styles.fillColor = [240, 240, 240];
           data.cell.styles.textColor = [30, 41, 59];
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(14);
    doc.text("Resumen por Forma de Pago", margin, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Forma de Pago', 'Monto']],
      body: [
        ['Efectivo', formatearMoneda(totalesMañana.efectivo)],
        ['Débito', formatearMoneda(totalesMañana.debito)],
        ['Crédito', formatearMoneda(totalesMañana.credito)],
        ['Transferencia', formatearMoneda(totalesMañana.transferencia)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], halign: 'left' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
      margin: { left: margin, right: margin }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
    if (retirosMañana.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detalle de Retiros (Turno Mañana)", margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'Motivo', 'Medio de Pago', 'Monto']],
        body: retirosMañana.map(r => [
          formatearHora(r.fechaHora),
          r.motivo.length > 30 ? r.motivo.substring(0, 30) + '...' : r.motivo,
          ((r as any).formaPago || 'Efectivo').toUpperCase(),
          formatearMoneda(r.monto)
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } }
      });
      currentY = (doc as any).lastAutoTable.finalY + 12;
    }

    if (ventasMañana.length > 0) {
      doc.setFontSize(14);
      doc.text("Detalle de Ventas (Turno Mañana)", margin, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Hora', 'Cliente', 'Forma Pago', 'Total']],
        body: buildDetalleVentasBody(ventasMañana),
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], halign: 'left' },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        didParseCell: (data) => {
          if (data.section !== 'body') return;
          const raw = String(data.cell.raw || '');
          if (raw.startsWith('→')) {
            data.cell.styles.fontSize = 8;
            data.cell.styles.textColor = [100, 100, 100];
            data.cell.styles.fillColor = [248, 248, 248];
            data.cell.styles.lineColor = [220, 220, 220];
            data.cell.styles.lineWidth = 0.1;
            return;
          }

          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [235, 239, 245];
          data.cell.styles.textColor = [30, 41, 59];
        }
      });
    }

    doc.save(`ResumenCajaMañana_${fechaSeleccionada}.pdf`);
  };

  return (
    <div>

      <div className="mt-4">
        <Card className="shadow-sm mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Resumen de Caja</h5>
            {/* Desktop View: Botones visibles solo en pantallas medianas o grandes */}
            <div className="d-none d-md-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle size="sm" variant="outline-secondary" className="boton-marron d-flex align-items-center">
                  <FileDown size={14} className="me-1" /> Descargar PDF
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleDownloadPDF} disabled={isLoading || ventas.length === 0}>
                    Día Completo
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDownloadPDFMañana} disabled={isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)}>
                    Turno mañana
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              <Button variant="outline-danger" size="sm" onClick={() => navigate("/ventas/nuevo-retiro")}>
                <ArrowDownFromLine size={14} className="me-1" /> Retiros
              </Button>
              <Button variant="warning" size="sm" onClick={() => navigate("/ventas/cuentas-corrientes")}>
                <Banknote size={14} className="me-1" /> Cuentas Ctes
              </Button>
              <Button variant="success" size="sm" onClick={() => navigate("/ventas/nueva")}>
                <PlusCircle className="me-1" /> Nueva Venta
              </Button>
            </div>

            {/* Mobile View: Menú hamburguesa unificado visible solo en celulares */}
            <div className="d-flex d-md-none">
              <Dropdown>
                <Dropdown.Toggle size="sm" variant="outline-secondary" className="d-flex align-items-center justify-content-center p-2">
                  <Menu size={18} />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item className="d-flex align-items-center py-2" onClick={handleDownloadPDF} disabled={isLoading || ventas.length === 0}>
                    <FileDown size={16} className="me-2" /> Descargar PDF (Día)
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex align-items-center py-2" onClick={handleDownloadPDFMañana} disabled={isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)}>
                    <FileDown size={16} className="me-2" /> Descargar PDF (Mañana)
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="d-flex align-items-center py-2 text-danger" onClick={() => navigate("/ventas/nuevo-retiro")}>
                    <ArrowDownFromLine size={16} className="me-2" /> Retiros
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex align-items-center py-2" onClick={() => navigate("/ventas/cuentas-corrientes")} style={{ color: "var(--bs-warning-text)" }}>
                    <Banknote size={16} className="me-2" /> Cuentas Ctes
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex align-items-center py-2 text-success" onClick={() => navigate("/ventas/nueva")}>
                    <PlusCircle size={16} className="me-2" /> Nueva Venta
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label><Calendar className="me-2" /> Seleccionar Fecha</Form.Label>
                  <Form.Control type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Alert variant="info" className="mb-0 w-100 p-2">
                  <strong>Fecha:</strong> {fechaSeleccionada ? formatearFecha(fechaSeleccionada) : "Ninguna"}
                </Alert>
              </Col>
            </Row>
            
             {exito && (
               <Alert variant="success" className="d-flex align-items-center">
                 <CheckCircle size={24} className="me-2" /> {exito}
               </Alert>
             )}
             {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            {isLoading ? (
              <div className="text-center my-5"><Spinner animation="border" variant="success" /></div>
            ) : (ventas.length > 0 || retiros.length > 0) ? (
              <>
                {ventas.length > 0 ? (
                <>
                  <h5 className="mb-3">Ventas del Día</h5>
                  <Table striped bordered hover responsive>
                    <thead className="table-header-brand">
                      <tr>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Turno</th> 
                        <th>Articulos</th>
                        <th>Pago</th>
                        <th>Total Venta</th>
                        <th>Estado</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((venta) => {
                        const isRecibo =
                          venta.estado === 'Completada' &&
                          (!venta.items || venta.items.length === 0) &&
                          !venta.clienteId;

                        return (
                        <tr key={venta.id}>
                          <td>{formatearHora(venta.fechaHora)}</td>
                          <td>{getNombreCliente(venta)}</td>
                          <td style={{ textTransform: 'capitalize' }}>
                            {determinarTurno(venta.fechaHora)}
                          </td>
                          <td>
                            {isRecibo ? (
                              <Badge bg="info">COBRO DE DEUDA</Badge>
                            ) : (
                              <small>{venta.items?.length || 0} items</small>
                            )}
                          </td>
                          <td>
                             <Badge bg={venta.formaPago ? getFormaPagoBadge(venta.formaPago) : 'secondary'}>
                               {formatearFormaPago(venta.formaPago, venta.estado)}
                             </Badge>
                          </td>
                          <td>
                             <div><strong>{formatearMoneda(Number(venta.total))}</strong></div>
                             {Number(venta.monto_pagado) < Number(venta.total) && (
                               <small className="text-muted">Pagado: {formatearMoneda(Number(venta.monto_pagado))}</small>
                             )}
                          </td>
                          <td><Badge bg={getEstadoBadge(venta)}>{getTextoEstado(venta)}</Badge></td>
                          <td>
                            <Button variant="outline-danger" size="sm" onClick={() => abrirModalEliminar(venta)}><Trash2 size={14}/></Button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  </>
                ) : <Alert variant="info" className="mb-4">No hay ventas hoy.</Alert>}

                {retiros.length > 0 && (
                  <Card className="mb-3 border-danger bg-light">
                    <Card.Body className="py-2">
                      <h6 className="text-danger">🔻 Retiros: -{formatearMoneda(totalRetirosDelDia)}</h6>
                    </Card.Body>
                  </Card>
                )}

                <Card className="mb-4 totales-card">
                  <Card.Body>
                    <h5 className="mb-3">Totales del día</h5>
                    <Row className="mb-3 text-center g-2">
                      <Col xs={6} md={3}><div className="p-2 bg-white border rounded">💵 Efectivo:<br/><strong>{formatearMoneda(totalesDia.efectivo)}</strong></div></Col>
                      <Col xs={6} md={3}><div className="p-2 bg-white border rounded">💳 Débito:<br/><strong>{formatearMoneda(totalesDia.debito)}</strong></div></Col>
                      <Col xs={6} md={3}><div className="p-2 bg-white border rounded">💳 Crédito:<br/><strong>{formatearMoneda(totalesDia.credito)}</strong></div></Col>
                      <Col xs={6} md={3}><div className="p-2 bg-white border rounded">🏦 Transf:<br/><strong>{formatearMoneda(totalesDia.transferencia)}</strong></div></Col>
                    </Row>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <div><h6 className="mb-0">Total Ventas</h6></div>
                      <h5 className="mb-0 text-success fw-bold">{formatearMoneda(totalRecaudadoDia)}</h5>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2 text-danger">
                      <div><h6 className="mb-0">Total Retiros</h6></div>
                      <h5 className="mb-0 fw-bold">-{formatearMoneda(totalRetirosDelDia)}</h5>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h5 className="mb-0 fw-bold" style={{color: '#8f3d38'}}>NETO EN CAJA</h5>
                      <h3 className="mb-0 fw-bold" style={{color: '#8f3d38'}}>{formatearMoneda(netoTotalDia)}</h3>
                    </div>
                  </Card.Body>
                </Card>

                <Row className="mb-3">
                    <Col md={6}>
                        <Card style={{ backgroundColor: "#e7f3ff", border: "2px solid #0d6efd" }}>
                            <Card.Body>
                                <h6 className="mb-2 fw-bold text-primary">Turno Mañana</h6>
                                <Row className="g-1 mb-2" style={{fontSize: '0.8rem'}}>
                                  <Col xs={6}>Efectivo: {formatearMoneda(totalesMañana.efectivo)}</Col>
                                  <Col xs={6}>Débito: {formatearMoneda(totalesMañana.debito)}</Col>
                                  <Col xs={6}>Crédito: {formatearMoneda(totalesMañana.credito)}</Col>
                                  <Col xs={6}>Transferencia: {formatearMoneda(totalesMañana.transferencia)}</Col>
                                </Row>
                                <div className="d-flex justify-content-between text-success fw-bold">
                                  <span>Ventas:</span> <span>{formatearMoneda(totalRecaudadoMañana)}</span>
                                </div>
                                <div className="d-flex justify-content-between text-danger">
                                  <span>Retiros:</span> <span>-{formatearMoneda(totalRetirosMañana)}</span>
                                </div>
                                <hr className="my-1"/>
                                <div className="d-flex justify-content-between fw-bold" style={{color: '#0d6efd'}}>
                                  <span>Neto Mañana:</span> <span>{formatearMoneda(netoMañana)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card style={{ backgroundColor: "#fff8e1", border: "2px solid #ffc107" }}>
                            <Card.Body>
                                <h6 className="mb-2 fw-bold text-warning" style={{color: '#b88700 !important'}}>Turno Tarde</h6>
                                <Row className="g-1 mb-2" style={{fontSize: '0.8rem'}}>
                                  <Col xs={6}>Efectivo: {formatearMoneda(totalesTarde.efectivo)}</Col>
                                  <Col xs={6}>Débito: {formatearMoneda(totalesTarde.debito)}</Col>
                                  <Col xs={6}>Crédito: {formatearMoneda(totalesTarde.credito)}</Col>
                                  <Col xs={6}>Transferencia: {formatearMoneda(totalesTarde.transferencia)}</Col>
                                </Row>
                                <div className="d-flex justify-content-between text-success fw-bold">
                                  <span>Ventas:</span> <span>{formatearMoneda(totalRecaudadoTarde)}</span>
                                </div>
                                <div className="d-flex justify-content-between text-danger">
                                  <span>Retiros:</span> <span>-{formatearMoneda(totalRetirosTarde)}</span>
                                </div>
                                <hr className="my-1"/>
                                <div className="d-flex justify-content-between fw-bold" style={{color: '#b88700'}}>
                                  <span>Neto Tarde:</span> <span>{formatearMoneda(netoTarde)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
              </>
            ) : (
              <Alert variant="warning" className="text-center">No hay movimientos para esta fecha.</Alert>
            )}
          </Card.Body>
        </Card>

        <Modal show={showModalEliminar} onHide={cancelarEliminacion} centered>
           <Modal.Header closeButton><Modal.Title>Eliminar Venta</Modal.Title></Modal.Header>
           <Modal.Body>
             <p>¿Seguro? Se devolverá el stock.</p>
             {ventaAEliminar && <p>Total: {formatearMoneda(ventaAEliminar.total)}</p>}
           </Modal.Body>
           <Modal.Footer>
             <Button variant="secondary" onClick={cancelarEliminacion}>Cancelar</Button>
             <Button variant="danger" onClick={confirmarEliminacion} disabled={isSubmitting}>Confirmar</Button>
           </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VentasList;
