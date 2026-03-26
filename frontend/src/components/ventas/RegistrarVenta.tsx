import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  InputGroup,
  Button,
  Alert,
  Modal,
  Table,
  Badge,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { Barcode, Trash2, CheckCircle, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getArticulos,
  createVenta,
  type CreateVentaDto,
  type CreateVentaItemDto,
  type FormaPago,
  getClientes,
  createCliente,
  type Cliente,
} from "../../services/apiService";

// El tipo de Articulo que usa este componente
interface ArticuloVenta {
  id: number;
  nombre: string;
  codigoBarras: string;
  marca: string;
  stock: number;
  precio: number;
}

interface ItemVenta {
  articulo: ArticuloVenta;
  cantidad: number;
  subtotal: number;
}

const RegistrarVenta: React.FC = () => {
  const navigate = useNavigate();
  const [codigoBarras, setCodigoBarras] = useState("");
  
  // Estado para las sugerencias de búsqueda por nombre
  const [sugerencias, setSugerencias] = useState<ArticuloVenta[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const [itemsVenta, setItemsVenta] = useState<ItemVenta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [clienteIdSeleccionado, setClienteIdSeleccionado] = useState<number | "">("");
  const [catalogoArticulos, setCatalogoArticulos] = useState<ArticuloVenta[]>([]);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [nuevoClienteNombre, setNuevoClienteNombre] = useState("");
  const [isCreatingCliente, setIsCreatingCliente] = useState(false);
  
  const [formaPago, setFormaPago] = useState<FormaPago>("efectivo");
  const [interesPorcentaje, setInteresPorcentaje] = useState<string>("10");
  const [esCtaCte, setEsCtaCte] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referencia para manejar clics fuera del buscador
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Cargar artículos desde la API
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [apiItems, clientesApi] = await Promise.all([
          getArticulos(),
          getClientes()
        ]);
        
        const mapeados: ArticuloVenta[] = apiItems.map((a) => {
          let nombreMarca = '';
          if (typeof a.marca === 'object' && a.marca !== null) {
            nombreMarca = (a.marca as any).nombre || '';
          } else {
            nombreMarca = String(a.marca || '');
          }

          return {
            id: Number(a.id),
            nombre: a.nombre,
            marca: nombreMarca,
            codigoBarras: a.codigo_barras,
            precio: Number(a.precio),
            stock: a.stock ?? 0,
          };
        });

        setCatalogoArticulos(mapeados);
        setListaClientes(clientesApi || []);
        setError("");
      } catch (e: any) {
        console.error("Error al cargar datos:", e);
        setError("Error al cargar el catálogo o clientes. " + e.message);
        setCatalogoArticulos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Efecto para cerrar sugerencias si clicamos fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de filtrado mientras el usuario escribe
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    setCodigoBarras(texto);

    if (texto.length > 1) {
      const matches = catalogoArticulos.filter((art) => 
        art.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        art.codigoBarras.includes(texto)
      );
      setSugerencias(matches.slice(0, 5));
      setMostrarSugerencias(true);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  };

  // Lógica para agregar un artículo
  const procesarAgregadoDeArticulo = (articulo: ArticuloVenta) => {
    setError("");

    if (articulo.stock <= 0) {
      setError(`El artículo "${articulo.nombre}" no tiene stock disponible`);
      setCodigoBarras(""); 
      setMostrarSugerencias(false);
      return;
    }

    const itemExistente = itemsVenta.find(
      (item) => item.articulo.id === articulo.id,
    );

    if (itemExistente) {
      if (itemExistente.cantidad >= articulo.stock) {
        setError(
          `No hay suficiente stock de "${articulo.nombre}". Disponible: ${articulo.stock}`,
        );
        setCodigoBarras("");
        setMostrarSugerencias(false);
        return;
      }

      setItemsVenta(
        itemsVenta.map((item) =>
          item.articulo.id === articulo.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                subtotal: (item.cantidad + 1) * articulo.precio,
              }
            : item,
        ),
      );
    } else {
      setItemsVenta([
        ...itemsVenta,
        {
          articulo,
          cantidad: 1,
          subtotal: articulo.precio,
        },
      ]);
    }

    setCodigoBarras("");
    setSugerencias([]);
    setMostrarSugerencias(false);
  };

  // Buscar por código EXACTO
  const buscarArticuloPorCodigo = (codigo: string): ArticuloVenta | undefined => {
    return catalogoArticulos.find((art) => art.codigoBarras === codigo);
  };

  // Manejar el Submit (Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const codigo = codigoBarras.trim();
    if (!codigo) return;

    const articuloPorCodigo = buscarArticuloPorCodigo(codigo);

    if (articuloPorCodigo) {
      procesarAgregadoDeArticulo(articuloPorCodigo);
    } else {
      if (sugerencias.length === 1) {
        procesarAgregadoDeArticulo(sugerencias[0]);
      } else if (sugerencias.length > 1) {
        setError("Múltiples productos encontrados. Por favor selecciona uno de la lista.");
      } else {
        setError(`No se encontró ningún artículo con el código o nombre: ${codigo}`);
      }
    }
  };

  const eliminarItem = (articuloId: number) => {
    setItemsVenta(itemsVenta.filter((item) => item.articulo.id !== articuloId));
  };

  const actualizarCantidad = (articuloId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(articuloId);
      return;
    }

    const item = itemsVenta.find((i) => i.articulo.id === articuloId);
    if (!item) return;

    if (nuevaCantidad > item.articulo.stock) {
      setError(`Stock insuficiente. Disponible: ${item.articulo.stock}`);
      setItemsVenta(itemsVenta.map(i => i.articulo.id === articuloId ? {...i, cantidad: i.articulo.stock, subtotal: i.articulo.stock * i.articulo.precio} : i));
      return;
    }

    setError("");
    setItemsVenta(
      itemsVenta.map((item) =>
        item.articulo.id === articuloId
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * item.articulo.precio,
            }
          : item,
      ),
    );
  };

  const calcularTotal = (): number => {
    return itemsVenta.reduce((total, item) => total + item.subtotal, 0);
  };

  const calcularInteres = (): number => {
    if (esCtaCte) return 0; 
    if (formaPago === "credito") {
      const subtotal = calcularTotal();
      const porcentaje = parseFloat(interesPorcentaje) || 0;
      return (subtotal * porcentaje) / 100;
    }
    return 0;
  };

  const calcularTotalFinal = (): number => {
    return calcularTotal() + calcularInteres();
  };

  const confirmarVenta = () => {
    if (itemsVenta.length === 0) {
      setError("No hay productos en la venta");
      return;
    }
    if (esCtaCte && !clienteIdSeleccionado) {
      setError("Debe seleccionar un cliente para Cuenta Corriente");
      return;
    }
    setShowModal(true);
  };

  const procesarVenta = async () => {
    setIsSubmitting(true);
    setError("");

    const itemsDto: CreateVentaItemDto[] = itemsVenta.map(item => ({
      articuloId: Number(item.articulo.id), 
      cantidad: item.cantidad,
    }));

    const clienteEncontrado = esCtaCte && clienteIdSeleccionado 
      ? listaClientes.find((c) => c.id === clienteIdSeleccionado) 
      : null;

    const nombreGuardar = clienteEncontrado ? clienteEncontrado.nombre : (nombreCliente.trim() || "Cliente General");
    const estadoVenta = esCtaCte ? "Pendiente" : "Completada";

    const nuevaVenta: CreateVentaDto = {
      clienteNombre: nombreGuardar,
      clienteId: clienteEncontrado ? clienteEncontrado.id : undefined,
      items: itemsDto,
      formaPago: esCtaCte ? null : formaPago, 
      estado: estadoVenta,
      interes: calcularInteres(), 
    };

    try {
      const ventaGuardada = await createVenta(nuevaVenta);
      
      setShowModal(false);
      setExito(`¡Venta N° ${ventaGuardada.numeroVenta} registrada! Total: $${Number(ventaGuardada.total).toFixed(2)}`);
      
      setItemsVenta([]);
      setNombreCliente("");
      setClienteIdSeleccionado("");
      setFormaPago("efectivo");
      setEsCtaCte(false);
      setInteresPorcentaje("10");
      setCodigoBarras("");

      const apiItems = await getArticulos();
      const mapeados: ArticuloVenta[] = apiItems.map((a) => ({
        id: Number(a.id),
        nombre: a.nombre,
        marca: typeof a.marca === 'object' && a.marca !== null ? (a.marca as any).nombre || '' : String(a.marca || ''),
        codigoBarras: a.codigo_barras,
        precio: Number(a.precio),
        stock: a.stock ?? 0,
      }));
      setCatalogoArticulos(mapeados);
      
      setTimeout(() => setExito(""), 3000);

    } catch (apiError: any) {
      console.error("Error al procesar:", apiError);
      setError(apiError.message || "Error al procesar la venta.");
      setShowModal(false); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelarVenta = () => {
    setItemsVenta([]);
    setCodigoBarras("");
    setNombreCliente("");
    setClienteIdSeleccionado("");
    setFormaPago("efectivo");
    setEsCtaCte(false);
    setError("");
  };

  const handleCrearCliente = async () => {
    if (!nuevoClienteNombre.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    setIsCreatingCliente(true);
    setError("");
    try {
      const nuevoCliente = await createCliente({ nombre: nuevoClienteNombre.trim() });
      setListaClientes([...listaClientes, nuevoCliente]);
      setClienteIdSeleccionado(nuevoCliente.id);
      setShowModalCliente(false);
      setNuevoClienteNombre("");
      setExito(`Cliente ${nuevoCliente.nombre} creado con éxito.`);
      setTimeout(() => setExito(""), 3000);
    } catch (e: any) {
      setError(e.message || "Error al crear cliente");
    } finally {
      setIsCreatingCliente(false);
    }
  };

  return (
    <div>

      <div className="mt-4">
        <Card className="shadow-sm mb-3">
          <Card.Header className="d-flex align-items-center">
            <Button
              variant="link"
              onClick={() => navigate("/ventas")}
              className="p-0 me-2"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeft size={24} />
            </Button>
            <h5 className="mb-0">Registrar Nueva Venta</h5>
          </Card.Header>
          <Card.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {exito && (
              <Alert variant="success" className="d-flex align-items-center">
                <CheckCircle size={24} className="me-2" />
                {exito}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="🏦 Venta en Cuenta Corriente (pago pendiente)"
                checked={esCtaCte}
                onChange={(e) => {
                   setEsCtaCte(e.target.checked);
                   if (!e.target.checked) setClienteIdSeleccionado("");
                }}
              />
            </Form.Group>

            {esCtaCte ? (
              <Form.Group className="mb-3">
                <Form.Label>Seleccionar Cliente <span className="text-danger">*</span></Form.Label>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={clienteIdSeleccionado}
                    onChange={(e) => setClienteIdSeleccionado(e.target.value ? Number(e.target.value) : "")}
                  >
                    <option value="">-- Seleccione un cliente --</option>
                    {listaClientes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.telefono ? `(${c.telefono})` : ""}
                      </option>
                    ))}
                  </Form.Select>
                  <Button variant="outline-primary" onClick={() => setShowModalCliente(true)}>
                    + Nuevo
                  </Button>
                </div>
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Cliente (Opcional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre del cliente..."
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                />
              </Form.Group>
            )}

            {!esCtaCte && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Forma de Pago <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value as FormaPago)}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="debito">Débito</option>
                    <option value="credito">Crédito (con interés)</option>
                    <option value="transferencia">Transferencia</option>
                  </Form.Select>
                </Form.Group>

                {formaPago === "credito" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Interés para Tarjeta de Crédito (%)</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.5"
                        value={interesPorcentaje}
                        onChange={(e) => setInteresPorcentaje(e.target.value)}
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Interés actual: {interesPorcentaje}% (${calcularInteres().toFixed(2)})
                    </Form.Text>
                  </Form.Group>
                )}
              </>
            )}
            
            {esCtaCte && (
              <Alert variant="info" className="mt-2 mb-3">
                <small>
                  ℹ️ Esta venta quedará registrada como <strong>Pendiente</strong>.
                </small>
              </Alert>
            )}

            {/* *** CAMBIO CLAVE: Envolvemos el form en un DIV que tiene el REF *** */}
            <div ref={searchWrapperRef} style={{ position: "relative" }}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Buscar Producto (Nombre o Escáner)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      {codigoBarras.length > 0 && isNaN(Number(codigoBarras)) ? <Search size={16}/> : <Barcode size={16} />}
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder={isLoading ? "Cargando catálogo..." : "Escribe nombre o escanea código (ej: Granola)..."}
                      value={codigoBarras}
                      onChange={handleInputChange} 
                      autoFocus
                      disabled={isLoading}
                      autoComplete="off" 
                    />
                    <Button variant="primary" type="submit" disabled={isLoading}>
                      Agregar
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Si buscas por nombre, escribe y selecciona de la lista. Si usas lector, presiona el gatillo.
                  </Form.Text>

                  {/* LISTA FLOTANTE DE SUGERENCIAS */}
                  {mostrarSugerencias && sugerencias.length > 0 && (
                    <ListGroup 
                      style={{ 
                        position: "absolute", 
                        top: "100%", 
                        left: 0, 
                        right: 0, 
                        zIndex: 1050, 
                        maxHeight: "200px", 
                        overflowY: "auto",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                      }}
                    >
                      {sugerencias.map((art) => (
                        <ListGroup.Item 
                          key={art.id} 
                          action 
                          onClick={() => procesarAgregadoDeArticulo(art)}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{art.nombre}</strong>
                            <div className="text-muted small" style={{fontSize: '0.85em'}}>
                               {art.marca ? `${art.marca} - ` : ''} {art.codigoBarras}
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge bg={art.stock > 0 ? "success" : "danger"} pill>
                              Stock: {art.stock}
                            </Badge>
                            <div className="fw-bold text-primary mt-1">
                              ${art.precio.toFixed(2)}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>
              </Form>
            </div>

          </Card.Body>
        </Card>

        {itemsVenta.length > 0 && (
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Productos en la Venta</h6>
              <Badge bg="primary">
                {itemsVenta.length} producto{itemsVenta.length !== 1 ? "s" : ""}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead className="table-header-brand">
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unit.</th>
                    <th style={{ width: "150px" }}>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsVenta.map((item) => (
                    <tr key={item.articulo.id}>
                      <td>{item.articulo.nombre}</td>
                      <td>${item.articulo.precio.toFixed(2)}</td>
                      <td>
                        <InputGroup size="sm">
                          <Button
                            variant="outline-secondary"
                            onClick={() => actualizarCantidad(item.articulo.id, item.cantidad - 1)}
                          >
                            −
                          </Button>
                          <Form.Control
                            type="number"
                            min="1"
                            max={item.articulo.stock}
                            value={item.cantidad}
                            onChange={(e) => {
                              const valor = parseInt(e.target.value) || 0;
                              actualizarCantidad(item.articulo.id, valor);
                            }}
                            className="text-center"
                            style={{ maxWidth: "60px" }}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => actualizarCantidad(item.articulo.id, item.cantidad + 1)}
                            disabled={item.cantidad >= item.articulo.stock}
                          >
                            +
                          </Button>
                        </InputGroup>
                      </td>
                      <td>${item.subtotal.toFixed(2)}</td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarItem(item.articulo.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                    <td colSpan={3} className="text-end">SUBTOTAL:</td>
                    <td>${calcularTotal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                  {!esCtaCte && formaPago === "credito" && calcularInteres() > 0 && (
                    <tr style={{ backgroundColor: "#fff3cd" }}>
                      <td colSpan={3} className="text-end">INTERÉS ({interesPorcentaje}%):</td>
                      <td>${calcularInteres().toFixed(2)}</td>
                      <td></td>
                    </tr>
                  )}
                  <tr className="bg-slate-800 text-white font-bold">
                    <td colSpan={3} className="text-end">TOTAL A PAGAR:</td>
                    <td>${calcularTotalFinal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={cancelarVenta}>Cancelar Venta</Button>
                <Button variant="success" onClick={confirmarVenta}>Confirmar Venta</Button>
              </div>
            </Card.Body>
          </Card>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="modal-header-brand">
            <Modal.Title>Confirmar Venta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className="mb-3">Resumen de la venta:</h5>
            <p>
              <strong>Cliente:</strong>{" "}
              {esCtaCte && clienteIdSeleccionado 
                ? listaClientes.find((c) => c.id === clienteIdSeleccionado)?.nombre 
                : (nombreCliente || "Cliente General")}
            </p>
            {esCtaCte ? (
              <Alert variant="warning"><strong>⚠️ CUENTA CORRIENTE - Pago Pendiente</strong></Alert>
            ) : (
              <p><strong>Forma de Pago:</strong> {formaPago.charAt(0).toUpperCase() + formaPago.slice(1)}</p>
            )}
            <ul>
              {itemsVenta.map((item) => (
                <li key={item.articulo.id}>
                  {item.articulo.nombre} x {item.cantidad} = ${item.subtotal.toFixed(2)}
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span><strong>${calcularTotal().toFixed(2)}</strong>
            </div>
            {!esCtaCte && formaPago === "credito" && calcularInteres() > 0 && (
              <div className="d-flex justify-content-between text-warning">
                <span>Interés ({interesPorcentaje}%):</span><strong>${calcularInteres().toFixed(2)}</strong>
              </div>
            )}
            <hr />
            <h4 className="text-end">Total {esCtaCte ? "Pendiente" : "a Pagar"}: ${calcularTotalFinal().toFixed(2)}</h4>
            {error && isSubmitting && (
               <Alert variant="danger" className="mt-3">{error}</Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="success" onClick={procesarVenta} disabled={isSubmitting}>
              {isSubmitting ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Procesando...</> : "Confirmar y Procesar"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Nuevo Cliente */}
        <Modal show={showModalCliente} onHide={() => setShowModalCliente(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Juan Pérez"
                value={nuevoClienteNombre}
                onChange={(e) => setNuevoClienteNombre(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Alert variant="info" className="py-2">
              <small>
                Podrás completar más datos de este cliente desde la sección <strong>Cuentas Corrientes</strong>.
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalCliente(false)} disabled={isCreatingCliente}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCrearCliente} disabled={isCreatingCliente || !nuevoClienteNombre.trim()}>
              {isCreatingCliente ? <Spinner size="sm" animation="border" /> : "Guardar Cliente"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RegistrarVenta;