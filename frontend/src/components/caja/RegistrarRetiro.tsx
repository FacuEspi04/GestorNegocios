import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Wallet } from 'lucide-react';
import { createRetiro, type CreateRetiroDto } from '../../services/apiService';

// Interfaz para el estado del formulario
interface RetiroForm {
  monto: string;
  motivo: string;
}

const RegistrarRetiro: React.FC = () => {
  const navigate = useNavigate();
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RetiroForm>({
    monto: '',
    motivo: '',
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
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      setError('El monto debe ser un número mayor a 0');
      return false;
    }
    if (!formData.motivo.trim()) {
      setError('El motivo del retiro es obligatorio');
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

    // Preparar DTO para la API
    const nuevoRetiro: CreateRetiroDto = {
      monto: parseFloat(formData.monto),
      motivo: formData.motivo.trim(),
    };

    try {
      await createRetiro(nuevoRetiro);

      console.log('Retiro guardado:', nuevoRetiro);

      // Mostrar mensaje de éxito
      setExito(true);

      // Redirigir de vuelta a la lista de ventas después de 2 segundos
      setTimeout(() => {
        navigate('/ventas');
      }, 2000);
    } catch (apiError: any) {
      console.error('Error al guardar retiro:', apiError);
      setError(apiError.message || 'Error al guardar el retiro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    navigate('/ventas'); // Volver a la lista de ventas
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
              style={{ textDecoration: 'none' }}
            >
              <ArrowLeft size={24} />
            </Button>
            <h5 className="mb-0">Registrar Retiro de Caja</h5>
          </Card.Header>
          <Card.Body>
            {/* Mensajes de error y éxito */}
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {exito && (
              <Alert variant="success" className="d-flex align-items-center">
                <CheckCircle size={24} className="me-2" />
                ¡Retiro registrado exitosamente! Redirigiendo...
              </Alert>
            )}

            {/* Formulario */}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Monto a Retirar <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="monto"
                        value={formData.monto}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                        autoFocus
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Motivo del Retiro <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      placeholder="Ej: Pago a proveedor, compra de insumos..."
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Alert variant="warning" className="d-flex align-items-center">
                <Wallet size={20} className="me-2" />
                Este monto se descontará del total recaudado del día en el
                reporte de ventas.
              </Alert>

              <Form.Text className="text-muted d-block mb-3">
                Los campos marcados con <span className="text-danger">*</span>{' '}
                son obligatorios
              </Form.Text>

              {/* Botones de acción */}
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCancelar}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Guardando...
                    </>
                  ) : (
                    'Guardar Retiro'
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

export default RegistrarRetiro;

