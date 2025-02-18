import axios from "axios";

// GET
export async function getPrendas() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/Prenda/obtenerPrendas");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las prendas");
    }
}

// buscar
export async function buscarPrendas(busqueda) {
    try {
        const response = await axios.get(`https://persicufback-production.up.railway.app/api/Prenda/buscarPrendas?busqueda=${busqueda}`);
        return response.data; 
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al realizar la busqueda");
    }
}

// prendaUsuario
export async function getPrendasUsuario(ID) {
    try {
        const response = await axios.get(`https://persicufback-production.up.railway.app/api/Prenda/obtenerPrendasUsuario?ID=${ID}`);
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las prendas");
    }
}

export async function getPrendaPorID(ID) {
    try {
        const response = await axios.get(`https://persicufback-production.up.railway.app/api/Prenda/buscarPrendaPorID?ID=${ID}`);
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las prendas");
    }
}

// POST
export async function createPrenda(nuevaPrenda) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/Prenda/crearPrenda", nuevaPrenda);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deletePrenda(PrendaId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/Prenda/eliminarPrenda?ID=${PrendaId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}