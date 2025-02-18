import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Button, Card, Dropdown } from "react-bootstrap";
import { buscarPrendas } from "../../helpers/prendasService";
import { buscarUsuario } from "../../helpers/usuarios/usuariosService";
import { useSearchParams } from "react-router-dom";
import { getimgURLporID } from "../../helpers/imagenService";
import { buscarCamperas } from "../../helpers/camperasService";
import { buscarPantalones } from "../../helpers/pantalonesService";
import { buscarRemeras } from "../../helpers/remerasService";
import { buscarZapatos } from "../../helpers/zapatosService";
//import { obtenerValoracionTotal } from "../../helpers/reviewService";
//import StarRatings from 'react-star-ratings';
import Cargando from './Cargando';
import "../../styles/ResultadosBusqueda.css";

async function busquedaCoincidencia(busqueda) {
  async function safeFetch(fetchFunction) {
    try {
      let result = await fetchFunction(busqueda);
      return result?.datos || [];
    } catch (error) {
      console.error(`Error al buscar: ${fetchFunction.name}`, error);
      return [];
    }
  }

  let [remeras, camperas, pantalones, zapatos, prendas] = await Promise.all([
    safeFetch(buscarRemeras),
    safeFetch(buscarCamperas),
    safeFetch(buscarPantalones),
    safeFetch(buscarZapatos),
    safeFetch(buscarPrendas),
  ]);

  let resultado = prendas.map(prenda => {
    let categoria = [];
    
    if (remeras.some(remera => remera.id === prenda.id)) categoria.push("remera");
    if (camperas.some(campera => campera.id === prenda.id)) categoria.push("campera");
    if (pantalones.some(pantalon => pantalon.id === prenda.id)) categoria.push("pantalon");
    if (zapatos.some(zapato => zapato.id === prenda.id)) categoria.push("zapato");

    return { ...prenda, categoria };
  });

  return resultado;
}

export default function ResultadosBusqueda() {
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get("query") || "";
  const [activeCategory, setActiveCategory] = useState("Todas");

  useEffect(() => {
    const obtenerResultados = async () => {
      try {
        setCargando(true);
        setResultados([]);
        setMensaje("");
    
        let respuesta;
    
        if (activeCategory === "Remeras") {
          let prendas = await buscarRemeras(terminoBusqueda);
          let resultado = (prendas?.datos || []).map(remera => ({
            ...remera,
            categoria: ["remera"]
          }));
          respuesta = resultado;
        } else if (activeCategory === "Zapatos") {
          let prendas = await buscarZapatos(terminoBusqueda);
          let resultado = (prendas?.datos || []).map(zapato => ({
            ...zapato,
            categoria: ["zapato"]
          }));
          respuesta = resultado;
        } else if (activeCategory === "Pantalones") {
          let prendas = await buscarPantalones(terminoBusqueda);
          let resultado = (prendas?.datos || []).map(pantalon => ({
            ...pantalon,
            categoria: ["pantalon"]
          }));
          respuesta = resultado;
        } else if (activeCategory === "Camperas") {
          let prendas = await buscarCamperas(terminoBusqueda);
          let resultado = (prendas?.datos || []).map(campera => ({
            ...campera,
            categoria: ["campera"]
          }));
          respuesta = resultado;
        } else {
          respuesta = await busquedaCoincidencia(terminoBusqueda);
        }
        
        if (respuesta && Array.isArray(respuesta) && respuesta.length > 0) {
          const resultados = await Promise.all(
            respuesta.map(async (prenda) => {
              if (prenda.usuarioID) {
                try {
                  //const valoracionTotal = await obtenerValoracionTotal(prenda.postID);
                  const imageUrl = await getimgURLporID(prenda.imagenID);
                  const usuarioRespuesta = await buscarUsuario(prenda.usuarioID);
                  if (usuarioRespuesta?.data) {
                    return {
                      ...prenda,
                      creador: usuarioRespuesta.data.datos?.nombreUsuario || "Desconocido",
                      imageUrl,
                      //valoracionTotal
                    };
                  }
                } catch (error) {
                  console.error(`Error al buscar los resultados: `, error);
                }
              }
              return { ...prenda, creador: "Desconocido", imageUrl: ""/*, valoracionTotal: 0 */};
            })
          );
          setResultados(resultados);
        } else {
          setMensaje(respuesta?.mensaje || "No se encontraron resultados.");
        }
      } catch (error) {
        console.error("Error al buscar las prendas:", error);
        setMensaje("No se encontraron resultados.");
      } finally {
        setCargando(false);
      }
    };

    obtenerResultados();
  }, [terminoBusqueda, activeCategory]);

  const categories = [
    "Todas",
    "Remeras",
    "Camperas",
    "Pantalones",
    "Zapatos",
  ];

  const formatPrice = (price) => {
    return `$ ${price.toFixed(2)}`;
  };

  if (cargando) return <Cargando />;

  return (
    <Container fluid className="resultados-busqueda-container">
      <h3 className="text-center mb-4">Resultados de la búsqueda para: "{terminoBusqueda}"</h3>

      {/* Navegación de categorías responsive */}
      <Dropdown className="d-block d-md-none mb-4">
        <Dropdown.Toggle variant="primary" id="dropdown-categorias" className="w-100">
          {activeCategory}
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100">
          {categories.map((category) => (
            <Dropdown.Item
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Nav className="categorias-nav d-none d-md-flex justify-content-center mb-4">
        {categories.map((category) => (
          <Nav.Item key={category}>
            <Nav.Link
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {mensaje ? (
        <p className="no-results-message text-center">{mensaje}</p>
      ) : (
        <Row className="g-4">
          {resultados.map((prenda) => (
            <Col key={prenda.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="product-card h-100">
                <Card.Img
                  variant="top"
                  src={prenda.imageUrl}
                  alt={prenda.nombre}
                  className="img-fluid"
                />
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title">{prenda.nombre}</h5>
                  {/* <div className="mt-3">
                    <StarRatings
                      rating={parseFloat(prenda.valoracionTotal) || 0}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                    />
                    <span className="ms-2">({prenda.valoracionTotal})</span>
                  </div> */}
                  <p className="card-text">
                    <strong>Precio: </strong>
                    {formatPrice(prenda.precio)}
                  </p>
                  <p className="card-text">
                    <strong>Creador: </strong>
                    {prenda.creador}
                  </p>
                  <Button
                    variant="primary"
                    href={`/${prenda.categoria}/${prenda.id}`}
                    className="mt-auto"
                  >
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
}