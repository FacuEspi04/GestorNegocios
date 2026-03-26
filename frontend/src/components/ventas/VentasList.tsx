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

  // Función auxiliar: Solo sumar si tiene FORMA DE PAGO (Evita sumar deudas viejas pagadas hoy)
  const calcularRecaudadoPorFormaPago = (listaVentas: Venta[]) => {
    const totales: { [key: string]: number } = {
      'efectivo': 0, 'debito': 0, 'credito': 0, 'transferencia': 0,
    };
    listaVentas.forEach((venta) => {
      const pagado = Number(venta.monto_pagado || 0);
      const formaPago = venta.formaPago;
      
      if (pagado > 0 && formaPago && totales.hasOwnProperty(formaPago)) {
        totales[formaPago]! += pagado;
      }
    });
    return totales;
  };

  const totalesPorFormaPago = useMemo(() => calcularRecaudadoPorFormaPago(ventas), [ventas]);
  const totalesMañana = useMemo(() => calcularRecaudadoPorFormaPago(ventasMañana), [ventasMañana]);
  const totalesTarde = useMemo(() => calcularRecaudadoPorFormaPago(ventasTarde), [ventasTarde]);

  const calcularTotalReal = (lista: Venta[]) => {
    return lista.reduce((total, v) => {
      if (v.formaPago) { // <--- Solo si es Efectivo, Débito, etc.
        return total + Number(v.monto_pagado || 0);
      }
      return total;
    }, 0);
  };

  const totalRecaudadoMañana = useMemo(() => calcularTotalReal(ventasMañana), [ventasMañana]);
  const totalRecaudadoTarde = useMemo(() => calcularTotalReal(ventasTarde), [ventasTarde]);
  const totalRecaudadoDia = useMemo(() => calcularTotalReal(ventas), [ventas]);
  // -------------------------------

  const netoMañana = useMemo(() => totalRecaudadoMañana - totalRetirosMañana, [totalRecaudadoMañana, totalRetirosMañana]);
  const netoTarde = useMemo(() => totalRecaudadoTarde - totalRetirosTarde, [totalRecaudadoTarde, totalRetirosTarde]);
  const netoTotalDia = useMemo(() => totalRecaudadoDia - totalRetirosDelDia, [totalRecaudadoDia, totalRetirosDelDia]);

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
    if (venta.estado === 'Completada') return "success";
    if (pagado > 0 && pagado < total) return "warning";
    return "danger";
  };

  const getTextoEstado = (venta: Venta) => {
    const total = Number(venta.total);
    const pagado = Number(venta.monto_pagado || 0);
    if (venta.estado === 'Completada') return "Completada";
    if (pagado > 0 && pagado < total) return `Parcial ($${pagado.toFixed(0)})`;
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

  const formatearFormaPago = (formaPago: FormaPago | null, estado: VentaEstado) => {
    if (estado === 'Pendiente' && !formaPago) return "Cta. Cte.";
    if (!formaPago) return "N/A";
    switch (formaPago) {
      case 'efectivo': return "Efectivo";
      case 'debito': return "Débito";
      case 'credito': return "Crédito";
      case 'transferencia': return "Transferencia";
      default: return formaPago;
    }
  };

  const handleDownloadPDF = () => {
    if (isLoading || (ventas.length === 0 && retiros.length === 0)) return;
    const doc = new jsPDF();
    const fechaFormateada = formatearFecha(fechaSeleccionada);
    const margin = 14;
    doc.setFontSize(18);
    doc.text(`Resumen de Caja - ${fechaFormateada}`, margin, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el ${formatearFecha(new Date())} a las ${formatearHora(new Date())}`, margin, 28);
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Totales Generales del Día (Recaudado)", margin, 42);
    autoTable(doc, {
      startY: 46,
      head: [['Concepto', 'Monto']],
      body: [
        ['Total Recaudado (Ingresos Reales)', `$${totalRecaudadoDia.toFixed(2)}`],
        ['Total Retiros de Caja', `-$${totalRetirosDelDia.toFixed(2)}`],
        ['NETO EN CAJA', `$${netoTotalDia.toFixed(2)}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [143, 61, 56] },
      bodyStyles: { fontStyle: 'bold' },
      styles: { halign: 'center' },
      margin: { left: margin },
    });
    if (ventas.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY + 12;
      doc.text("Detalle de Movimientos", margin, finalY);
      autoTable(doc, {
        startY: finalY + 4,
        head: [['Hora', 'Cliente', 'Pago', 'Total Venta', 'Pagado', 'Estado']],
        body: ventas.map(v => [
          formatearHora(v.fechaHora),
          v.clienteNombre,
          formatearFormaPago(v.formaPago, v.estado),
          `$${Number(v.total).toFixed(2)}`,
          `$${Number(v.monto_pagado).toFixed(2)}`, 
          getTextoEstado(v),
        ]),
        headStyles: { fillColor: [143, 61, 56] },
      });
    }
    doc.save(`resumenDeCaja_${fechaSeleccionada}.pdf`);
  };

  const handleDownloadPDFMañana = () => {
    if (isLoading || (ventasMañana.length === 0 && retirosMañana.length === 0)) return;
    const doc = new jsPDF();
    const fechaFormateada = formatearFecha(fechaSeleccionada);
    const margin = 14;
    doc.setFontSize(18);
    doc.text(`Resumen de Caja - TURNO MAÑANA - ${fechaFormateada}`, margin, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el ${formatearFecha(new Date())} a las ${formatearHora(new Date())}`, margin, 28);
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Totales Generales (Turno Mañana)", margin, 42);
    autoTable(doc, {
      startY: 46,
      head: [['Concepto', 'Monto']],
      body: [
        ['Total Recaudado', `$${totalRecaudadoMañana.toFixed(2)}`],
        ['Total Retiros', `-$${totalRetirosMañana.toFixed(2)}`],
        ['NETO EN CAJA', `$${netoMañana.toFixed(2)}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [143, 61, 56] },
      bodyStyles: { fontStyle: 'bold' },
      styles: { halign: 'center' },
      margin: { left: margin },
    });
    const finalY1 = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(14);
    doc.text("Ventas Turno Mañana", margin, finalY1);
    autoTable(doc, {
      startY: finalY1 + 4,
      head: [['Forma de Pago', 'Monto']],
      body: [
        ['Efectivo', `$${totalesMañana.efectivo.toFixed(2)}`],
        ['Débito', `$${totalesMañana.debito.toFixed(2)}`],
        ['Crédito', `$${totalesMañana.credito.toFixed(2)}`],
        ['Transferencia', `$${totalesMañana.transferencia.toFixed(2)}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [45, 68, 84] },
      });
    if (ventasMañana.length > 0) {
      const finalY2 = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(14);
      doc.text("Detalle de Ventas Turno Mañana", margin, finalY2);
      autoTable(doc, {
        startY: finalY2 + 4,
        head: [['Hora', 'Cliente', 'Forma Pago', 'Total', 'Pagado', 'Estado']],
        body: ventasMañana.map(v => [
          formatearHora(v.fechaHora),
          v.clienteNombre,
          formatearFormaPago(v.formaPago, v.estado),
          `$${Number(v.total).toFixed(2)}`,
          `$${Number(v.monto_pagado).toFixed(2)}`,
          getTextoEstado(v),
        ]),
        headStyles: { fillColor: [143, 61, 56] },
      });
    }
    doc.save(`resumenCajaMañana${fechaSeleccionada}.pdf`);
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
                      {ventas.map((venta) => (
                        <tr key={venta.id}>
                          <td>{formatearHora(venta.fechaHora)}</td>
                          <td>{venta.clienteNombre}</td>
                          <td style={{ textTransform: 'capitalize' }}>
                            {determinarTurno(venta.fechaHora)}
                          </td>
                          <td><small>{venta.items?.length || 0} items</small></td>
                          <td>
                             <Badge bg={venta.formaPago ? getFormaPagoBadge(venta.formaPago) : 'secondary'}>
                               {formatearFormaPago(venta.formaPago, venta.estado)}
                             </Badge>
                          </td>
                          <td>
                             <div><strong>${Number(venta.total).toFixed(2)}</strong></div>
                             {Number(venta.monto_pagado) < Number(venta.total) && (
                               <small className="text-muted">Pagado: ${Number(venta.monto_pagado).toFixed(2)}</small>
                             )}
                          </td>
                          <td><Badge bg={getEstadoBadge(venta)}>{getTextoEstado(venta)}</Badge></td>
                          <td>
                            <Button variant="outline-danger" size="sm" onClick={() => abrirModalEliminar(venta)}><Trash2 size={14}/></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  </>
                ) : <Alert variant="info" className="mb-4">No hay ventas hoy.</Alert>}

                {retiros.length > 0 && (
                  <Card className="mb-3 border-danger bg-light">
                    <Card.Body className="py-2">
                      <h6 className="text-danger">🔻 Retiros: -${totalRetirosDelDia.toFixed(2)}</h6>
                    </Card.Body>
                  </Card>
                )}

                <Card className="mb-4 totales-card">
                  <Card.Body>
                    <h5 className="mb-3">Totales del día</h5>
                    <Row className="mb-3 text-center g-2">
                        <Col xs={6} md={3}><div className="p-2 bg-white border rounded">💵 Efectivo:<br/><strong>${totalesPorFormaPago.efectivo.toFixed(2)}</strong></div></Col>
                        <Col xs={6} md={3}><div className="p-2 bg-white border rounded">💳 Débito:<br/><strong>${totalesPorFormaPago.debito.toFixed(2)}</strong></div></Col>
                        <Col xs={6} md={3}><div className="p-2 bg-white border rounded">💳 Crédito:<br/><strong>${totalesPorFormaPago.credito.toFixed(2)}</strong></div></Col>
                        <Col xs={6} md={3}><div className="p-2 bg-white border rounded">🏦 Transf:<br/><strong>${totalesPorFormaPago.transferencia.toFixed(2)}</strong></div></Col>
                    </Row>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <div><h6 className="mb-0">Total Ventas</h6></div>
                      <h5 className="mb-0 text-success fw-bold">${totalRecaudadoDia.toFixed(2)}</h5>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2 text-danger">
                      <div><h6 className="mb-0">Total Retiros</h6></div>
                      <h5 className="mb-0 fw-bold">-${totalRetirosDelDia.toFixed(2)}</h5>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h5 className="mb-0 fw-bold" style={{color: '#8f3d38'}}>NETO EN CAJA</h5>
                      <h3 className="mb-0 fw-bold" style={{color: '#8f3d38'}}>${netoTotalDia.toFixed(2)}</h3>
                    </div>
                  </Card.Body>
                </Card>

                <Row className="mb-3">
                    <Col md={6}>
                        <Card style={{ backgroundColor: "#e7f3ff", border: "2px solid #0d6efd" }}>
                            <Card.Body>
                                <h6 className="mb-2 fw-bold text-primary">Turno Mañana</h6>
                                <Row className="g-1 mb-2" style={{fontSize: '0.8rem'}}>
                                    <Col xs={6}>Efectivo: ${totalesMañana.efectivo.toFixed(0)}</Col>
                                    <Col xs={6}>Débito: ${totalesMañana.debito.toFixed(0)}</Col>
                                    <Col xs={6}>Crédito: ${totalesMañana.credito.toFixed(0)}</Col>
                                    <Col xs={6}>Transferencia: ${totalesMañana.transferencia.toFixed(0)}</Col>
                                </Row>
                                <div className="d-flex justify-content-between text-success fw-bold">
                                    <span>Ventas:</span> <span>${totalRecaudadoMañana.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between text-danger">
                                    <span>Retiros:</span> <span>-${totalRetirosMañana.toFixed(2)}</span>
                                </div>
                                <hr className="my-1"/>
                                <div className="d-flex justify-content-between fw-bold" style={{color: '#0d6efd'}}>
                                    <span>Neto Mañana:</span> <span>${netoMañana.toFixed(2)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card style={{ backgroundColor: "#fff8e1", border: "2px solid #ffc107" }}>
                            <Card.Body>
                                <h6 className="mb-2 fw-bold text-warning" style={{color: '#b88700 !important'}}>Turno Tarde</h6>
                                <Row className="g-1 mb-2" style={{fontSize: '0.8rem'}}>
                                    <Col xs={6}>Efectivo: ${totalesTarde.efectivo.toFixed(0)}</Col>
                                    <Col xs={6}>Débito: ${totalesTarde.debito.toFixed(0)}</Col>
                                    <Col xs={6}>Crédito: ${totalesTarde.credito.toFixed(0)}</Col>
                                    <Col xs={6}>Transferencia: ${totalesTarde.transferencia.toFixed(0)}</Col>
                                </Row>
                                <div className="d-flex justify-content-between text-success fw-bold">
                                    <span>Ventas:</span> <span>${totalRecaudadoTarde.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between text-danger">
                                    <span>Retiros:</span> <span>-${totalRetirosTarde.toFixed(2)}</span>
                                </div>
                                <hr className="my-1"/>
                                <div className="d-flex justify-content-between fw-bold" style={{color: '#b88700'}}>
                                    <span>Neto Tarde:</span> <span>${netoTarde.toFixed(2)}</span>
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
             {ventaAEliminar && <p>Total: ${ventaAEliminar.total}</p>}
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