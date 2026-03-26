import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup,
  Tabs,
  Tab,
} from "react-bootstrap";
import { ArrowLeft, Wallet, CheckCircle, Wallet2, CalendarDays, Users, PlusCircle, Pencil, Trash2 } from "lucide-react";
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

const CuentasCorrientes: React.FC = () => {
  const navigate = useNavigate();
  const [ventasPendientes, setVentasPendientes] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabKey, setTabKey] = useState("deudas");

  // Estados Modal
  const [showModal, setShowModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(null);
  const [deudaTotalCliente, setDeudaTotalCliente] = useState<number>(0);
  
  const [montoPago, setMontoPago] = useState<string>("");
  const [formaPagoPago, setFormaPagoPago] = useState<FormaPago>("efectivo");
  const [interesPorcentajePago, setInteresPorcentajePago] = useState<string>("10");
  
  // NUEVO: Estado para la fecha del pago (para que impacte en la caja de hoy)
  const [fechaPago, setFechaPago] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exito, setExito] = useState("");

  // Modales Directorio Clientes
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
  const [formCliente, setFormCliente] = useState<CreateClienteDto>({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [isSubmittingCliente, setIsSubmittingCliente] = useState(false);

  // Función auxiliar para obtener fecha actual formato YYYY-MM-DD
  const getTodayString = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ventasData, clientesData] = await Promise.all([
        getVentasPendientes(),
        getClientes()
      ]);
      setVentasPendientes(ventasData);
      setClientes(clientesData || []);
    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setError(err.message || "No se pudieron cargar los datos.");
      setVentasPendientes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar por cliente
  const ventasPorCliente = ventasPendientes.reduce(
    (acc, venta) => {
      const clienteKey = venta.clienteNombre || "Cliente General";
      if (!acc[clienteKey]) {
        acc[clienteKey] = [];
      }
      acc[clienteKey].push(venta);
      return acc;
    },
    {} as { [cliente: string]: Venta[] },
  );

  const calcularDeudaCliente = (cliente: string): number => {
    return ventasPorCliente[cliente].reduce(
      (acumulador, venta) => {
        const total = Number(venta.total);
        const pagado = Number(venta.monto_pagado || 0);
        return acumulador + (total - pagado);
      },
      0
    );
  };

  const handleAbrirModalPago = (clienteNombre: string) => {
    const deuda = calcularDeudaCliente(clienteNombre);
    setClienteSeleccionado(clienteNombre);
    setDeudaTotalCliente(deuda);
    setMontoPago("");
    setFormaPagoPago("efectivo");
    setInteresPorcentajePago("10");
    setFechaPago(getTodayString()); // Por defecto HOY
    setError(null);
    setExito("");
    setShowModal(true);
  };

  const handleRegistrarPago = async () => {
    if (!clienteSeleccionado || !montoPago || !fechaPago) return;

    const montoNumerico = parseFloat(montoPago);
    
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setError("Por favor ingrese un monto válido mayor a 0.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const porcentaje = parseFloat(interesPorcentajePago) || 0;
    const montoConInteres = formaPagoPago === "credito" 
      ? montoNumerico * (1 + (porcentaje / 100))
      : montoNumerico;

    try {
      // Enviamos la fecha seleccionada a la API
      await registrarPagoCliente({
        clienteNombre: clienteSeleccionado,
        monto: montoNumerico,
        formaPago: formaPagoPago,
        interes: montoConInteres - montoNumerico,
        fecha: fechaPago 
      });

      setShowModal(false);
      setExito(`¡Pago de $${montoNumerico} registrado correctamente para ${clienteSeleccionado}!`);
      
      await cargarDatos();

      setTimeout(() => setExito(""), 5000);
    } catch (apiError: any) {
      console.error("Error al registrar el pago:", apiError);
      setError(apiError.message || "Error al procesar el pago.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowClienteModal = (cliente?: Cliente) => {
    if (cliente) {
      setClienteAEditar(cliente);
      setFormCliente({
        nombre: cliente.nombre,
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        direccion: cliente.direccion || "",
      });
    } else {
      setClienteAEditar(null);
      setFormCliente({ nombre: "", telefono: "", email: "", direccion: "" });
    }
    setShowClienteModal(true);
  };

  const handleGuardarCliente = async () => {
    if (!formCliente.nombre.trim()) {
       setError("El nombre es obligatorio");
       return;
    }
    setIsSubmittingCliente(true);
    setError(null);
    try {
       if (clienteAEditar) {
         await updateCliente(clienteAEditar.id, formCliente);
         setExito(`Cliente ${formCliente.nombre} actualizado.`);
       } else {
         await createCliente(formCliente);
         setExito(`Cliente ${formCliente.nombre} creado.`);
       }
       setShowClienteModal(false);
       await cargarDatos();
       setTimeout(() => setExito(""), 3000);
    } catch(err: any) {
       setError(err.message || "Error al guardar el cliente");
    } finally {
       setIsSubmittingCliente(false);
    }
  };

  const handleEliminarCliente = async (id: number) => {
     if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
        try {
           setIsLoading(true);
           await deleteCliente(id);
           setExito("Cliente eliminado");
           await cargarDatos();
           setTimeout(() => setExito(""), 3000);
        } catch(err: any) {
           setError("No se puede eliminar el cliente porque tiene ventas asociadas o ocurrió un error.");
           setIsLoading(false);
        }
     }
  }

  const formatearFecha = (fechaISO: string | Date) => {
    const fecha = new Date(fechaISO);
    const day = String(fecha.getDate()).padStart(2, "0");
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const year = fecha.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatearHora = (fechaISO: string | Date) => {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>

      <Card className="mt-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Wallet size={18} className="me-2" />
            Cuentas Corrientes
          </h5>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/ventas")}
          >
            <ArrowLeft className="me-1" />
            Volver
          </Button>
        </Card.Header>
        <Card.Body>
          {exito && (
            <Alert variant="success" className="d-flex align-items-center">
              <CheckCircle size={24} className="me-2" /> {exito}
            </Alert>
          )}
          
          {error && !showModal && (
             <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>
          )}

          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Cargando datos...</p>
            </div>
          ) : (
            <Tabs
              id="cuentas-corrientes-tabs"
              activeKey={tabKey}
              onSelect={(k) => setTabKey(k || "deudas")}
              className="mb-4 custom-tabs"
            >
              <Tab eventKey="deudas" title={<><Wallet size={16} className="me-2"/> Deudas Pendientes</>}>
                <div className="mt-3">
                  {Object.keys(ventasPorCliente).length > 0 ? (
                    <>
                      {Object.keys(ventasPorCliente).map((cliente) => (
                        <Card key={cliente} className="mb-4 border-0 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-light text-dark">
                    <div className="d-flex align-items-center gap-2">
                        <Wallet2 size={20} className="text-secondary" />
                        <span className="h5 mb-0 fw-bold">{cliente}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fs-5 badge bg-danger text-white">
                            Deuda Total: ${calcularDeudaCliente(cliente).toFixed(2)}
                        </span>
                        <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleAbrirModalPago(cliente)}
                            style={{ fontWeight: 'bold' }}
                        >
                            Registrar Entrega / Pago
                        </Button>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="p-0">
                    <Table striped bordered hover responsive size="sm" className="mb-0">
                      <thead className="table-header-brand">
                        <tr>
                          <th>Fecha</th>
                          <th>Detalle</th>
                          <th className="text-end">Estado Deuda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventasPorCliente[cliente].map((venta) => {
                            const total = Number(venta.total);
                            const pagado = Number(venta.monto_pagado || 0);
                            const resta = total - pagado;
                            
                            return (
                              <tr key={venta.id}>
                                <td>{formatearFecha(venta.fechaHora)} {formatearHora(venta.fechaHora)}</td>
                                <td>
                                  <small className="text-muted">
                                    {venta.items.map((i) => `${i.articulo?.nombre || 'Art.'} (x${i.cantidad})`).join(", ")}
                                  </small>
                                </td>
                                <td className="text-end">
                                    {pagado > 0 ? (
                                        <div>
                                            <span className="text-decoration-line-through text-muted" style={{fontSize: '0.85rem'}}>
                                                Orig: ${total.toFixed(2)}
                                            </span>
                                            <div className="text-danger fw-bold">
                                                Restan: ${resta.toFixed(2)}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="fw-bold text-danger">${total.toFixed(2)}</span>
                                    )}
                                </td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))}
            </>
          ) : (
            <Alert variant="info" className="text-center">
              ✅ No hay deudas pendientes
            </Alert>
          )}
                </div>
              </Tab>

              <Tab eventKey="directorio" title={<><Users size={16} className="me-2"/> Directorio de Clientes</>}>
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 text-secondary">Clientes Registrados</h5>
                    <Button variant="success" size="sm" onClick={() => handleShowClienteModal()}>
                      <PlusCircle className="me-1" /> Nuevo Cliente
                    </Button>
                  </div>

                  <Table striped bordered hover responsive>
                    <thead className="table-header-brand">
                      <tr>
                        <th>N° Interno</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.length > 0 ? (
                        clientes.map((c) => (
                          <tr key={c.id}>
                            <td>{c.id}</td>
                            <td className="fw-bold">{c.nombre}</td>
                            <td>{c.telefono || <small className="text-muted">N/A</small>}</td>
                            <td>{c.email || <small className="text-muted">N/A</small>}</td>
                            <td className="text-center">
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowClienteModal(c)}>
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleEliminarCliente(c.id)}>
                                <Trash2 size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No hay clientes registrados de forma persistente.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="modal-header-brand">
          <Modal.Title>Registrar Pago: {clienteSeleccionado}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="text-center mb-4 p-3 bg-light rounded">
            <h6 className="text-muted text-uppercase mb-1">Deuda Actual</h6>
            <h2 className="text-danger fw-bold">${deudaTotalCliente.toFixed(2)}</h2>
          </div>

          <Form>
            {/* NUEVO CAMPO: FECHA DEL PAGO */}
            <Form.Group className="mb-3">
              <Form.Label><CalendarDays size={14} className="me-1"/> Fecha de ingreso en Caja</Form.Label>
              <Form.Control 
                type="date" 
                value={fechaPago} 
                onChange={(e) => setFechaPago(e.target.value)}
                max={getTodayString()}
              />
              <Form.Text className="text-muted">
                El dinero impactará en la caja de este día.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">¿Cuánto entrega el cliente?</Form.Label>
              <InputGroup size="lg">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Ej: 10000"
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                  autoFocus
                />
              </InputGroup>
              {montoPago && !isNaN(parseFloat(montoPago)) && (
                  <div className="mt-2 text-end">
                      <small className="text-muted">
                        Saldo restante: 
                        <strong className={deudaTotalCliente - parseFloat(montoPago) > 0.01 ? "text-danger ms-1" : "text-success ms-1"}>
                             ${Math.max(0, deudaTotalCliente - parseFloat(montoPago)).toFixed(2)}
                        </strong>
                      </small>
                  </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Forma de Pago</Form.Label>
              <Form.Select
                value={formaPagoPago}
                onChange={(e) => setFormaPagoPago(e.target.value as FormaPago)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            </Form.Group>

            {formaPagoPago === "credito" && (
              <Form.Group className="mb-3 p-2 border rounded bg-light">
                <Form.Label>Interés Tarjeta (%)</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                    <Form.Control
                      type="number"
                      value={interesPorcentajePago}
                      onChange={(e) => setInteresPorcentajePago(e.target.value)}
                      style={{width: '80px'}}
                    />
                    <span className="text-muted small">
                        Se cobrarán <strong>${((parseFloat(montoPago)||0) * (parseFloat(interesPorcentajePago)||0)/100).toFixed(2)}</strong> extra de interés.
                    </span>
                </div>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleRegistrarPago} disabled={isSubmitting || !montoPago || !fechaPago}>
            {isSubmitting ? <Spinner size="sm" animation="border"/> : "Confirmar Pago"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Directorio de Clientes (Crear/Editar) */}
      <Modal show={showClienteModal} onHide={() => setShowClienteModal(false)} centered>
        <Modal.Header closeButton className="modal-header-brand">
          <Modal.Title>{clienteAEditar ? "Editar Cliente" : "Nuevo Cliente"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={formCliente.nombre} 
                onChange={(e) => setFormCliente({...formCliente, nombre: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control 
                type="text" 
                value={formCliente.telefono} 
                onChange={(e) => setFormCliente({...formCliente, telefono: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={formCliente.email} 
                onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control 
                type="text" 
                value={formCliente.direccion} 
                onChange={(e) => setFormCliente({...formCliente, direccion: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClienteModal(false)} disabled={isSubmittingCliente}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleGuardarCliente} disabled={isSubmittingCliente || !formCliente.nombre}>
            {isSubmittingCliente ? <Spinner size="sm" animation="border"/> : "Guardar Cliente"}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default CuentasCorrientes;