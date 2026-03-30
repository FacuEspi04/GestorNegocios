import { useState, useEffect, useMemo } from 'react';
import { formatearMoneda } from '../../utils/formatters';
import {
  Table,
  Card,
  Form,
  InputGroup,
  Badge,
  Alert,
  Button,
  Modal,
  Spinner,
} from 'react-bootstrap';
import {
  Search,
  AlertTriangle,
  Plus,
  Trash2,
  Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getArticulos,
  deleteArticulo,
  type Articulo,
} from '../../services/apiService';

const ArticuloList: React.FC = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getArticulos();
      setArticulos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los artículos');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarEliminacion = (articulo: Articulo) => {
    setArticuloAEliminar(articulo);
    setShowModal(true);
  };

  const handleEditar = (id: number) => {
    navigate(`/articulos/editar/${id}`);
  };

  const eliminarArticulo = async () => {
    if (!articuloAEliminar) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteArticulo(articuloAEliminar.id);
      setArticulos((prevArticulos) =>
        prevArticulos.filter((art) => art.id !== articuloAEliminar.id),
      );
      setShowModal(false);
      setArticuloAEliminar(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el artículo');
    } finally {
      setIsDeleting(false);
    }
  };

  const articulosFiltrados = useMemo(() => {
    const terminoBusqueda = busqueda.toLowerCase().trim();
    if (!terminoBusqueda) return articulos;
    return articulos.filter((articulo) => {
      return (
        (articulo.codigo_barras && articulo.codigo_barras.includes(terminoBusqueda)) ||
        (articulo.nombre && articulo.nombre.toLowerCase().includes(terminoBusqueda)) ||
        (articulo.marca && articulo.marca.nombre.toLowerCase().includes(terminoBusqueda)) ||
        (articulo.categoria && articulo.categoria.nombre.toLowerCase().includes(terminoBusqueda))
      );
    });
  }, [articulos, busqueda]);

  const articulosStockBajo = useMemo(() => {
    return articulos.filter((articulo) => articulo.stock <= articulo.stock_minimo);
  }, [articulos]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Artículos</h1>
        <Button
          variant="dark"
          size="sm"
          onClick={() => navigate('/articulos/nuevo')}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          Agregar Artículo
        </Button>
      </div>

      {articulosStockBajo.length > 0 && (
        <Alert variant="warning" className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-amber-500 shrink-0" />
              <div>
                <strong>
                  Stock bajo en {articulosStockBajo.length} producto
                  {articulosStockBajo.length !== 1 ? "s" : ""}:
                </strong>
                <ul className="mb-0 mt-1 text-sm">
                  {articulosStockBajo.map((art) => (
                    <li key={art.id}>
                      {art.nombre} (Stock: {art.stock} / Mín: {art.stock_minimo})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => navigate('/proveedores/pedidos/nuevo')}
            >
              Crear Pedido
            </Button>
          </div>
        </Alert>
      )}

      <Card>
        <Card.Body>
          {error && !isDeleting && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-4">
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Search size={16} className="text-slate-400" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por código, nombre, marca o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoFocus
                className="border-start-0"
              />
            </InputGroup>
            <Form.Text className="text-muted">
              {articulosFiltrados.length} artículo
              {articulosFiltrados.length !== 1 ? 's' : ''} encontrado
              {articulosFiltrados.length !== 1 ? 's' : ''}
            </Form.Text>
          </Form.Group>

          {isLoading ? (
            <div className="text-center py-10">
              <Spinner animation="border" />
              <p className="mt-2 text-slate-500">Cargando artículos...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive className="table-header-brand">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código de Barras</th>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Stock</th>
                  <th>Stock Mínimo</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articulosFiltrados && articulosFiltrados.length > 0 ? (
                  articulosFiltrados.map((articulo) => (
                    <tr key={articulo.id}>
                      <td>{articulo.id}</td>
                      <td>
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{articulo.codigo_barras}</code>
                      </td>
                      <td className="font-medium">{articulo.nombre}</td>
                      <td>
                        {articulo.marca ? articulo.marca.nombre : <small className="text-muted">N/A</small>}
                      </td>
                      <td>
                        {articulo.stock <= articulo.stock_minimo ? (
                          <Badge bg="danger">{articulo.stock}</Badge>
                        ) : (
                          <Badge bg="success">{articulo.stock}</Badge>
                        )}
                      </td>
                      <td>{articulo.stock_minimo}</td>
                        <td className="font-medium">{formatearMoneda(articulo.precio)}</td>
                      <td className="text-center">
                        <div className="flex gap-1.5 justify-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditar(articulo.id)}
                            title="Editar artículo"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmarEliminacion(articulo)}
                            title="Eliminar artículo"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-slate-500">
                      {busqueda
                        ? `No se encontraron artículos que coincidan con "${busqueda}"`
                        : 'No hay artículos disponibles. Comienza agregando uno.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="modal-header-brand">
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && isDeleting && <Alert variant="danger">{error}</Alert>}
          {articuloAEliminar && (
            <>
              <p>¿Estás seguro de que deseas eliminar el siguiente artículo?</p>
              <div className="alert alert-warning">
                <strong>{articuloAEliminar.nombre}</strong>
                <br />
                {articuloAEliminar.marca && (
                  <>
                    Marca: {articuloAEliminar.marca.nombre}
                    <br />
                  </>
                )}
                Código: <code>{articuloAEliminar.codigo_barras}</code>
                <br />
                  Precio: {formatearMoneda(articuloAEliminar.precio)}
              </div>
              <p className="text-danger">
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarArticulo} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArticuloList;
