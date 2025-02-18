import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getZapatos } from '../../helpers/zapatosService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';
import { getimgURLporID } from "../../helpers/imagenService";
//import { obtenerValoracionTotal } from '../../helpers/reviewService';
//import StarRatings from 'react-star-ratings';
import Cargando from './Cargando';
import "../../styles/vermas.css"; // Importa el archivo CSS

const VerMasZapatos = () => {
  const [zapatos, setZapatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchZapatos = async () => {
      try {
        setCargando(true);
        const respuesta = await getZapatos();
        
        if (respuesta?.datos && Array.isArray(respuesta.datos)) {
          const zapatosConUsuarios = await Promise.all(
            respuesta.datos.map(async (item) => {
              if (item.usuarioID) {
                try {
                  const usuarioRespuesta = await buscarUsuario(item.usuarioID);
                  const imageUrl = await getimgURLporID(item.imagenID);
                  const nombreUsuario = usuarioRespuesta?.data?.datos?.nombreUsuario || "Desconocido";
                  //const valoracionTotal = await obtenerValoracionTotal(item.postID);
                  return { ...item, creador: nombreUsuario, imageUrl/*, valoracionTotal */};
                } catch (error) {
                  return { ...item, creador: "Desconocido", imageUrl };
                }
              } else {
                return { ...item, creador: "Desconocido", imageUrl };
              }
            })
          );

          setZapatos(zapatosConUsuarios);
        } else {
          setMensaje("No se encontraron zapatos.");
        }
      } catch (error) {
        console.error("Error al obtener los zapatos:", error);
        setMensaje("Hubo un problema al obtener los zapatos.");
      } finally {
        setCargando(false);
      }
    };

    fetchZapatos();
  }, []);

  const formatPrice = (price) => {
    return `$ ${price.toFixed(3)}`;
  };

  if (cargando) return <Cargando />;

  return (
    <Container fluid className="px-4">
      <h3 className="my-4">Zapatos</h3>

      {mensaje ? (
        <p>{mensaje}</p>
      ) : (
        <Row className="g-4">
          {zapatos.map((item) => (
            <Col key={item.id} xs={12} sm={6} lg={3}>
              <Card className="product-card h-100">
                <Card.Img 
                  variant="top" 
                  src={item.imageUrl} 
                  alt={item.nombre}
                  className="card-img"
                />
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title">{item.nombre}</h5>
                  {/* <div className="mt-3">
                    <StarRatings
                      rating={parseFloat(item.valoracionTotal) || 0}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="25px"
                      starSpacing="3px"
                    />
                    <span className="ms-2">({item.valoracionTotal})</span>
                  </div> */}
                  <p className="card-text"><strong>Precio: </strong>{formatPrice(item.precio)}</p>
                  <p className="card-text"><strong>Creador: </strong>{item.creador}</p>
                  <Button variant="primary" href={`/zapato/${item.id}`} className="mt-auto">
                    Ver zapato
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

export default VerMasZapatos;