import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import '../../styles/styleheader.css';
import "bootswatch/dist/lux/bootstrap.min.css";

const HeaderForm = () => {
  const { user } = useContext(AuthContext); // Obtenemos `user` del contexto
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para manejar el término de búsqueda

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`); // Redirige a /buscar con el término
    }
  };

  const handleCerrrarSesionClick = () => {
    navigate("/logout"); // Redirige a la página de CerrarSesionForm
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        {/* Logo a la izquierda */}
        <NavLink className="navbar-brand text-white" to="/home">
          Persicuf
        </NavLink>

        {/* Botón de colapso para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          {/* Barra de búsqueda en el centro */}
          <form className="d-flex mx-auto my-2 my-lg-0" onSubmit={handleSearch} style={{ maxWidth: "400px" }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar..."
              aria-label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-secondary" type="submit">
              Buscar
            </button>
          </form>

          {/* Navegación a la derecha */}
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/mis-prendas" className="nav-link">
                    Mis Prendas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/mis-pedidos" className="nav-link">
                    Mis Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link">Bienvenido, {user.nombreUsuario}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleCerrrarSesionClick}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Registrarse
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Ingresá
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderForm;