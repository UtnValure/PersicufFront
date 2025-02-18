import axios from "axios";

// GET
export async function getPedidos() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/Pedido/obtenerPedidos");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los pedidos");
    }
}



// pedidoUsuario
export async function getPedidosUsuario(ID) {
    try {
        const response = await axios.get(`https://persicufback-production.up.railway.app/api/Pedido/obtenerPedidosUsuario?ID=${ID}`);
        console.log(response.data);
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los pedidos");
    }
}

// ultimo pedido
export async function getUltimoPedidoUsuario(ID) {
    try {
        const response = await axios.get(`https://persicufback-production.up.railway.app/api/Pedido/obtenerPedidosUsuario?ID=${ID}`);
        const pedidos = response.data.datos;  // Accede a 'datos' que contiene los pedidos

        // Verifica si se obtuvieron pedidos
        if (pedidos && pedidos.length > 0) {
            // Devuelve el último pedido (el último de la lista)
            const pedido = pedidos[pedidos.length - 1];
            return pedido.id;  // Accede a 'id' o cualquier otra propiedad que necesites
        }

        throw new Error("No se encontraron pedidos para el usuario.");
    } catch (error) {
        console.error("Error:", error.response || error);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los pedidos");
    }
}


// POST
export async function createPedido(nuevoPedido) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/Pedido/crearPedido", nuevoPedido);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deletePedido(pedidoId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/Pedido/eliminarPedido?ID=${pedidoId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function putPedido(pedidoId, pedidoModificado) {
    try {
        const response = await axios.put(`https://persicufback-production.up.railway.app/api/Pedido/modificarPedido?ID=${pedidoId}`, pedidoModificado);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

