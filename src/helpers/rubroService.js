import axios from "axios";

export async function getRubros() {
    try {
        const response = await axios.get("https://localhost:7050/api/Rubro/obtenerRubros");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los Rubros");
    }
}

export async function createRubro(nuevoRubro) {
    try {
        const response = await axios.post("https://localhost:7050/api/Rubro/crearRubro", nuevoRubro);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

export async function buscarRubroPorID(ID) {
    try {
        const response = await axios.get(`https://localhost:7050/api/RUbro/buscarRubroPorID?ID=${ID}`);
        return response.data.datos || []; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los rubros");
    }
}

export async function deleteRubro(rubroId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Rubro/eliminarRubro?ID=${rubroId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

// Obtener el ID de una UBICACION por su nombre
export async function getRubroID(nombre) {
    try {
        const response = await getRubros();
        const rubros = response.datos; // Asegúrate de que datos sea correcto según el formato de la API
        const rubro = rubros.find(t => t.descripcion === nombre);
        if (rubro) {
            return rubro.id;
        } else {
            throw new Error(`No se encontró el rubro con el nombre: ${nombre}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del rubro:", error.message);
        throw error;
    }
}