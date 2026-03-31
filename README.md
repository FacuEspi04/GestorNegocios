
---

## **Sistema de Gestión Integral (POS)**

Software **Full Stack** diseñado para la digitalización y optimización del flujo operativo en comercios minoristas. El sistema centraliza la facturación, el control de inventario y la relación con proveedores en una plataforma robusta, ágil y escalable.

---

## **Características Principales**

### **Punto de Venta Inteligente (Smart POS)**
Interfaz de facturación de alta velocidad diseñada para optimizar la atención al cliente:
* **Entrada Híbrida:** Detección inteligente entre **lector de códigos de barras** para productos envasados y **búsqueda predictiva** para artículos por unidad o peso.
* **Validación de Stock:** Control automático en **tiempo real** durante la carga de productos para asegurar la integridad de las existencias.

### **Gestión de Inventario y Proveedores**
* **Control de Stock Crítico:** Monitoreo constante de niveles de mercadería con alertas de reposición configurables.
* **Módulo de Proveedores:** Registro histórico de compras y gestión de costos para mantener actualizados los **márgenes de ganancia**.

### **Finanzas y Cuentas Corrientes**
* **Gestión de Crédito a Clientes:** Sistema de cuentas corrientes para clientes recurrentes con seguimiento detallado de saldos y pagos.
* **Lógica de Recargos Dinámica:** Cálculo automático de intereses según el **método de pago** (débito, crédito o efectivo) configurado en el sistema.
* **Control de Turnos Operativos:** Algoritmo de **normalización horaria** que asigna automáticamente cada transacción al turno correspondiente.

---

## **Stack Tecnológico**

El proyecto utiliza una arquitectura desacoplada para garantizar estabilidad y facilidad de mantenimiento:

* **Frontend:** React 18, **TypeScript**, Vite, React-Bootstrap, Tailwind CSS.
* **Backend:** **NestJS** (Arquitectura Modular), Node.js.
* **Persistencia:** **SQLite** (Optimizado para despliegues locales, portabilidad y copias de seguridad rápidas).
* **ORM:** **TypeORM** para el modelado de datos y relaciones complejas.

---

## **Destacados Técnicos**

* **Arquitectura On-Premise:** La elección de **SQLite** permite que el comercio opere sin dependencia de servidores de base de datos externos, facilitando la seguridad de los datos locales.
* **Optimización de UI/UX:** Diseño responsivo **Mobile First** que permite la gestión del inventario y la visualización de reportes desde cualquier dispositivo.
* **Integridad y Validación:** Implementación de **DTOs** (Data Transfer Objects) y validaciones estrictas en el Backend para asegurar la precisión de los datos.
* **Diseño Modular:** Estructura preparada para la integración de nuevos módulos, permitiendo adaptar el software a las necesidades específicas de distintos rubros comerciales.