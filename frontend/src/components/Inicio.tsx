import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ClipboardList, ShoppingCart } from "lucide-react";
import logo from "../assets/dietSanJose.png";
const Inicio: React.FC = () => {
  const navigate = useNavigate();

  // Ocultar scrollbar en Inicio (no hay contenido que scrollear)
  // y restaurar al salir para que otras páginas puedan scrollear
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const cards = [
    {
      title: "Artículos",
      desc: "Gestiona tu inventario de productos dietéticos y naturales.",
      icon: <Package size={28} className="text-white" />,
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500",
      path: "/articulos",
    },
    {
      title: "Pedidos",
      desc: "Administra y haz seguimiento de tus pedidos a proveedores.",
      icon: <ClipboardList size={28} className="text-white" />,
      bg: "bg-emerald-500/10",
      iconBg: "bg-emerald-500",
      path: "/proveedores/pedidos/lista",
    },
    {
      title: "Ventas",
      desc: "Registra y consulta todas las ventas realizadas.",
      icon: <ShoppingCart size={28} className="text-white" />,
      bg: "bg-amber-500/10",
      iconBg: "bg-amber-500",
      path: "/ventas",
    },
  ];

  return (
    <div style={{ height: "calc(100vh - 80px)", overflow: "hidden" }} className="d-flex flex-column align-items-center pt-4 px-3">
      <div className="flex flex-col items-center mb-4">
        <img
          src={logo}
          alt="Dietética San José"
          className="object-contain mb-2"
          style={{ height: "80px" }}
        />
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Bienvenido a Dietética San José
        </h2>
        <p className="text-slate-500 text-sm mt-0">
          Selecciona una sección para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-100">
        {cards.map((card) => (
          <div
            key={card.title}
            className="nav-card"
            onClick={() => navigate(card.path)}
          >
            <div className={`icon-wrapper ${card.iconBg}`} style={{ borderRadius: 12 }}>
              {card.icon}
            </div>
            <h5 className="text-lg font-semibold text-slate-900 mb-1">{card.title}</h5>
            <p className="text-sm text-slate-500 mb-0">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;
