import axios from "axios";

// GET
export async function getCamperas() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/Campera/obtenerCamperas");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las camperas");
    }
}

// buscar
export async function buscarCamperas(busqueda) {
    try {
        const response = await axios.get(`https://persicufback-production.up.railway.app/api/Campera/buscarCamperas?busqueda=${busqueda}`);
        return response.data; 
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al realizar la busqueda");
    }
}

// POST
export async function createCampera(nuevaCampera) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/Campera/crearCampera", nuevaCampera);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteRemera(CamperaId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/Campera/eliminarCampera?ID=${CamperaId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getCamperaPorID(ID) {
    try {
        const response = await getCamperas();
        console.log('Datos de Camperas:', response.datos);
        const Camperas = response.datos;
        const Campera = Camperas.find(t => t.id === Number(ID));
        if (Campera) {
            return Campera;
        } else {
            throw new Error(`No se encontró la Campera con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener la Campera:", error.message);
        throw error;
    }
}

export async function getCamperaPorIDUsuario(ID) {
    try {
        const response = await getCamperas();
        console.log('Datos de Camperas:', response.datos);
        const Camperas = response.datos;
        const Campera = Camperas.filter(t => t.usuarioID === Number(ID));
        if (Campera) {
            return Campera;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener la Campera:", error.message);
        throw error;
    }
}