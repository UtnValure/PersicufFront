import axios from "axios";

export async function getMaterialID(nombreMaterial) {
    try {
        const response = await getMateriales();
        const Materiales = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const Material = Materiales.find(l => l.descripcion === nombreMaterial);
        if (Material) {
            return Material.id;
        } else {
            throw new Error(`No se encontró un Corte con el nombre: ${nombreMaterial}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del Corte:", error.message);
        throw error;
    }
}

export async function buscarMaterialPorID(ID) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Material/buscarMaterialPorID?ID=${ID}`);
        return response.data.datos || []; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los materiales");
    }
}




export async function getMateriales() {
    try {
        const response = await axios.get("https://localhost:7050/api/Material/obtenerMateriales");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los Materiales");
    }
}

export async function createMaterial(nuevoMaterial) {
    try {
        const response = await axios.post("https://localhost:7050/api/Material/crearMaterial", nuevoMaterial);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

export async function deleteMaterial(materialId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Material/eliminarMaterial?ID=${materialId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}