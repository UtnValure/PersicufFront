import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../helpers/autenticacion/validationSchemas';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginForm.css';

const LoginForm = () => {
  const { iniciarSesion, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await iniciarSesion(data);
    if (success) {
      navigate('/');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form p-4 shadow rounded">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        {/* Campo de usuario */}
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            id="nombreUsuario"
            {...register('nombreUsuario')}
          />
          {errors.nombreUsuario && <p className="text-danger">{errors.nombreUsuario.message}</p>}
        </div>

        {/* Campo de contraseña */}
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="clave"
            {...register('clave')}
          />
          {errors.clave && <p className="text-danger">{errors.clave.message}</p>}
        </div>

        {/* Mensaje de error */}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* Botones de acción */}
        <div className="d-flex flex-column flex-md-row gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            Iniciar Sesión
          </button>
          <button type="button" className="btn btn-secondary flex-grow-1" onClick={handleRegister}>
            Registrate
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;