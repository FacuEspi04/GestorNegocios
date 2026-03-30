import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Alert,
  Spinner,
  Badge,
  InputGroup,
} from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatearMoneda, formatearPeso } from "../../utils/formatters";
import { 
  FileDown, 
  ClipboardPlus, 
  Search, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft
} from "lucide-react";
import {
  createPedido,
  updatePedido,
  getPedidoById,
  getArticulos,
  getProveedores,
  type Articulo,
  type CreatePedidoDto,
  type Pedido,
  type Proveedor,
} from "../../services/apiService";
import { useNavigate, useParams } from "react-router-dom";

interface ItemPedido {
  articulo: Articulo;
  cantidad: number;
}

type PedidoGuardado = Pedido;

const CrearPedido: React.FC = () => {

  // --- Estados de Datos ---
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [catalogoArticulos, setCatalogoArticulos] = useState<Articulo[]>([]);

  // --- Estados del Formulario de Pedido ---
  const [proveedorId, setProveedorId] = useState<string>("");
  const [itemsPedido, setItemsPedido] = useState<ItemPedido[]>([]);
  const [observaciones, setObservaciones] = useState<string>("");
  
  // --- Estados de UI y Filtros ---
  const navigate = useNavigate();
  const { id } = useParams();
  const [busqueda, setBusqueda] = useState(""); // Para filtrar artículos
  const [showConfirm, setShowConfirm] = useState(false);
  const [exito, setExito] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoGuardado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsDraftMode] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);

  // Carga inicial
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [provData, artData] = await Promise.all([
          getProveedores(),
          getArticulos(),
        ]);

        const articulosMapeados = artData.map((a) => ({
          ...a,
          id: Number(a.id),
          precio: Number(a.precio),
        }));

        setProveedores(provData);
        setCatalogoArticulos(articulosMapeados);

        if (id) {
          const pedidoDraft = await getPedidoById(Number(id));
          if (pedidoDraft) {
            setPedidoId(pedidoDraft.id);
            if (pedidoDraft.proveedorId) setProveedorId(String(pedidoDraft.proveedorId));
            if (pedidoDraft.notas) setObservaciones(pedidoDraft.notas);
            if (pedidoDraft.estado === 'Borrador') {
              setIsDraftMode(true);
            }
            if (pedidoDraft.items) {
               const mappedItems = pedidoDraft.items.map((i: any) => ({
                 articulo: articulosMapeados.find(a => Number(a.id) === Number(i.articulo?.id || i.articuloId)) || 
                           {...i.articulo, id: i.articuloId || i.articulo?.id},
                 cantidad: i.cantidad
               }));
               setItemsPedido(mappedItems as any);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar datos iniciales");
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  // --- LÓGICA DE FILTRADO ---
  const articulosFiltrados = useMemo(() => {
    return catalogoArticulos.filter(a => 
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.codigo_barras?.includes(busqueda)
    );
  }, [catalogoArticulos, busqueda]);

  // Separar Stock Crítico vs Normal
  const stockCritico = useMemo(() => {
    return articulosFiltrados.filter(a => a.stock <= a.stock_minimo);
  }, [articulosFiltrados]);

  const stockNormal = useMemo(() => {
    return articulosFiltrados.filter(a => a.stock > a.stock_minimo);
  }, [articulosFiltrados]);


  // --- MANEJADORES DEL PEDIDO ---

  // Agregar o Sumar 1 unidad
  const agregarAlPedido = (articulo: Articulo) => {
    setError("");
    const existente = itemsPedido.find((i) => i.articulo.id === articulo.id);

    if (existente) {
      setItemsPedido(
        itemsPedido.map((i) =>
          i.articulo.id === articulo.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      setItemsPedido([...itemsPedido, { articulo, cantidad: 1 }]);
    }
  };

  // Restar 1 unidad
  const restarDelPedido = (articuloId: number) => {
    const existente = itemsPedido.find((i) => i.articulo.id === articuloId);
    if (existente && existente.cantidad > 1) {
        setItemsPedido(
            itemsPedido.map((i) =>
              i.articulo.id === articuloId
                ? { ...i, cantidad: i.cantidad - 1 }
                : i
            )
          );
    } else {
        eliminarDelPedido(articuloId);
    }
  }

  // Cambiar cantidad manualmente (input)
  const cambiarCantidadManual = (articuloId: number, nuevaCantidad: number) => {
      const existente = itemsPedido.find((i) => i.articulo.id === articuloId);
      if (!existente) return;
      if (nuevaCantidad <= 0) return;
      setItemsPedido(itemsPedido.map(i => i.articulo.id === articuloId ? {...i, cantidad: nuevaCantidad} : i));
  }

  const eliminarDelPedido = (id: number) => {
    setItemsPedido(itemsPedido.filter((i) => i.articulo.id !== id));
  };

  const abrirConfirmacion = () => {
    setError("");
    if (!proveedorId) {
      setError("⚠️ Debes seleccionar un proveedor antes de confirmar.");
      return;
    }
    if (itemsPedido.length === 0) {
      setError("⚠️ El pedido está vacío. Agrega artículos desde el listado.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmarPedido = async () => {
    setIsSubmitting(true);
    setError("");

    const pedidoDto: CreatePedidoDto = {
      proveedorId: Number(proveedorId),
      notas: observaciones || undefined,
      estado: "Pendiente",
      items: itemsPedido.map((item) => ({
        articuloId: item.articulo.id,
        cantidad: item.cantidad,
      })),
    };

    try {
      let pedidoGuardado;
      if (pedidoId) {
        pedidoGuardado = await updatePedido(pedidoId, pedidoDto);
      } else {
        pedidoGuardado = await createPedido(pedidoDto);
      }
      setPedidoConfirmado(pedidoGuardado);
      setShowConfirm(false);
      setExito("¡Pedido confirmado exitosamente!");
      
      // Limpiar formulario pero mantener confirmación visible
      setItemsPedido([]);
      setObservaciones("");
      setPedidoId(null);
      setIsDraftMode(false);
      
      setTimeout(() => setExito(""), 3000);
    } catch (err: any) {
      console.error("Error al confirmar pedido:", err);
      setError(err.message || "Error al confirmar el pedido");
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const guardarComoBorrador = async () => {
    setIsSubmitting(true);
    setError("");

    const pedidoDto: CreatePedidoDto = {
      proveedorId: Number(proveedorId),
      notas: observaciones || undefined,
      estado: "Borrador",
      items: itemsPedido.map((item) => ({
        articuloId: item.articulo.id,
        cantidad: item.cantidad,
      })),
    };

    try {
      let pedidoGuardado;
      if (pedidoId) {
        pedidoGuardado = await updatePedido(pedidoId, pedidoDto);
      } else {
        pedidoGuardado = await createPedido(pedidoDto);
      }
      setPedidoConfirmado(pedidoGuardado);
      setShowConfirm(false);
      setExito("¡Pedido guardado como Borrador! Puedes editarlo después.");
      
      setItemsPedido([]);
      setObservaciones("");
      setPedidoId(null);
      setIsDraftMode(false);
      
      setTimeout(() => setExito(""), 3000);
      navigate("/proveedores/pedidos/lista");
    } catch (err: any) {
      console.error("Error al guardar como borrador:", err);
      setError(err.message || "Error al guardar el borrador");
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNuevoPedido = () => {
    setPedidoConfirmado(null);
    setExito("");
    setError("");
    setItemsPedido([]);
    setProveedorId("");
    setObservaciones("");
    setBusqueda("");
  };

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

  // --- PDF Generator ---
  const imprimirPedido = (pedido: PedidoGuardado) => {
    const doc = new jsPDF();
    const margin = 14;
    const fechaFormateada = new Date(pedido.fechaPedido).toLocaleDateString("es-AR");

    addPDFHeader(doc, "Pedido a Proveedor", `Fecha: ${fechaFormateada}`);

    doc.setFontSize(11);
    doc.text(`N° Pedido: ${pedido.id}`, margin, 34);

    doc.setFontSize(14);
    doc.text("Proveedor", margin, 46);
    doc.setFontSize(11);
    let startY = 52;
    doc.text(`Nombre: ${pedido.proveedor.nombre}`, margin, startY);
    
    if (pedido.notas) {
      startY += 10;
      doc.text(`Notas: ${pedido.notas}`, margin, startY);
    }

    startY += 10;
    autoTable(doc, {
      startY: startY + 4,
      head: [["Artículo", "Cant.", "P. Unit", "Subtotal"]],
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
      headStyles: { fillColor: [30, 41, 59] },
      columnStyles: { 2: { halign: "right" }, 3: { halign: "right" } },
    });

    doc.save(`pedido_${pedido.proveedor.nombre}_${fechaFormateada}.pdf`);
  };


  // --- RENDER ---
  if (isLoading) {
      return <div className="text-center my-5"><Spinner animation="border" /> Cargando...</div>;
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
                      variant="link"
                      onClick={() => navigate("/proveedores")}
                      className="p-0 me-2"
                      style={{ textDecoration: "none" }}
                    >
                      <ArrowLeft size={24} />
                    </Button>
        <h3 className="mb-0 flex items-center gap-2"><ClipboardPlus size={22}/>Nuevo Pedido</h3>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {exito && <Alert variant="success" dismissible onClose={() => setExito("")}>{exito}</Alert>}

      {!pedidoConfirmado ? (
        <Row>
            {/* COLUMNA IZQUIERDA: Catálogo de Artículos */}
            <Col md={8}>
                <Card className="shadow-sm h-100">
                    <Card.Header className="bg-light">
                        <InputGroup>
                            <InputGroup.Text><Search size={16}/></InputGroup.Text>
                            <Form.Control 
                                type="text" 
                                placeholder="Buscar artículo por nombre o código..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                autoFocus
                            />
                        </InputGroup>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        
                        {/* SECCIÓN 1: STOCK CRÍTICO */}
                        {stockCritico.length > 0 && (
                            <div className="mb-4">
                                <h6 className="text-danger d-flex align-items-center mb-2">
                                    <AlertTriangle className="me-2" size={16}/> Artículos con Stock Crítico (Bajo Mínimo)
                                </h6>
                                <Table hover size="sm" className="border-danger" bordered>
                                    <thead className="bg-danger text-white">
                                        <tr>
                                            <th>Artículo</th>
                                            <th className="text-center">Stock Actual</th>
                                            <th className="text-center">Mínimo</th>
                                            <th className="text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockCritico.map(art => (
                                            <tr key={art.id} style={{backgroundColor: '#fff5f5'}}>
                                                <td className="align-middle fw-bold">{art.nombre}</td>
                                                <td className="text-center align-middle text-danger fw-bold">{art.stock}</td>
                                                <td className="text-center align-middle text-muted">{art.stock_minimo}</td>
                                                <td className="text-center align-middle">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline-danger" 
                                                        onClick={() => agregarAlPedido(art)}
                                                    >
                                                        <Plus size={14}/> Agregar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* SECCIÓN 2: RESTO DEL CATÁLOGO */}
                        <h6 className="text-muted mb-2">Catálogo General</h6>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Artículo</th>
                                    <th className="text-center">Stock</th>
                                    <th className="text-center">Mínimo</th>
                                    <th className="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockNormal.map(art => (
                                    <tr key={art.id}>
                                        <td className="align-middle">{art.nombre}</td>
                                        <td className="text-center align-middle">
                                            <Badge bg="success">{art.stock}</Badge>
                                        </td>
                                        <td className="text-center align-middle text-muted">{art.stock_minimo}</td>
                                        <td className="text-center align-middle">
                                            <Button 
                                                size="sm" 
                                                variant="outline-primary" 
                                                onClick={() => agregarAlPedido(art)}
                                            >
                                                <Plus size={14}/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {stockNormal.length === 0 && stockCritico.length === 0 && (
                                    <tr><td colSpan={3} className="text-center text-muted py-3">No se encontraron artículos.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>

            {/* COLUMNA DERECHA: Resumen del Pedido */}
            <Col md={4}>
                <Card className="shadow-sm border-primary h-100">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Resumen del Pedido</h5>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column">
                        {/* Selector de Proveedor */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Proveedor</Form.Label>
                            <Form.Select 
                                value={proveedorId} 
                                onChange={(e) => setProveedorId(e.target.value)}
                                className={!proveedorId ? "border-danger" : "border-success"}
                            >
                                <option value="">-- Seleccionar Proveedor --</option>
                                {proveedores.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </Form.Select>
                            {!proveedorId && <Form.Text className="text-danger">Seleccione uno para continuar</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={2}
                                placeholder="Ej: Entregar por la mañana..." 
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            />
                        </Form.Group>

                        <hr />

                        {/* Lista de Items Agregados */}
                        <div className="flex-grow-1 overflow-auto" style={{maxHeight: '40vh'}}>
                            {itemsPedido.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    <em>El pedido está vacío.<br/>Seleccione artículos de la izquierda.</em>
                                </div>
                            ) : (
                                <Table size="sm" borderless>
                                    <tbody>
                                        {itemsPedido.map((item, idx) => (
                                            <tr key={idx} className="border-bottom">
                                                <td className="align-middle">
                                                    <small className="fw-bold">{item.articulo.nombre}</small>
                                                </td>
                                                <td className="align-middle" style={{width: '110px'}}>
                                                    <InputGroup size="sm">
                                                        <Button variant="outline-secondary" onClick={() => restarDelPedido(item.articulo.id)}><Minus size={14}/></Button>
                                                        <Form.Control 
                                                            className="text-center px-0" 
                                                            type="number"
                                                            step={item.articulo.esPesable ? "0.001" : "1"}
                                                            value={item.cantidad} 
                                                            onChange={(e) => cambiarCantidadManual(item.articulo.id, parseFloat(e.target.value) || 0)}
                                                        />
                                                        <Button variant="outline-secondary" onClick={() => agregarAlPedido(item.articulo)}><Plus size={14}/></Button>
                                                    </InputGroup>
                                                </td>
                                                <td className="align-middle text-end">
                                                    <Button size="sm" variant="link" className="text-danger p-0" onClick={() => eliminarDelPedido(item.articulo.id)}>
                                                        <Trash2 size={14}/>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>Total Items: {itemsPedido.length}</strong>
                            <Button 
                                variant="success" 
                                onClick={abrirConfirmacion}
                                disabled={itemsPedido.length === 0 || !proveedorId}
                            >
                                Confirmar Pedido
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
      ) : (
        /* VISTA DE ÉXITO / POST-CONFIRMACIÓN */
        <Card className="text-center p-5 shadow">
            <Card.Body>
                <div className="text-success mb-3">
                    <ClipboardPlus size={60}/>
                </div>
                <h3>¡Pedido Generado Exitosamente!</h3>
                <p className="text-muted">El pedido ha sido guardado en el sistema.</p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="secondary" onClick={handleNuevoPedido}>
                        Volver al Inicio
                    </Button>
                    <Button variant="primary" onClick={() => pedidoConfirmado && imprimirPedido(pedidoConfirmado)}>
                        <FileDown className="me-2" size={16}/> Descargar PDF
                    </Button>
                </div>
            </Card.Body>
        </Card>
      )}

      {/* Modal de confirmación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se generará un pedido para: <strong>{proveedores.find(p => p.id === Number(proveedorId))?.nombre}</strong></p>
          <p>Cantidad de artículos distintos: <strong>{itemsPedido.length}</strong></p>
          <Alert variant="warning">
            <small>Verifique que las cantidades sean correctas antes de confirmar.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="outline-info" onClick={guardarComoBorrador} disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" animation="border"/> : "Guardar como Borrador"}
          </Button>
          <Button variant="success" onClick={confirmarPedido} disabled={isSubmitting}>
            {isSubmitting ? <><Spinner size="sm" animation="border"/> Guardando...</> : "Confirmar y Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrearPedido;