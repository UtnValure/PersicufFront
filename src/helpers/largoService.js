import axios from "axios";


export async function getLargoID(nombreLargo) {
    try {
        const response = await getLargos();
        const Largos = response.datos;
        const Largo = Largos.find(l => l.descripcion === nombreLargo);
        if (Largo) {
            return Largo.id;
        } else {
            throw new Error(`No se encontró un Corte con el nombre: ${nombreLargo}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del Corte:", error.message);
        throw error;
    }
}




export async function getLargos() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/Largo/obtenerLargos");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los Largos");
    }
}

export async function createLargo(nuevoLargo) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/Largo/crearLargo", nuevoLargo);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

export async function deleteTalleAlfabetico(LargoId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/Largo/eliminarLargo?ID=${LargoId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getLargoPorID(ID) {
    try {
        const response = await getLargos();
        const Largos = response.datos;
        const Largo = Largos.find(t => t.id === Number(ID));
        if (Largo) {
            return Largo;
        } else {
            throw new Error(`No se encontró los largos con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener los largos:", error.message);
        throw error;
    }
}