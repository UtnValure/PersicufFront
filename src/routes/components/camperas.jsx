import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getCamperas } from '../../helpers/camperasService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';
import { getimgURLporID } from "../../helpers/imagenService";
// import { obtenerValoracionTotal } from '../../helpers/reviewService';
// import StarRatings from 'react-star-ratings';
import Cargando from './Cargando';
import '../../styles/vermas.css'

const VerMasCamperas = () => {
  const [camperas, setCamperas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchCamperas = async () => {
      try {
        setCargando(true);
        const respuesta = await getCamperas();

        if (respuesta?.datos && Array.isArray(respuesta.datos)) {
          const camperasConUsuarios = await Promise.all(
            respuesta.datos.map(async (item) => {
              if (item.usuarioID) {
                try {
                  const usuarioRespuesta = await buscarUsuario(item.usuarioID);
                  const imageUrl = await getimgURLporID(item.imagenID);
                  const nombreUsuario = usuarioRespuesta?.data?.datos?.nombreUsuario;
                  //const valoracionTotal = await obtenerValoracionTotal(item.postID);
                  return { ...item, creador: nombreUsuario || "Desconocido", imageUrl/*, valoracionTotal*/ };
                } catch (error) {
                  console.error(`Error al buscar usuario con ID ${item.usuarioID}:`, error);
                  return { ...item, creador: "Desconocido", imageUrl: "" };
                }
              } else {
                return { ...item, creador: "Desconocido", imageUrl: "" };
              }
            })
          );

          setCamperas(camperasConUsuarios);
        } else {
          setMensaje("No se encontraron camperas.");
        }
      } catch (error) {
        console.error("Error al obtener las camperas:", error);
        setMensaje("Hubo un problema al obtener las camperas.");
      } finally {
        setCargando(false);
      }
    };

    fetchCamperas();
  }, []);

  const formatPrice = (price) => {
    return `$ ${price.toFixed(3)}`;
  };

  if (cargando) return <Cargando />;

  return (
    <Container fluid className="px-4 py-4">
      <h3 className="my-4 text-center">Camperas</h3>

      {mensaje ? (
        <p className="text-center">{mensaje}</p>
      ) : (
        <Row className="g-4">
          {camperas.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="product-card h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.imageUrl}
                  alt={item.nombre}
                  className="card-img-top"
                />
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title">{item.nombre}</h5>
                  {/* <div className="mt-3">
                    <StarRatings
                      rating={parseFloat(item.valoracionTotal) || 0}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                    /> 
                    <span className="ms-2">({item.valoracionTotal})</span>
                  </div> */}
                  <p className="card-text"><strong>Precio: </strong>{formatPrice(item.precio)}</p>
                  <p className="card-text"><strong>Creador: </strong>{item.creador}</p>
                  <Button variant="primary" href={`/campera/${item.id}`} className="mt-auto">
                    Ver campera
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default VerMasCamperas;