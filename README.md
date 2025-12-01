
# Sistema de Gestión Integral (POS) - Dietética San José

Aplicación web Full Stack diseñada para digitalizar y optimizar el flujo operativo de un comercio de alimentos naturales. El sistema centraliza la gestión de inventario, la relación con proveedores y el punto de venta, ofreciendo una solución robusta para la administración diaria del local.

## Características Principales

* **Punto de Venta Híbrido (Smart POS):** Interfaz de facturación optimizada que unifica la entrada de datos. Permite la carga ágil mediante **lector de códigos de barras** (hardware) para productos envasados o **búsqueda predictiva** para productos a granel, visualizando stock y precio en tiempo real.
* **Gestión de Inventario y Proveedores:** Módulo integral para el control de stock y la generación de pedidos a proveedores, facilitando la reposición de mercadería y el control de costos.
* **Cuentas Corrientes:** Sistema de registro de deudas y pagos pendientes ("fiado") asociados a clientes específicos, con seguimiento de saldos.
* **Lógica Financiera y Turnos:**
    * Cálculo automático de recargos por intereses según el método de pago (Tarjetas de Crédito).
    * Asignación automática de ventas a turnos operativos ("Mañana" o "Tarde") mediante algoritmos de normalización horaria en el Backend.

## Stack Tecnológico

* **Frontend:** React, TypeScript, React-Bootstrap (UI), Vite.
* **Backend:** NestJS (Arquitectura modular y escalable).
* **ORM:** TypeORM para el modelado de datos y relaciones.
* **Base de Datos:** **SQLite**. Seleccionada por su eficiencia en despliegues locales (On-Premise), bajo consumo de recursos y facilidad para la gestión de copias de seguridad (Backups) sin requerir un servidor dedicado.

## Destacado Técnico: UX en el Proceso de Cobro

Uno de los mayores desafíos fue optimizar la velocidad de atención en caja. Se desarrolló un componente de entrada personalizado que:
1.  Detecta el origen de la entrada (Teclado vs. Escáner HID).
2.  Si es texto, despliega sugerencias instantáneas con validación de stock.
3.  Si es código de barras, añade el producto directamente.
4.  Maneja conflictos de tipos de datos complejos (objetos vs. strings) provenientes de la API para asegurar una experiencia de usuario fluida y libre de errores.

Si es código de barras, añade el producto directamente.

Maneja conflictos de tipos de datos complejos (objetos vs. strings) provenientes de la API para asegurar una experiencia de usuario fluida y libre de errores.
