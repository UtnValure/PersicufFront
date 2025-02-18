import axios from "axios";

export async function getCorteCuelloID(nombreCorteCuello) {
    try {
        const response = await getCorteCuello();
        const CorteCuellos = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const CorteCuello = CorteCuellos.find(c => c.descripcion === nombreCorteCuello);
        if (CorteCuello) {
            return CorteCuello.id;
        } else {
            throw new Error(`No se encontró un Corte con el nombre: ${nombreCorteCuello}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del Corte:", error.message);
        throw error;
    }
}


export async function getCorteCuello() {
    try {
        const response = await axios.get("https://localhost:7050/api/CorteCuello/obtenerCortesCuello");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los CorteCuellos");
    }
}

export async function createCorteCuello(nuevoCorteCuello) {
    try {
        const response = await axios.post("https://localhost:7050/api/CorteCuello/crearCorteCuello", nuevoCorteCuello);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

export async function deleteTalleAlfabetico(CorteCuelloId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/CorteCuello/eliminarCorteCuello?ID=${CorteCuelloId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getCorteCuelloPorID(ID) {
    try {
        const response = await getCorteCuello();
        const CortesCuello = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const CorteCuello = CortesCuello.find(t => t.id === Number(ID));
        if (CorteCuello) {
            return CorteCuello;
        } else {
            throw new Error(`No se encontró el CorteCuello con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener el CorteCuello:", error.message);
        throw error;
    }
}