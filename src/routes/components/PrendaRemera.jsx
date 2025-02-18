import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Prenda.css'
import { getPrendaPorID } from '../../helpers/prendasService';
import { getRemeraPorID } from '../../helpers/remerasService';
import { buscarColorPorID } from '../../helpers/coloresService';
import { buscarRubroPorID } from '../../helpers/rubroService';
import { buscarMaterialPorID } from '../../helpers/materialService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';
import { getTalleAlfabeticoPorID } from '../../helpers/TAService';
import { getMangaPorID } from '../../helpers/mangasService';
import { getUbicacionPorID } from '../../helpers/ubicacionesService';
import { getImagenPorID, getimgURLporID } from '../../helpers/imagenService';
import { getCorteCuelloPorID } from '../../helpers/corteCuelloService';
import ProductViewer from './persoremera/ProductViewer';
//import { obtenerReview, obtenerValoracionTotal, obtenerNombreUsuarioReview } from '../../helpers/reviewService';
//import StarRatings from 'react-star-ratings';
import Cargando from './Cargando';

const Remera = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Remera, setRemera] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState('');
  const [rubro, setRubro] = useState('');
  const [material, setMaterial] = useState('');
  const [usuario, setUsuario] = useState('');
  const [ta, setTa] = useState('');
  const [corteC, setCorteC] = useState('');
  const [manga, setManga] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const viewerRef = useRef(null);
  const [codigoColor, setCodigoColor] = useState('');
  const [path, setPath] = useState('');
  const [posicion, setPosicion] = useState('');
  const [pos2, setPos2] = useState('');
  const [path2, setPath2] = useState('');
  const [imagenDirrecion, setImagenDireccion] = useState('');
  // const [reseñas, setReseñas] = useState([]);
  // const [valoracionTotal, setValoracionTotal] = useState(0);

  const handleComprarAhora = () => {
    navigate('/detalles-pedido', {
      state: {
        prenda: Remera,
        cantidad: cantidad,
        total: Remera.datos.precio * cantidad,
        imagenDirrecion
      }
    });
  };

  useEffect(() => {
    const fetchRemera = async () => {
      try {
        setCargando(true);
        const data = await getPrendaPorID(id);
        const dataR = await getRemeraPorID(id);
        setRemera(data);

        const colorData = await buscarColorPorID(data.datos.colorID);
        const rubroData = await buscarRubroPorID(data.datos.rubroID);
        const materialData = await buscarMaterialPorID(data.datos.materialID);
        const usuarioData = await buscarUsuario(data.datos.usuarioID);
        const taData = await getTalleAlfabeticoPorID(dataR.talleAlfabeticoID);
        const mangaData = await getMangaPorID(dataR.mangaID);
        const ccData = await getCorteCuelloPorID(dataR.corteCuelloID);
        const estampadoData = await getImagenPorID(dataR.estampadoID);
        const imagenData = await getimgURLporID(data.datos.imagenID);
        let ubicacionData = '';
        if (estampadoData != null) {
          ubicacionData = await getUbicacionPorID(estampadoData.ubicacionID);
        }

        setUsuario(usuarioData?.data?.datos?.nombreUsuario || 'Usuario no encontrado');
        setColor(colorData.nombre);
        setCodigoColor(colorData.codigoHexa);
        setRubro(rubroData.descripcion);
        setMaterial(materialData.descripcion);
        setCorteC(ccData.descripcion);
        setManga(mangaData.descripcion);
        setTa(taData.descripcion);
        setImagenDireccion(imagenData);

        if (estampadoData != null) {
          if (ubicacionData.descripcion === "Espalda") {
            setPos2(ubicacionData.descripcion);
            setPath2(estampadoData.path);
            setPath('');
            setPosicion("Pecho centro");
          } else {
            setPos2("Espalda");
            setPath2('');
            setPath(estampadoData.path);
            setPosicion(ubicacionData.descripcion);
          }
        } else {
          setPath('');
          setPosicion('Pecho centro');
          setPath2('');
          setPos2('Espalda');
        }

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

    fetchRemera();
  }, [id]);

  if (cargando) return <Cargando />;
  if (error) return <div>{error}</div>;
  if (!Remera) return <div>No se encontró la remera.</div>;

  const { nombre, precio, descripcion } = Remera.datos;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <ProductViewer
            ref={viewerRef}
            color={codigoColor}
            uploadedImage={path}
            imagePosition={posicion}
            selectedSleeve={manga}
            selectedNeckline={corteC}
            selectedCategory={rubro}
            className="product-viewer"
          />
        </div>
        <div className="col-md-6">
          <ProductViewer
            color={codigoColor}
            uploadedImage={path2}
            imagePosition={pos2}
            selectedSleeve={manga}
            selectedNeckline={corteC}
            selectedCategory={rubro}
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
          <p><strong>Talle:</strong> {ta}</p>
          <p><strong>Cuello:</strong> {corteC}</p>
          <p><strong>Manga:</strong> {manga}</p>

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
          {/* <button className="btn btn-primary mt-4" onClick={() => window.open(`http://localhost:8000/post/${Remera.datos.postID}`, '_blank')}>Enviar Reseña</button>

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

export default Remera;