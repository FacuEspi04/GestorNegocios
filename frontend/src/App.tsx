import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import Inicio from './components/Inicio';
import ArticuloDetail from './components/articulos/ArticuloDetail';
import ArticuloList from './components/articulos/ArticuloList';
import AgregarArticulo from './components/articulos/AgregarArticulo';
import EditarArticulo from './components/articulos/EditarArticulo';
import ProveedoresList from './components/proveedores/ProveedoresList';
import AgregarProveedor from './components/proveedores/AgregarProveedor';
import VentasList from './components/ventas/VentasList';
import RegistrarVenta from './components/ventas/RegistrarVenta';
import CuentasCorrientes from './components/ventas/CuentasCorrientes';
import CrearPedido from './components/proveedores/CrearPedido';
import ListaPedidos from './components/proveedores/ListaPedidos';

import RegistrarRetiro from './components/caja/RegistrarRetiro';
import EditarProveedor from './components/proveedores/EditarProveedor';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout 
              brand="Dietética San José"
            />
          }
        >
          {/* Ruta de inicio */}
          <Route index element={<Inicio />} />

          {/* Rutas de artículos */}
          <Route path="articulos" element={<ArticuloList />} />
          <Route path="articulos/nuevo" element={<AgregarArticulo />} />
          <Route path="articulos/:id" element={<ArticuloDetail />} />
          <Route path="/articulos/editar/:id" element={<EditarArticulo />} />

          {/* Rutas de proveedores */}
          <Route path="proveedores" element={<ProveedoresList />} />
          <Route path="proveedores/nuevo" element={<AgregarProveedor />} />
          <Route path="proveedores/pedidos/nuevo" element={<CrearPedido />} />
          <Route path="proveedores/pedidos/lista" element={<ListaPedidos />} />
          <Route path="proveedores/editar/:id" element={<EditarProveedor />} />

          {/* Rutas de ventas */}
          <Route path="ventas" element={<VentasList />} />
          <Route path="ventas/nueva" element={<RegistrarVenta />} />
          <Route path="ventas/cuentas-corrientes" element={<CuentasCorrientes />} />
          <Route path="/ventas/nuevo-retiro" element={<RegistrarRetiro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;