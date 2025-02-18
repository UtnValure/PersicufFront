import axios from "axios";

// Obtener todos los talles
export async function getTalleAlfabetico() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/TalleAlfabetico/obtenerTallesAlfabetico");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los Talles Alfabeticos");
    }
}

// Obtener el ID de un talle por su nombre
export async function getTalleAlfabeticoID(nombreTalle) {
    try {
        const response = await getTalleAlfabetico();
        const talles = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const talle = talles.find(t => t.descripcion === nombreTalle);
        if (talle) {
            return talle.id;
        } else {
            throw new Error(`No se encontró un talle con el nombre: ${nombreTalle}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del talle:", error.message);
        throw error;
    }
}

// Crear un nuevo talle
export async function createTalleAlfabetico(nuevoTA) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/TalleAlfabetico/crearTalleAlfabetico", nuevoTA);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

// Eliminar un talle
export async function deleteTalleAlfabetico(TAId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/TalleAlfabetico/eliminarTalleAlfabetico?ID=${TAId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getTalleAlfabeticoPorID(ID) {
    try {
        const response = await getTalleAlfabetico();
        const TallesAlfabeticos = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const TalleAlfabetico = TallesAlfabeticos.find(t => t.id === Number(ID));
        if (TalleAlfabetico) {
            return TalleAlfabetico;
        } else {
            throw new Error(`No se encontró el TalleAlfabetico con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener el TalleAlfabetico:", error.message);
        throw error;
    }
}