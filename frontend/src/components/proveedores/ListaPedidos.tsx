import React, { useEffect, useState } from "react";
import { formatearMoneda } from "../../utils/formatters";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Trash2, FileDown, PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatearPeso } from "../../utils/formatters";
import {
  type Pedido,
  type Proveedor,
  getProveedores,
  getPedidos,
  deletePedido,
} from "../../services/apiService";

// Renombrar PedidoGuardado a Pedido para consistencia
type PedidoGuardado = Pedido;

const ListaPedidos: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoGuardado[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // Estados de Filtro
  const [proveedorId, setProveedorId] = useState<string>("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // Estados de UI
  const [pedidoDetalle, setPedidoDetalle] = useState<PedidoGuardado | null>(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState<PedidoGuardado | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Carga inicial (Proveedores para el filtro)
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const provData = await getProveedores();
        setProveedores(provData);
      } catch (err: any) {
        setError(err.message || "Error al cargar proveedores");
      }
    };
    cargarProveedores();
  }, []);

  // Cargar pedidos (y re-cargar al cambiar filtros)
  useEffect(() => {
    const cargarPedidos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPedidos(
          proveedorId || undefined,
          desde || undefined,
          hasta || undefined,
        );
        setPedidos(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      cargarPedidos();
    }, 500);

    return () => clearTimeout(timer);
  }, [proveedorId, desde, hasta]);

  // --- Funciones de Eliminación (sin cambios) ---
  const abrirModalEliminar = (pedido: PedidoGuardado) => {
    setPedidoAEliminar(pedido);
    setShowDeleteModal(true);
    setError(null);
  };

  const cancelarEliminacion = () => {
    setShowDeleteModal(false);
    setPedidoAEliminar(null);
  };

  const confirmarEliminacion = async () => {
    if (!pedidoAEliminar) return;

    setIsDeleting(true);
    setError(null);
    setExito(null);

    try {
      await deletePedido(pedidoAEliminar.id);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoAEliminar.id));
      setExito(`Pedido #${pedidoAEliminar.id} eliminado exitosamente.`);
      setShowDeleteModal(false);
      setPedidoAEliminar(null);
      setTimeout(() => setExito(null), 3000);
    } catch (apiError: any) {
      console.error("Error al eliminar pedido:", apiError);
      setError(apiError.message || "No se pudo eliminar el pedido.");
    } finally {
      setIsDeleting(false);
    }
  };
  // --- Fin Funciones de Eliminación ---

  // --- 2. FUNCIÓN DE IMPRESIÓN REEMPLAZADA POR JSPDF ---
  const addPDFHeader = (doc: jsPDF, title: string, rightText: string) => {
    const margin = 14;
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, doc.internal.pageSize.width, 26, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const textWidth = doc.getTextWidth(rightText);
    doc.text(rightText, doc.internal.pageSize.width - margin - textWidth, 17);

    doc.setTextColor(50, 50, 50);
  };

  const imprimirPedido = (pedido: PedidoGuardado) => {
    const doc = new jsPDF();
    const margin = 14;
    const fechaFormateada = new Date(pedido.fechaPedido).toLocaleDateString(
      "es-AR",
    );

    addPDFHeader(doc, "Pedido a Proveedor", `Fecha: ${fechaFormateada}`);

    doc.setFontSize(11);
    doc.text(`Estado: ${pedido.estado}`, margin, 34);

    // Sección Proveedor
    doc.setFontSize(14);
    doc.text("Proveedor", margin, 46);
    doc.setFontSize(11);
    doc.setTextColor(0);
    let startY = 52;
    doc.text(`Nombre: ${pedido.proveedor.nombre}`, margin, startY);
    if (pedido.proveedor.contacto) {
      startY += 6;
      doc.text(`Contacto: ${pedido.proveedor.contacto}`, margin, startY);
    }
    if (pedido.proveedor.telefono) {
      startY += 6;
      doc.text(`Teléfono: ${pedido.proveedor.telefono}`, margin, startY);
    }
    if (pedido.proveedor.email) {
      startY += 6;
      doc.text(`Email: ${pedido.proveedor.email}`, margin, startY);
    }

    // Observaciones
    if (pedido.notas) {
      startY += 8;
      doc.setFontSize(12);
      doc.text("Observaciones:", margin, startY);
      doc.setFontSize(11);
      startY += 6;
      const notes = doc.splitTextToSize(pedido.notas, 180);
      doc.text(notes, margin, startY);
      startY += notes.length * 6;
    }

    // Sección Artículos (Tabla)
    startY += 10;
    doc.setFontSize(14);
    doc.text("Artículos Pedidos", margin, startY);

    autoTable(doc, {
      startY: startY + 4,
      head: [["Artículo", "Cantidad", "P. Unit", "Subtotal"]],
      body: pedido.items.map((i) => {
        const cantidadTxt = i.articulo.esPesable ? formatearPeso(i.cantidad) : i.cantidad;
        const precioUnitario = Number(i.precioUnitario);
        const subtotal = Number(i.subtotal);
        return [
          i.articulo.nombre,
          cantidadTxt,
          Number.isFinite(precioUnitario) ? formatearMoneda(precioUnitario) : "-",
          Number.isFinite(subtotal) ? formatearMoneda(subtotal) : "-",
        ];
      }),
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59] }, // Color principal
      columnStyles: { 2: { halign: "right" }, 3: { halign: "right" } },
    });

    // Guardar el archivo
    doc.save(
      `pedido_${pedido.proveedor.nombre.replace(/ /g, "_")}_${fechaFormateada}.pdf`,
    );
  };
  // --- FIN DE LA FUNCIÓN MODIFICADA ---

  const pedidosFiltrados = pedidos;

  return (
    <div>
      <Card className="mt-4 shadow-sm">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <h5 className="mb-0">Lista de Pedidos</h5>
          <div className="d-flex flex-wrap gap-2 botones-header-responsive">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/proveedores")}
            >
              <Users size={14} className="me-1" /> Proveedores
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => navigate("/proveedores/pedidos/nuevo")}
            >
              <PlusCircle size={14} className="me-1" /> Nuevo Pedido
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Proveedor</Form.Label>
                <Form.Select
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                >
                  <option value="">Todos</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Desde (fecha)</Form.Label>
                <Form.Control
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Hasta (fecha)</Form.Label>
                <Form.Control
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          {exito && (
            <Alert variant="success" onClose={() => setExito(null)} dismissible>
              {exito}
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Cargando pedidos...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive className="table-header-brand">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Ítems</th>
                  <th>Total</th>
                  {/* --- 3. COLSPAN ACTUALIZADO (A 5) --- */}
                  <th colSpan={3}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>
                        {new Date(pedido.fechaPedido).toLocaleDateString(
                          "es-AR",
                        )}
                      </td>
                      <td>{pedido.proveedor.nombre}</td>
                      <td>{pedido.items.length}</td>
                      <td>{formatearMoneda(pedido.total)}</td>
                      {/* --- 4. CELDAS DE ACCIÓN ACTUALIZADAS CON ÍCONOS --- */}
                      <td style={{ width: "70px" }}>
                        <Button
                          variant="info"
                          size="sm"
                          className="w-100"
                          onClick={() => {
                            setPedidoDetalle(pedido);
                            setShowDetalle(true);
                          }}
                        >
                          Ver
                        </Button>
                      </td>
                      {pedido.estado === "Borrador" && (
                        <td style={{ width: "70px" }}>
                          <Button
                            variant="success"
                            size="sm"
                            className="w-100"
                            onClick={() => navigate(`/proveedores/pedidos/editar/${pedido.id}`)}
                          >
                            Editar
                          </Button>
                        </td>
                      )}
                      <td style={{ width: "70px" }}>
                        <Button
                          variant="warning"
                          size="sm"
                          className="w-100"
                          onClick={() => imprimirPedido(pedido)}
                          title="Descargar PDF"
                        >
                          <FileDown size={14} />
                        </Button>
                      </td>
                      <td style={{ width: "70px" }}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="w-100"
                          onClick={() => abrirModalEliminar(pedido)}
                          title="Eliminar pedido"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* --- 5. COLSPAN ACTUALIZADO A 7 --- */}
                    <td colSpan={7} className="text-center">
                      No hay pedidos registrados en este rango/proveedor.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* Modal de Detalle */}
          <Modal show={showDetalle} onHide={() => setShowDetalle(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Detalle de Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {pedidoDetalle && (
                <>
                  <div>
                    <strong>Fecha:</strong>{" "}
                    {new Date(pedidoDetalle.fechaPedido).toLocaleDateString(
                      "es-AR",
                    )}
                  </div>
                  <div>
                    <strong>Proveedor:</strong> {pedidoDetalle.proveedor.nombre}
                  </div>
                  {pedidoDetalle.proveedor.contacto && (
                    <div>
                      <strong>Contacto:</strong>{" "}
                      {pedidoDetalle.proveedor.contacto}
                    </div>
                  )}
                  {pedidoDetalle.proveedor.telefono && (
                    <div>
                      <strong>Tel.:</strong> {pedidoDetalle.proveedor.telefono}
                    </div>
                  )}
                  {pedidoDetalle.proveedor.email && (
                    <div>
                      <strong>Email:</strong> {pedidoDetalle.proveedor.email}
                    </div>
                  )}
                  <div className="mt-2">
                    <strong>Artículos:</strong>
                    <ul>
                      {pedidoDetalle.items.map((i) => (
                        <li key={i.id}>
                          {i.articulo.nombre} {i.articulo.esPesable ? "x " : "x"}{i.articulo.esPesable ? formatearPeso(i.cantidad) : i.cantidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {pedidoDetalle.notas && (
                    <div className="mt-2">
                      <strong>Observaciones:</strong> {pedidoDetalle.notas}
                    </div>
                  )}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                Cerrar
              </Button>
              {/* --- 6. BOTÓN PDF MODAL ACTUALIZADO --- */}
              {pedidoDetalle && (
                <Button
                  variant="warning"
                  onClick={() => imprimirPedido(pedidoDetalle)}
                >
                  <FileDown size={14} className="me-1" />
                  Descargar PDF
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          {/* Modal de Eliminación */}
          <Modal
            show={showDeleteModal}
            onHide={cancelarEliminacion}
            centered
          >
            <Modal.Header
              closeButton
              className="modal-header-brand"
            >
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && isDeleting && <Alert variant="danger">{error}</Alert>}
              {pedidoAEliminar && (
                <>
                  <p>
                    ¿Estás seguro de que deseas eliminar permanentemente el
                    pedido al proveedor{" "}
                    <strong>{pedidoAEliminar.proveedor.nombre}</strong>?
                  </p>
                  <div className="alert alert-warning">
                    <strong>Fecha:</strong>{" "}
                    {new Date(pedidoAEliminar.fechaPedido).toLocaleDateString(
                      "es-AR",
                    )}
                    <br />
                    <strong>Total:</strong> $
                    {formatearMoneda(pedidoAEliminar.total)}
                    <br />
                    <strong>Items:</strong> {pedidoAEliminar.items.length}
                  </div>
                  <p className="text-danger">
                    <strong>Esta acción no se puede deshacer.</strong>
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={cancelarEliminacion}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmarEliminacion}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListaPedidos;
