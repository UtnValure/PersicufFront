import axios from "axios";

// GET
export async function getPedidosPrenda() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/PedidoPrenda/obtenerPedidosPrenda");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los pedidos");
    }
}

// POST
export async function createPedidoPrenda(nuevoPedidoPrenda) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/PedidoPrenda/crearPedidoPrenda", nuevoPedidoPrenda);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deletePedidoPrenda(PedidoId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/PedidoPrenda/eliminarPedidoPrenda?ID=${PedidoId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}