import React, { useState } from "react";
import { Card, Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createProveedor, type CreateProveedorDto} from "../../services/apiService"; // Importar

// La interfaz ahora coincide con el DTO
interface ProveedorForm {
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  cuit: string;
  notas: string;
}

const AgregarProveedor: React.FC = () => {
  const navigate = useNavigate();
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de carga

  const [formData, setFormData] = useState<ProveedorForm>({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
    cuit: "",
    notas: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validarFormulario = (): boolean => {
    if (!formData.nombre.trim()) {
      setError("El nombre del proveedor es obligatorio");
      return false;
    }
    if (!formData.contacto.trim()) {
      setError("El nombre del contacto es obligatorio");
      return false;
    }
    if (!formData.telefono.trim()) {
      setError("El teléfono es obligatorio");
      return false;
    }
    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return false;
    }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El formato del email no es válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito(false);

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);

    // Preparar DTO para la API
    const proveedorDto: CreateProveedorDto = {
      nombre: formData.nombre,
      contacto: formData.contacto,
      telefono: formData.telefono,
      email: formData.email,
      direccion: formData.direccion || undefined,
      cuit: formData.cuit || undefined,
      notas: formData.notas || undefined,
    };

    try {
      await createProveedor(proveedorDto);
      
      setExito(true);
      setIsSubmitting(false);

      // Limpiar formulario (opcional, ya que redirigimos)
      setFormData({
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
        cuit: "",
        notas: "",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/proveedores");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Error al guardar el proveedor");
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    navigate("/proveedores");
  };

  return (
    <div>
      {/* Logo en la esquina superior derecha */}

      <div className="mt-4">
        <Card className="shadow-sm">
          <Card.Header className="d-flex align-items-center">
            <Button
              variant="link"
              onClick={handleCancelar}
              className="p-0 me-2"
              style={{ textDecoration: "none" }}
              disabled={isSubmitting}
            >
              <ArrowLeft size={24} />
            </Button>
            <h5 className="mb-0">Agregar Nuevo Proveedor</h5>
          </Card.Header>
          <Card.Body>
            {/* Mensajes de error y éxito */}
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {exito && (
              <Alert variant="success" className="d-flex align-items-center">
                <CheckCircle size={24} className="me-2" />
                ¡Proveedor agregado exitosamente! Redirigiendo...
              </Alert>
            )}

            {/* Formulario */}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Nombre del Proveedor <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Distribuidora Natural"
                      required
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Persona de Contacto <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contacto"
                      value={formData.contacto}
                      onChange={handleChange}
                      placeholder="Ej: Juan Pérez"
                      required
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Teléfono <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej: 261-4567890"
                      required
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ej: contacto@proveedor.com"
                      required
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CUIT</Form.Label>
                    <Form.Control
                      type="text"
                      name="cuit"
                      value={formData.cuit}
                      onChange={handleChange}
                      placeholder="Ej: 20-12345678-9"
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Ej: Calle Falsa 123, Mendoza"
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Notas / Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  placeholder="Información adicional sobre el proveedor..."
                  disabled={isSubmitting}
                />
              </Form.Group>

              <Form.Text className="text-muted d-block mb-3">
                Los campos marcados con <span className="text-danger">*</span> son
                obligatorios
              </Form.Text>

              {/* Botones de acción */}
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCancelar} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Proveedor"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AgregarProveedor;
