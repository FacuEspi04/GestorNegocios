import { NavLink, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  Home,
  Package,
  ShoppingCart,
  ClipboardList,
} from 'lucide-react';

interface LayoutProps {
  navLinks?: { name: string; path: string }[];
}

const Layout: React.FC<LayoutProps> = ({
  navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Articulos', path: '/articulos' },
    { name: 'Pedidos', path: '/proveedores/pedidos/lista' },
    { name: 'Ventas', path: '/ventas' },
  ],
}) => {
  const navIcons: Record<string, React.ReactNode> = {
    'Inicio': <Home size={18} />,
    'Articulos': <Package size={18} />,
    'Pedidos': <ClipboardList size={18} />,
    'Ventas': <ShoppingCart size={18} />,
  };

  return (
    <div className="layout-container">
      {/* Navbar */}
      <Navbar variant="dark" expand="md" className="main-navbar" collapseOnSelect>
        <Container fluid className="justify-content-center">
          {/* Botón de hamburguesa centrado en mobile sin texto */}
          <Navbar.Toggle aria-controls="main-navbar-nav" className="border-0 shadow-none mx-auto mt-2 mb-2" />
          
          <Navbar.Collapse id="main-navbar-nav" className="justify-content-center">
            <Nav className="gap-2 text-center my-2 my-md-0">
              {navLinks.map((link, index) => {
                return (
                  <NavLink
                    key={index}
                    to={link.path}
                    className={({ isActive }) =>
                      `nav-link p-2 rounded custom-navlink ${isActive ? "active" : ""}`
                    }
                  >
                    {navIcons[link.name] || <Home size={18} />}
                    <span className="ms-2">{link.name}</span>
                  </NavLink>
                );
              })}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main content */}
      <div className="main-content mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
