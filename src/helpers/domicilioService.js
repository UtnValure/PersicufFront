import axios from "axios";

// // GET
export async function getDomicilios() {
    try {
        const response = await axios.get("https://localhost:7050/api/Domicilio/obtenerDomicilios");
        return response.data.datos || []; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los domicilios");
    }
}

// POST
export async function createDomicilio(nuevoDomicilio) {
    try {
        const response = await axios.post("https://localhost:7050/api/Domicilio/crearDomicilio", nuevoDomicilio);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response)
        throw new Error(error.response);
    }
};

//DELETE
export async function deleteDomicilio(domicilioId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Domicilio/eliminarDomicilio?ID=${domicilioId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getDomicilioIDUsuario(usuarioID) {
    try {
        const response = await getDomicilios();
        const domi = response.filter(t => t.usuarioID === usuarioID);
        if (domi) {
            return domi;
        } else {
            throw new Error(`No se encontró un domicilio con el usuarioID: ${usuarioID}`);
        }
    } catch (error) {
        console.error("Error al obtener los domicilios:", error.message);
        throw error;
    }
}

export async function getDomicilioPorID(ID) {
    try {
        const response = await getDomicilios();
        const Domicilio = response.find(t => t.id === Number(ID));
        if (Domicilio) {
            return Domicilio;
        } else {
            throw new Error(`No se encontró el domicilio con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener el domicilio:", error.message);
        throw error;
    }
}