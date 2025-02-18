import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../../context/AuthContext";
import { getDomicilioIDUsuario, createDomicilio, deleteDomicilio } from "../../helpers/domicilioService";
import { createPedido, getUltimoPedidoUsuario, putPedido } from '../../helpers/pedidosService';
import { createPedidoPrenda } from '../../helpers/pedidoprendaService';
// import { createEnvio } from '../../helpers/envioAPI';
import { getDomicilioPorID } from '../../helpers/domicilioService';
import Cargando from './Cargando';
import '../../styles/detallesPedido.css'

const DetallesPedido = () => {
  const { userId } = useContext(AuthContext);
  const [domicilios, setDomicilios] = useState([]);
  const [selectedDomicilios, setSelectedDomicilios] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [nuevoDomicilio, setNuevoDomicilio] = useState({
    calle: "",
    numero: "",
    piso: "",
    depto: "",
    descripcion: "",
    userId,
    localidadID: 1,
  });
  const [tarjeta, setTarjeta] = useState({
    nombre: '',
    numero: '',
    expiracion: '',
    cvv: ''
  });
  const [tarjetaGuardada, setTarjetaGuardada] = useState(null);
  const [mostrarFormTarjeta, setMostrarFormTarjeta] = useState(true);
  const [cargando, setCargando] = useState(true);

  const location = useLocation();
  const { prenda, cantidad, total, imagenDirrecion } = location.state || {};

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchDomicilios = async () => {
      try {
        const userDomicilios = await getDomicilioIDUsuario(userId);
        setDomicilios(Array.isArray(userDomicilios) ? userDomicilios : [userDomicilios]);
      } catch (error) {
        console.error("Error al obtener domicilios: ", error);
      }
    };

    fetchDomicilios();
  }, [userId, nuevoDomicilio]);

  const addNuevoDomicilio = async () => {
    if (!userId) {
      console.error("Error: userId no está definido.");
      alert("Error: No se encontró el usuario.");
      return;
    }

    const domicilioData = {
      calle: nuevoDomicilio.calle,
      numero: nuevoDomicilio.numero,
      piso: nuevoDomicilio.piso || 0,
      depto: nuevoDomicilio.depto || "",
      descripcion: nuevoDomicilio.descripcion || "",
      usuarioID: userId,
      localidadID: 1
    };

    try {
      const response = await createDomicilio(domicilioData);
      setDomicilios([...domicilios, response]);
      setNuevoDomicilio({ calle: "", numero: "", piso: "", depto: "", descripcion: "", userId, localidadID: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear domicilio: ", error);
    }
  };

  const removerDomicilio = async (id) => {
    try {
      await deleteDomicilio(id);
      setDomicilios(domicilios.filter((domicilio) => domicilio.id !== id));
      if (selectedDomicilios === id) {
        setSelectedDomicilios(null);
      }
    } catch (error) {
      console.error("Error al eliminar domicilio: ", error);
    }
  };

  const handleCreatePedido = async () => {
    if (!selectedDomicilios) {
      alert("Selecciona un domicilio para el pedido.");
      return;
    }

    if (!tarjetaGuardada) {
      alert("Debes guardar los datos de la tarjeta antes de crear el pedido.");
      return;
    }

    let pedidoData = {
      precioTotal: total,
      domicilioID: selectedDomicilios,
      usuarioID: userId,
    };

    try {
      await createPedido(pedidoData);
      alert("Pedido creado exitosamente!");

      const pedidoID = await getUltimoPedidoUsuario(userId);

      const pedidoPrendaData = {
        cantidad: cantidad,
        prendaID: prenda.datos.id,
        pedidoID: pedidoID,
      };
      
      await createPedidoPrenda(pedidoPrendaData);
      // const origen = {
      //   calle: "52",
      //   numero: 777,
      //   piso: null,
      //   depto: null,
      //   descripcion: "Fabrica Persicuf",
      //   localidadID: 5,
      // };

      // let destino = await getDomicilioPorID(selectedDomicilios);
      // const envioData = {
      //   descripcion: "Envío de prenda Persicuf Nro: " + pedidoID,
      //   hora: "17:30",
      //   pesoGramos: (cantidad * 130) + 100,
      //   reserva: true,
      //   origen,
      //   destino,
      //   cliente: "850cdde8-591e-413d-8e67-48c649a8650f",
      // };

      // let nroSeguimiento = await createEnvio(envioData);

      // pedidoData = {
      //   precioTotal: total,
      //   domicilioID: selectedDomicilios,
      //   usuarioID: userId,
      //   nroSeguimiento,
      // };

      // await putPedido(pedidoID, pedidoData);
      navigate('/mis-pedidos');
    } catch (error) {
      console.error("Error al crear pedido: ", error);
      alert("Hubo un problema al crear el pedido.");
    }
  };

  const guardarTarjeta = () => {
    if (!tarjeta.nombre || !tarjeta.numero || !tarjeta.expiracion || !tarjeta.cvv) {
      alert("Todos los campos de la tarjeta son obligatorios.");
      return;
    }

    if (tarjeta.numero.length !== 16) {
      alert("El número de tarjeta debe tener 16 dígitos.");
      return;
    }

    if (tarjeta.cvv.length !== 3) {
      alert("El CVV debe tener 3 dígitos.");
      return;
    }

    setTarjetaGuardada(tarjeta);
    setMostrarFormTarjeta(false);
    alert("Tarjeta guardada exitosamente!");
  };

  const eliminarTarjeta = () => {
    setTarjetaGuardada(null);
    setMostrarFormTarjeta(true);
    setTarjeta({ nombre: '', numero: '', expiracion: '', cvv: '' });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Detalles de tu Pedido</h2>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <img src={imagenDirrecion} alt="Prenda" className="img-fluid rounded" />
          <p className="mt-3"><strong>Prenda:</strong> {prenda?.datos?.nombre}</p>
          <p><strong>Cantidad:</strong> {cantidad}</p>
          <p><strong>Precio total:</strong> ${total}</p>
        </div>
      </div>

      <h2 className="mb-3 mt-4 text-center">Selecciona el domicilio</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          {domicilios.length > 0 && (
            <ul className="list-group">
              {domicilios.map((domicilio, index) => (
                <li
                  key={domicilio.id || index}
                  className={`list-group-item d-flex justify-content-between align-items-center ${selectedDomicilios === domicilio.id ? "active" : ""}`}
                  onClick={() => setSelectedDomicilios(domicilio.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{`Calle ${domicilio.calle} ${domicilio.numero}`}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removerDomicilio(domicilio.id);
                    }}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button className="btn btn-primary mt-3 w-100" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Agregar Domicilio"}
          </button>

          {showForm && (
            <div className="mt-3 border p-3 rounded">
              <h5>Nuevo Domicilio</h5>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Calle"
                value={nuevoDomicilio.calle}
                onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, calle: e.target.value })}
              />
              <input
                type="number"
                className="form-control mt-2"
                placeholder="Número"
                value={nuevoDomicilio.numero}
                onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, numero: e.target.value })}
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Piso"
                value={nuevoDomicilio.piso}
                onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, piso: e.target.value })}
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Departamento"
                value={nuevoDomicilio.depto}
                onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, depto: e.target.value })}
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Descripción"
                value={nuevoDomicilio.descripcion}
                onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, descripcion: e.target.value })}
              />
              <button className="btn btn-success mt-2 w-100" onClick={addNuevoDomicilio}>
                Guardar Domicilio
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="mb-3 mt-4 text-center">Método de Pago</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          {mostrarFormTarjeta && (
            <div className="mt-3 border p-3 rounded">
              <h5>Datos de Tarjeta</h5>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Nombre en la tarjeta"
                value={tarjeta.nombre}
                onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })}
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Número de tarjeta"
                value={tarjeta.numero}
                maxLength="16"
                onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value.replace(/\D/g, '') })}
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Fecha de expiración (MM/YY)"
                value={tarjeta.expiracion}
                maxLength="5"
                onChange={(e) => setTarjeta({ ...tarjeta, expiracion: e.target.value })}
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="CVV"
                value={tarjeta.cvv}
                maxLength="3"
                onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, '') })}
              />
              <button className="btn btn-success mt-2 w-100" onClick={guardarTarjeta}>
                Guardar Tarjeta
              </button>
            </div>
          )}

          {tarjetaGuardada && (
            <div className="mt-3 border p-3 rounded">
              <h5>Tarjeta Guardada</h5>
              <p><strong>Nombre:</strong> {tarjetaGuardada.nombre}</p>
              <p><strong>Número:</strong> **** **** **** {tarjetaGuardada.numero.slice(-4)}</p>
              <p><strong>Expiración:</strong> {tarjetaGuardada.expiracion}</p>
              <button className="btn btn-danger mt-2 w-100" onClick={eliminarTarjeta}>
                Eliminar Tarjeta
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <button className="btn btn-success mt-4 w-100" onClick={handleCreatePedido}>
            Crear Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesPedido;