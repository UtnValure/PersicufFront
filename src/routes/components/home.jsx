import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCamperas } from '../../helpers/camperasService';
import { getPantalones } from '../../helpers/pantalonesService';
import { getRemeras } from '../../helpers/remerasService';
import { getZapatos } from '../../helpers/zapatosService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';
import { getimgURLporID } from '../../helpers/imagenService';
import { Link } from 'react-router-dom';
// import { obtenerValoracionTotal } from '../../helpers/reviewService';
// import StarRatings from 'react-star-ratings';
import "bootswatch/dist/lux/bootstrap.min.css";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../../styles/home.css";
import Cargando from './Cargando';

// Componente personalizado para las flechas del carrusel
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
};

const HomeForm = () => {
  const [remeras, setRemeras] = useState([]);
  const [pantalones, setPantalones] = useState([]);
  const [camperas, setCamperas] = useState([]);
  const [zapatos, setZapatos] = useState([]);
  const [creadores, setCreadores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  // Obtener la URL de la imagen para cada prenda
  const addImageURLs = async (prendas) => {
    try {
      const updatedPrendas = await Promise.all(
        prendas.map(async (prenda) => {
          const imageUrl = await getimgURLporID(prenda.imagenID);
          return { ...prenda, image: imageUrl };
        })
      );
      return updatedPrendas;
    } catch (error) {
      console.error("Error al agregar URLs de imágenes:", error.message);
      return prendas;
    }
  };

  // Función para obtener las prendas desde la base de datos
  useEffect(() => {
    const fetchPrendas = async () => {
      try {
        setCargando(true);
        const [remerasData, pantalonesData, camperasData, zapatosData] = await Promise.all([
          getRemeras(),
          getPantalones(),
          getCamperas(),
          getZapatos(),
        ]);

        const remerasWithImages = await addImageURLs(remerasData.datos.slice(0, 5));
        const pantalonesWithImages = await addImageURLs(pantalonesData.datos.slice(0, 5));
        const camperasWithImages = await addImageURLs(camperasData.datos.slice(0, 5));
        const zapatosWithImages = await addImageURLs(zapatosData.datos.slice(0, 5));

        setRemeras(remerasWithImages);
        setPantalones(pantalonesWithImages);
        setCamperas(camperasWithImages);
        setZapatos(zapatosWithImages);

        setCargando(false);
      } catch (err) {
        console.error(err);
        setError('Hubo un error al cargar las prendas');
        setCargando(false);
      }
    };

    fetchPrendas();
  }, []);

  // Función para buscar el nombre del creador
  const fetchCreador = async (usuarioID, postID) => {
    if (!usuarioID || creadores[usuarioID]) return;
    try {
      const response = await buscarUsuario(usuarioID);
      const nombre = response.data.datos.nombreUsuario;
      // const valoracion = await obtenerValoracionTotal(postID);
      setCreadores((prev) => ({
        ...prev,
        [usuarioID]: nombre,
        // [`valoracionTotal-${postID}`]: valoracion,
      }));
    } catch (error) {
      console.error(`Error al obtener el creador con ID ${usuarioID}:`, error);
    }
  };

  // Buscar los nombres de los creadores al cargar las prendas
  useEffect(() => {
    [...remeras, ...pantalones, ...camperas, ...zapatos].forEach((item) => {
      fetchCreador(item.usuarioID, item.postID);
    });
  }, [remeras, pantalones, camperas, zapatos]);

  if (cargando) {
    return <Cargando />;
  }

  if (error) return <div>{error}</div>;

  // Estilos CSS para el hover
  const cardHoverStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const cardHoverEffect = {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const renderPrendas = (prendas, tipo, ruta) => (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-4">{tipo}</h3>
        {prendas.length > 0 ? (
          <Slider {...settings}>
            {prendas.map((item) => (
              <div key={item.id} className="px-2">
                <div
                  className="card h-100"
                  style={cardHoverStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = cardHoverEffect.transform;
                    e.currentTarget.style.boxShadow = cardHoverEffect.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.nombre}
                    style={{ width: "100%", height: "275px", objectFit: "contain" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.nombre}</h5>
                    {/* <div className="mt-3">
                      <StarRatings
                        rating={parseFloat(creadores[`valoracionTotal-${item.postID}`]) || 0}
                        starRatedColor="#FFD700"
                        numberOfStars={5}
                        starDimension="25px"
                        starSpacing="3px"
                      />
                      <span className="ms-2">({creadores[`valoracionTotal-${item.postID}`]})</span>
                    </div> */}
                    <p className="card-text"><strong>Precio: </strong>$ {item.precio}</p>
                    <p className="card-text">
                      <strong>Creador: </strong>
                      {creadores[item.usuarioID] || 'Cargando...'}
                    </p>
                    <Link to={`/${ruta}/${item.id}`} className="btn btn-primary mt-auto">
                      Ver {tipo === 'Pantalones' ? 'Pantalón' : tipo.toLowerCase().replace(/s$/, '')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center">No hay {tipo.toLowerCase()} disponibles.</p>
        )}
        <div className="text-center mt-3">
          <Link to={`/${ruta}`} className="btn btn-secondary">Ver más {tipo.toLowerCase()}</Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        {/* Sección de bienvenida con el fondo */}
        <section className="seccion">
          <div className="container">
            <h2 className="bienvenidos">Bienvenido a Persicuf</h2>
            <p className="textobienvenidos">¡Personaliza tus prendas de la manera que tú quieras!</p>
          </div>
        </section>

        {/* Mostrar categorías */}
        <section className="py-5 bg-light">
          <div className="container">
            <h3 className="text-center mb-4">Prendas a personalizar</h3>
            <div className="row">
              {['Remeras', 'Camperas', 'Pantalones', 'Zapatos'].map((product, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div
                    className="card h-100"
                    style={cardHoverStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = cardHoverEffect.transform;
                      e.currentTarget.style.boxShadow = cardHoverEffect.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/Calvo-Bautista/imagenes/refs/heads/main/${product.toLowerCase()}.png`}
                      className="card-img-top"
                      alt={product}
                      style={{ width: "100%", height: "275px", objectFit: "contain" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product}</h5>
                      <p className="card-text">
                        Personaliza tus {product.toLowerCase()} con el diseño que más te guste.
                      </p>
                      <Link
                        to={`/${product.toLowerCase()}personalizar`}
                        className="btn btn-primary mt-auto"
                      >
                        Personalizar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Secciones de prendas */}
        {renderPrendas(remeras, 'Remeras', 'remera')}
        {renderPrendas(pantalones, 'Pantalones', 'pantalon')}
        {renderPrendas(camperas, 'Camperas', 'campera')}
        {renderPrendas(zapatos, 'Zapatos', 'zapato')}
      </main>
    </div>
  );
};

export default HomeForm;