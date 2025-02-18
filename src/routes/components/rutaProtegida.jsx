import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RutaProtegida = ({ children, requiredRole }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    // Redirigir a la página de iniciarsesion si no está autenticado
    return <Navigate to="/iniciarsesion" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirigir a una página de error o inicio si no tiene el rol adecuado
    return <Navigate to="/accesodenegado" replace />;
  }

  // Si pasa las verificaciones, renderizar el contenido protegido
  return children;
};

export default RutaProtegida;