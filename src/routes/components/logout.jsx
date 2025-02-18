import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "bootswatch/dist/lux/bootstrap.min.css";

const LogoutForm = () => {
  const { cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    await cerrarSesion();
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 text-center">
              <p>¿Estás seguro de que deseas cerrar sesión?</p>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-danger">
                Cerrar Sesión
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogoutForm;