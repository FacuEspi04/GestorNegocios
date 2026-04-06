import React, { useEffect, useState } from "react";
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
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import * as S from '../ui/styles';

const ListaPedidos: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [proveedorId, setProveedorId] = useState<string>("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState<Pedido | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const abrirModalEliminar = (pedido: Pedido) => {
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

  // Parsear la fecha como local (no UTC) para evitar el desfase de timezone.
  // "2026-04-04" sin hora se toma como UTC midnight; agregando T00:00:00 se fuerza a local.
  const parseFecha = (fecha: string | Date) => {
    if (!fecha) return new Date();
    // Si ya es un objeto Date, devolverlo directamente
    if (fecha instanceof Date) return fecha;
    // Si ya incluye hora (ISO con T), usarlo directo
    if (fecha.includes('T')) return new Date(fecha);
    // Si es solo fecha "YYYY-MM-DD", parsear como local
    const [y, m, d] = fecha.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const imprimirPedido = (pedido: Pedido) => {
    const doc = new jsPDF();
    const margin = 14;
    const fechaFormateada = parseFecha(pedido.fechaPedido).toLocaleDateString("es-AR");

    addPDFHeader(doc, "Pedido a Proveedor", `Fecha: ${fechaFormateada}`);

    doc.setFontSize(11);

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

    startY += 10;
    doc.setFontSize(14);
    doc.text("Artículos Pedidos", margin, startY);

    autoTable(doc, {
      startY: startY + 4,
      head: [["Artículo", "Cantidad"]],
      body: pedido.items.map((i) => {
        const cantidadTxt = i.articulo.esPesable ? formatearPeso(i.cantidad) : String(i.cantidad);
        return [
          i.articulo.nombre,
          cantidadTxt,
        ];
      }),
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59], halign: "center" },
      columnStyles: { 0: { halign: "center" }, 1: { halign: "center" } },
    });

    doc.save(`pedido_${pedido.proveedor.nombre.replace(/ /g, "_")}_${fechaFormateada}.pdf`);
  };

  const pedidosFiltrados = pedidos;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Lista de Pedidos</h1>
        <div className="flex flex-wrap gap-2">
          <button className={S.btnOutlineDark} onClick={() => navigate("/proveedores")}><Users size={14} className="mr-1" /> Proveedores</button>
          <button className={S.btnSuccess} onClick={() => navigate("/proveedores/pedidos/nuevo")}><PlusCircle size={14} className="mr-1" /> Nuevo Pedido</button>
        </div>
      </div>

      <div className={S.card}>
        <div className={S.cardBody}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={S.label}>Proveedor</label>
              <select
                className={S.select}
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
              >
                <option value="">Todos</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={S.label}>Desde (fecha)</label>
              <input
                type="date"
                className={S.input}
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
            <div>
              <label className={S.label}>Hasta (fecha)</label>
              <input
                type="date"
                className={S.input}
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className={S.alertDanger}>
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-2">✕</button>
            </div>
          )}
          {exito && (
            <div className={S.alertSuccess}>
              {exito}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10">
              <Spinner />
              <p className="mt-2 text-slate-500">Cargando pedidos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className={S.table}>
                <thead className={S.tableHeaderBrand}>
                  <tr>
                    <th className={S.th}>Fecha</th>
                    <th className={S.th}>Proveedor</th>
                    <th className={S.th}>Ítems</th>
                    <th className={S.th} align="center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.length > 0 ? (
                    pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id} className={`${S.trStriped} ${S.trHover}`}>
                        <td className={S.td}>
                          {parseFecha(pedido.fechaPedido).toLocaleDateString("es-AR")}
                        </td>
                        <td className={`${S.td} font-medium`}>{pedido.proveedor.nombre}</td>
                        <td className={S.td}>{pedido.items.length}</td>
                        <td className={`${S.td} text-center`}>
                          <div className="flex gap-1.5 justify-center">
                            <button
                              className={S.btnInfo}
                              onClick={() => {
                                setPedidoDetalle(pedido);
                                setShowDetalle(true);
                              }}
                            >
                              Ver
                            </button>
                            {pedido.estado === "Borrador" && (
                              <button
                                className={S.btnSuccess}
                                onClick={() => navigate(`/proveedores/pedidos/editar/${pedido.id}`)}
                              >
                                Editar
                              </button>
                            )}
                            <button
                              className={S.btnWarning}
                              onClick={() => imprimirPedido(pedido)}
                              title="Descargar PDF"
                            >
                              <FileDown size={14} />
                            </button>
                            <button
                              className={S.btnOutlineDanger}
                              onClick={() => abrirModalEliminar(pedido)}
                              title="Eliminar pedido"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className={`${S.td} text-center py-6 text-slate-500`}>
                        No hay pedidos registrados en este rango/proveedor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Modal show={showDetalle} onHide={() => setShowDetalle(false)}>
            <Modal.Header closeButton onHide={() => setShowDetalle(false)} className="modal-header-brand">
              <Modal.Title>Detalle de Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {pedidoDetalle && (
                <>
                  <div className="mb-2">
                    <strong>Fecha:</strong>{" "}
                    {parseFecha(pedidoDetalle.fechaPedido).toLocaleDateString("es-AR")}
                  </div>
                  <div className="mb-2">
                    <strong>Proveedor:</strong> {pedidoDetalle.proveedor.nombre}
                  </div>
                  <div className="mt-4 mb-2">
                    <strong>Artículos:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {pedidoDetalle.items.map((i) => (
                        <li key={i.id}>
                          {i.articulo.nombre} x {i.articulo.esPesable ? formatearPeso(i.cantidad) : i.cantidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {pedidoDetalle.notas && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <strong>Observaciones:</strong> <br/>
                      {pedidoDetalle.notas}
                    </div>
                  )}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button className={S.btnSecondary} onClick={() => setShowDetalle(false)}>
                Cerrar
              </button>
              {pedidoDetalle && (
                <button
                  className={S.btnWarning}
                  onClick={() => imprimirPedido(pedidoDetalle)}
                >
                  <FileDown size={14} className="mr-1" />
                  Descargar PDF
                </button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal show={showDeleteModal} onHide={cancelarEliminacion}>
            <Modal.Header closeButton onHide={cancelarEliminacion} className="modal-header-brand">
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && isDeleting && <div className={S.alertDanger}>{error}</div>}
              {pedidoAEliminar && (
                <>
                  <p>
                    ¿Estás seguro de que deseas eliminar permanentemente el pedido al proveedor{" "}
                    <strong>{pedidoAEliminar.proveedor.nombre}</strong>?
                  </p>
                  <div className={S.alertWarning}>
                    <div>
                      <strong>Fecha:</strong>{" "}
                      {parseFecha(pedidoAEliminar.fechaPedido).toLocaleDateString("es-AR")}
                      <br />
                      <strong>Items:</strong> {pedidoAEliminar.items.length}
                    </div>
                  </div>
                  <p className="text-red-600 font-bold mb-0">Esta acción no se puede deshacer.</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                className={S.btnSecondary}
                onClick={cancelarEliminacion}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                className={S.btnDanger}
                onClick={confirmarEliminacion}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ListaPedidos;
