import axios from "axios";

// GET
export async function getRemeras() {
    try {
        const response = await axios.get("https://localhost:7050/api/Remera/obtenerRemeras");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las remeras");
    }
}

// buscar
export async function buscarRemeras(busqueda) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Remera/buscarRemeras?busqueda=${busqueda}`);
        return response.data; 
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al realizar la busqueda");
    }
}

// POST
export async function createRemera(nuevaRemera) {
    try {
        const response = await axios.post("https://localhost:7050/api/Remera/crearRemera", nuevaRemera);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteRemera(RemeraId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Remera/eliminarRemera?ID=${RemeraId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getRemeraPorID(ID) {
    try {
        const response = await getRemeras();
        const remeras = response.datos;
        const remera = remeras.find(t => t.id === Number(ID));
        if (remera) {
            return remera;
        } else {
            throw new Error(`No se encontró la remera con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener la remera:", error.message);
        throw error;
    }
}

export async function getRemeraPorIDUsuario(ID) {
    try {
        const response = await getRemeras();
        console.log('Datos de remeras:', response.datos);
        const remeras = response.datos;
        const remera = remeras.filter(t => t.usuarioID === Number(ID));
        if (remera) {
            return remera;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener la remera:", error.message);
        throw error;
    }
}