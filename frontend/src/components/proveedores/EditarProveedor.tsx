import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
// --- MODIFICADO: Importar tipos y funciones de Proveedor ---
// --- AÑADIDO: 'getProveedorById' ---
import {
  getProveedorById,
  updateProveedor,
  type UpdateProveedorDto,
} from '../../services/apiService';

// Interfaz para el estado del formulario
interface ProveedorForm {
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
}

const EditarProveedor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const proveedorId = Number(id);

  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProveedorForm>({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
  });

  // Cargar datos del proveedor al montar
  useEffect(() => {
    if (!proveedorId) {
      setError('ID de proveedor inválido.');
      setIsLoading(false);
      return;
    }

    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        // --- CORREGIDO: Llamar a 'getProveedorById' ---
        const proveedorData = await getProveedorById(proveedorId);

        // Llenamos el formulario con los datos del proveedor
        setFormData({
          nombre: proveedorData.nombre,
          contacto: proveedorData.contacto || '', // Manejar posibles nulos
          telefono: proveedorData.telefono || '', // Manejar posibles nulos
          email: proveedorData.email || '',     // Manejar posibles nulos
        });
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(err.message || 'No se pudieron cargar los datos del proveedor.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [proveedorId]);

  // Manejador de cambios simple
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validación simple
  const validarFormulario = (): boolean => {
    if (!formData.nombre.trim()) {
      setError('El nombre del proveedor es obligatorio');
      return false;
    }

    // Validación simple de email (si se ingresó uno)
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setError('El formato del email no es válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito(false);

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);

    // Preparar DTO de actualización
    const proveedorActualizado: UpdateProveedorDto = {
      nombre: formData.nombre.trim(),
      contacto: formData.contacto.trim() || null, // Enviar null si está vacío
      telefono: formData.telefono.trim() || null, // Enviar null si está vacío
      email: formData.email.trim() || null,     // Enviar null si está vacío
    };

    try {
      await updateProveedor(proveedorId, proveedorActualizado);
      setExito(true);

      setTimeout(() => {
        navigate('/proveedores'); // Redirigir a la lista de proveedores
      }, 2000);
    } catch (apiError: any) {
      console.error('Error al actualizar proveedor:', apiError);
      setError(apiError.message || 'Error al actualizar el proveedor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    navigate('/proveedores'); // Redirigir a la lista de proveedores
  };

  // --- RENDERIZADO ---

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Cargando datos del proveedor...</p>
      </div>
    );
  }

  return (
    <div>

      <div className="mt-4">
        <Card className="shadow-sm">
          <Card.Header className="d-flex align-items-center">
            {/* Botón Volver */}
            <Button
              variant="link"
              onClick={handleCancelar}
              className="p-0 me-2"
              style={{ textDecoration: 'none' }}
            >
              <ArrowLeft size={24} />
            </Button>
            <h5 className="mb-0">Editar Proveedor: {formData.nombre}</h5>
          </Card.Header>
          <Card.Body>
            {/* Alertas */}
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {exito && (
              <Alert variant="success" className="d-flex align-items-center">
                <CheckCircle size={24} className="me-2" />
                ¡Proveedor actualizado exitosamente! Redirigiendo...
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Nombre */}
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
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Contacto */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contacto</Form.Label>
                    <Form.Control
                      type="text"
                      name="contacto"
                      value={formData.contacto}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Teléfono */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>📞</InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                {/* Email */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>@</InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ejemplo@proveedor.com"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Text className="text-muted d-block mb-3">
                Los campos marcados con <span className="text-danger">*</span> son
                obligatorios
              </Form.Text>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCancelar}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" />
                      {' '}Guardando Cambios...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      {/* Modal de "Nueva Marca" eliminado ya que no aplica */}
    </div>
  );
};

export default EditarProveedor;