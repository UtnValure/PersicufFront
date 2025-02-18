import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getPedidosUsuario } from "../../helpers/pedidosService";
import { getDomicilioPorID } from "../../helpers/domicilioService";
import { getPedidosPrenda } from "../../helpers/pedidoprendaService";
import { getPrendaPorID } from "../../helpers/prendasService";
import { getimgURLporID } from "../../helpers/imagenService";
// import { getEnvio } from "../../helpers/envioAPI";
import Cargando from './Cargando';
import "../../styles/MisPedidos.css";

const MisPedidos = () => {
  const { userId } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [domicilios, setDomicilios] = useState({});

  useEffect(() => {
    const fetchPedidos = async () => {
      console.log("User ID:", userId);

      if (!userId) {
        setMensaje("Usuario no identificado.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setMensaje("");

        const respuesta = await getPedidosUsuario(userId);
        console.log("Respuesta del backend:", respuesta);

        if (respuesta?.exito && Array.isArray(respuesta.datos) && respuesta.datos.length > 0) {
          const pedidosConPrendas = [];

          // Obtener los domicilios
          const domiciliosData = {};
          await Promise.all(
            respuesta.datos.map(async (pedido) => {
              let prend;
              let prenda;
              let url;
              let cantidad;
              let envio;

              // Obtener las prendas relacionadas a este pedido
              try {
                const prendasResponse = await getPedidosPrenda(pedido.id);
                console.log("Respuesta de prendas:", prendasResponse);

                // Verificamos si `prendasResponse` tiene la propiedad `datos` y es un arreglo
                const prendas = Array.isArray(prendasResponse?.datos) ? prendasResponse.datos : [];

                // Si se encuentra un arreglo de prendas
                prend = prendas.find((prenda) => prenda.pedidoID === pedido.id);
                prenda = await getPrendaPorID(prend.prendaID);
                url = await getimgURLporID(prenda.datos.imagenID);
                cantidad = prend.cantidad;
                // envio = await getEnvio(pedido.nroSeguimiento);

              } catch (error) {
                console.error(`Error al obtener prendas para pedido ID ${pedido.id}:`, error);
              }

              // Obtener el domicilio para este pedido
              if (!domiciliosData[pedido.domicilioID]) {
                try {
                  const domicilio = await getDomicilioPorID(pedido.domicilioID);
                  domiciliosData[pedido.domicilioID] = domicilio;
                  console.log("Envio:", envio);
                } catch (error) {
                  console.error(`Error al obtener domicilio para ID ${pedido.domicilioID}:`, error);
                  domiciliosData[pedido.domicilioID] = { calle: "Desconocida", numero: "N/A" };
                }
              }

              // Crear el pedido con la cantidad de prendas
              pedidosConPrendas.push({
                ...pedido,
                prenda,
                url,
                cantidad,
                // envio,
              });
            })
          );

          setPedidos(pedidosConPrendas);
          setDomicilios(domiciliosData);
        } else {
          setMensaje(respuesta?.mensaje || "No tienes pedidos registrados.");
        }
      } catch (error) {
        console.error("Error al obtener los pedidos del usuario:", error);
        setMensaje("No tienes pedidos registrados.");
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, [userId]);

  if (cargando) return <Cargando />;

  return (
    <Container className="py-4" style={{ minHeight: "50vh" }}>
      <h3 className="mb-4">Mis Pedidos</h3>
      {mensaje ? (
        <p className="mis-pedidos-mensaje">{mensaje}</p>
      ) : (
        <Row className="g-4">
          {pedidos.map((pedido, index) => (
            <Col key={index} xs={12} sm={6} lg={4}>
              <a
                // href={`https://veloway-frontend.vercel.app/client/shipment/${pedido.nroSeguimiento}`}
                // target="_blank"
                // rel="noopener noreferrer"
                // style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="h-100 card-hover">
                  <Card.Img
                    variant="top"
                    src={pedido.url}
                    className="card-img"
                  />
                  <Card.Body>
                    <Card.Title>{`Pedido #${index + 1}`}</Card.Title>
                    <Card.Text className="text-muted">{`Precio Total: $${pedido.precioTotal}`}</Card.Text>
                    <Card.Text className="text-muted">{`Prenda: ${pedido.prenda.datos.nombre}`}</Card.Text>
                    <Card.Text className="text-muted">{`Cantidad: ${pedido.cantidad}`}</Card.Text>
                    <Card.Text className="text-muted">{`Domicilio: ${domicilios[pedido.domicilioID]?.calle || "Desconocida"} ${domicilios[pedido.domicilioID]?.numero || "N/A"}`}</Card.Text>
                    {/* <Card.Text className="text-muted">{`Estado: ${pedido.envio.estado}`}</Card.Text> */}
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MisPedidos;