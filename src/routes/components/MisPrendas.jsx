import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getPrendasUsuario } from "../../helpers/prendasService";
import { getimgURLporID } from "../../helpers/imagenService";
import { getCamperaPorIDUsuario } from "../../helpers/camperasService";
import { getPantalonPorIDUsuario } from "../../helpers/pantalonesService";
import { getRemeraPorIDUsuario } from "../../helpers/remerasService";
import { getZapatoPorIDUsuario } from "../../helpers/zapatosService";
//import { obtenerValoracionTotal } from "../../helpers/reviewService";
//import StarRatings from 'react-star-ratings';
import Cargando from './Cargando';
import "../../styles/MisPrendas.css";

const obtenerPrendasConCategoria = async (userId) => {
  try {
    const [prendasResp, remeraResp, pantalonResp, camperaResp, zapatoResp] = await Promise.all([
      getPrendasUsuario(userId),
      getRemeraPorIDUsuario(userId).catch(() => null),
      getPantalonPorIDUsuario(userId).catch(() => null),
      getCamperaPorIDUsuario(userId).catch(() => null),
      getZapatoPorIDUsuario(userId).catch(() => null),
    ]);

    if (!prendasResp?.exito || !Array.isArray(prendasResp.datos)) {
      return { exito: false, mensaje: "Error al obtener las prendas." };
    }

    const categorias = {
      remera: remeraResp ? (Array.isArray(remeraResp) ? remeraResp : [remeraResp]) : [],
      pantalon: pantalonResp ? (Array.isArray(pantalonResp) ? pantalonResp : [pantalonResp]) : [],
      campera: camperaResp ? (Array.isArray(camperaResp) ? camperaResp : [camperaResp]) : [],
      zapato: zapatoResp ? (Array.isArray(zapatoResp) ? zapatoResp : [zapatoResp]) : [],
    };

    const prendasConCategoria = prendasResp.datos.map((prenda) => {
      let categoria = [];

      if (categorias.remera.some((p) => p.id === prenda.id)) categoria.push("remera");
      if (categorias.pantalon.some((p) => p.id === prenda.id)) categoria.push("pantalon");
      if (categorias.campera.some((p) => p.id === prenda.id)) categoria.push("campera");
      if (categorias.zapato.some((p) => p.id === prenda.id)) categoria.push("zapato");

      if (categoria.length === 0) {
        console.warn(`Prenda sin categoría detectada: ${prenda.id}, asignando 'desconocido'`);
        categoria.push("desconocido");
      }

      return { ...prenda, categoria };
    });

    return { exito: true, datos: prendasConCategoria };
  } catch (error) {
    console.error("Error al obtener y categorizar prendas:", error);
    return { exito: false, mensaje: "No tienes prendas registradas." };
  }
};

const MisPrendas = () => {
  const { userId } = useContext(AuthContext);
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const addImageURLsToPrendas = async (prendas) => {
    return await Promise.all(
      prendas.map(async (prenda) => {
        const imageUrl = await getimgURLporID(prenda.imagenID);
        // const valoracionTotal = await obtenerValoracionTotal(prenda.postID);
        return { ...prenda, imageUrl/*, valoracionTotal */};
      })
    );
  };

  useEffect(() => {
    const fetchPrendas = async () => {
      if (!userId) {
        setMensaje("Usuario no identificado.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setMensaje("");

        const respuesta = await obtenerPrendasConCategoria(userId);
        if (respuesta?.exito && Array.isArray(respuesta.datos) && respuesta.datos.length > 0) {
          const prendasWithImages = await addImageURLsToPrendas(respuesta.datos);
          setPrendas(prendasWithImages);
        } else {
          setMensaje(respuesta?.mensaje || "No tienes prendas registradas.");
        }
      } catch (error) {
        setMensaje("No tienes prendas registradas.");
      } finally {
        setCargando(false);
      }
    };

    fetchPrendas();
  }, [userId]);

  const formatPrice = (price) => `$ ${price.toFixed(2)}`;

  if (cargando) return <Cargando />;

  return (
    <Container className="mis-prendas-container" style={{ minHeight: "50vh" }}>
      <h3>Mis Prendas</h3>
      {mensaje ? (
        <p className="mis-prendas-mensaje">{mensaje}</p>
      ) : (
        <Row className="g-4">
          {prendas.map((prenda) => (
            <Col key={prenda.id} xs={12} sm={6} lg={4}>
              <Card className="mis-prendas-card h-100">
                <Card.Img
                  variant="top"
                  src={prenda.imageUrl}
                  alt={prenda.nombre}
                />
                <Card.Body>
                  <Card.Title>{prenda.nombre}</Card.Title>
                  {/* <div className="star-ratings">
                    <StarRatings
                      rating={parseFloat(prenda.valoracionTotal) || 0}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="25px"
                      starSpacing="3px"
                    />
                    <span>({prenda.valoracionTotal})</span>
                  </div> */}
                  <Card.Text className="text-muted">
                    Precio: {formatPrice(prenda.precio)}
                  </Card.Text>
                  <Button variant="primary" href={`/${prenda.categoria[0]}/${prenda.id}`}>
                    Ver {`${prenda.categoria}`}
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

export default MisPrendas;