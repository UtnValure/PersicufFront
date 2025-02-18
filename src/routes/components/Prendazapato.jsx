import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Prenda.css'
import { getPrendaPorID } from '../../helpers/prendasService';
import { getZapatoPorID } from '../../helpers/zapatosService';
import { buscarColorPorID } from '../../helpers/coloresService';
import { buscarRubroPorID } from '../../helpers/rubroService';
import { buscarMaterialPorID } from '../../helpers/materialService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';
import { getTalleNumericoPorID } from '../../helpers/TNService';
import { getimgURLporID } from '../../helpers/imagenService';
import ProductViewer from './persozapato/ProductViewer';
// import { obtenerReview, obtenerValoracionTotal, obtenerNombreUsuarioReview } from '../../helpers/reviewService';
// import StarRatings from 'react-star-ratings';
import Cargando from './Cargando';

const Zapato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Zapato, setZapato] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState('');
  const [rubro, setRubro] = useState('');
  const [material, setMaterial] = useState('');
  const [usuario, setUsuario] = useState('');
  const [tn, setTn] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const viewerRef = useRef(null);
  const [codigoColor, setCodigoColor] = useState('');
  const [puntaM, setPuntaM] = useState(false);
  const [imagenDirrecion, setImagenDireccion] = useState('');
  //const [reseñas, setReseñas] = useState([]);
  //const [valoracionTotal, setValoracionTotal] = useState(0);

  const handleComprarAhora = () => {
    navigate('/detalles-pedido', {
      state: {
        prenda: Zapato,
        cantidad: cantidad,
        total: Zapato.datos.precio * cantidad,
        imagenDirrecion
      }
    });
  };

  useEffect(() => {
    const fetchZapato = async () => {
      try {
        setCargando(true);
        const data = await getPrendaPorID(id);
        const dataZ = await getZapatoPorID(id);
        setZapato(data);

        const colorData = await buscarColorPorID(data.datos.colorID);
        const rubroData = await buscarRubroPorID(data.datos.rubroID);
        const materialData = await buscarMaterialPorID(data.datos.materialID);
        const usuarioData = await buscarUsuario(data.datos.usuarioID);
        const tnData = await getTalleNumericoPorID(dataZ.talleNumericoID);
        const imagenData = await getimgURLporID(data.datos.imagenID);

        setUsuario(usuarioData?.data?.datos?.nombreUsuario || 'Usuario no encontrado');
        setColor(colorData.nombre);
        setCodigoColor(colorData.codigoHexa);
        setRubro(rubroData.descripcion);
        setMaterial(materialData.descripcion);
        setTn(tnData.descripcion);
        setPuntaM(dataZ.puntaMetal);
        setImagenDireccion(imagenData);

        // const reseñasData = await obtenerReview(data.datos.postID);
        // setValoracionTotal(await obtenerValoracionTotal(data.datos.postID));

        // if (reseñasData && Array.isArray(reseñasData)) {
        //   const reseñasConNombres = await Promise.all(
        //     reseñasData.map(async (reseña) => {
        //       const nombreUsuario = await obtenerNombreUsuarioReview(reseña.owner);
        //       return { ...reseña, owner: nombreUsuario || 'Usuario no disponible' };
        //     })
        //   );
        //   setReseñas(reseñasConNombres);
        // } else {
        //   setReseñas([]);
        // }

        setCargando(false);
      } catch (err) {
        console.error("Error al cargar los detalles de la prenda:", err);
        setError('Error al cargar los detalles de la prenda.');
        setCargando(false);
      }
    };

    fetchZapato();
  }, [id]);

  if (cargando) return <Cargando />;
  if (error) return <div>{error}</div>;
  if (!Zapato) return <div>No se encontró el zapato.</div>;

  const { nombre, precio, descripcion } = Zapato.datos;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <ProductViewer
            ref={viewerRef}
            color={codigoColor}
            selectedCategory={rubro}
            hasMetalToe={puntaM}
            className="product-viewer"
          />
        </div>

        <div className="col-md-7 text-start">
          <h1 className="h2">{nombre}</h1>
          {/* <div className="mt-3">
            <StarRatings
              rating={parseFloat(valoracionTotal) || 0}
              starRatedColor="#FFD700"
              numberOfStars={5}
              starDimension="25px"
              starSpacing="3px"
            />
            <span className="ms-2">({valoracionTotal})</span>
          </div> */}

          <p><strong>Precio:</strong> $ {precio}</p>
          <p>{descripcion}</p>
          <p><strong>Color:</strong> {color}</p>
          <p><strong>Rubro:</strong> {rubro}</p>
          <p><strong>Material:</strong> {material}</p>
          <p><strong>Usuario:</strong> {usuario}</p>
          <p><strong>Talle:</strong> {tn}</p>
          <p><strong>Punta metálica:</strong> {puntaM ? 'Sí' : 'No'}</p>

          <div className="mt-3">
            <label><strong>Cantidad:</strong></label>
            <input
              type="number"
              className="form-control w-25 d-inline mx-2"
              value={cantidad}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setCantidad(Math.max(1, isNaN(value) ? 1 : value)); // Corregido
              }}
              min="1"
            />
          </div>
          <button className="btn btn-primary mt-4 me-3" onClick={handleComprarAhora}>Comprar ahora</button>
          {/* <button className="btn btn-primary mt-4" onClick={() => window.open(`http://localhost:8000/post/${Zapato.datos.postID}`, '_blank')}>Enviar Reseña</button>

          <div className="mt-5">
            <h3 className='text-start'>Comentarios:</h3>
            {reseñas.length > 0 ? (
              reseñas.map((reseña, index) => (
                <div key={index} className="reseña">
                  <h5>{reseña.owner}</h5>
                  <p>{reseña.comment}</p>
                  <StarRatings rating={reseña.rating} starRatedColor="#FFD700" numberOfStars={5} starDimension="20px" starSpacing="3px" />
                </div>
              ))
            ) : (
              <p>No hay comentarios disponibles.</p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Zapato;