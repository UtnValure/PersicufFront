import axios from "axios";

// GET
export async function getUbicaciones() {
    try {
        const response = await axios.get("https://localhost:7050/api/Ubicacion/obtenerUbicaciones");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las ubicaciones");
    }
}


// POST
export async function createUbicaciom(nuevaUbicacion) {
    try {
        const response = await axios.post("https://localhost:7050/api/Ubicaciom/crearUbicacion", nuevaUbicacion);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteUbicacion(UbicacionId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Ubicaciom/eliminarUbicacion?ID=${UbicacionId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

// Obtener el ID de una UBICACION por su nombre
export async function getubicacionID(nombre) {
    try {
        const response = await getUbicaciones();
        const ubis = response.datos; // Asegúrate de que datos sea correcto según el formato de la API
        const ubi = ubis.find(t => t.descripcion === nombre);
        if (ubi) {
            console.log(ubi.descripcion)
            return ubi.id;
        } else {
            throw new Error(`No se encontró una ubicación con el nombre: ${nombre}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID de la ubicacion:", error.message);
        throw error;
    }
}

export async function getUbicacionPorID(ID) {
    try {
        const response = await getUbicaciones();
        const Ubicaciones = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const Ubicacion = Ubicaciones.find(t => t.id === Number(ID));
        if (Ubicacion) {
            return Ubicacion;
        } else {
            throw new Error(`No se encontró la ubicacion con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener la ubicacion:", error.message);
        throw error;
    }
}