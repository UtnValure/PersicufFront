import axios from "axios";

// // GET
export async function getColores() {
    try {
        const response = await axios.get("https://localhost:7050/api/Color/obtenerColores");
        return response.data.datos || []; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los colores");
    }
}

// buscarColorPorID

export async function buscarColorPorID(ID) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Color/buscarColorPorID?ID=${ID}`);
        return response.data.datos || []; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los colores");
    }
}

// GET
// export async function getColores() {
//     try {
//         const response = await axios.get("https://localhost:7050/api/Color/obtenerColores");

//         // Crear un mapa para que los colores sean fácilmente accesibles
//         const colorMap = response.data.reduce((map, color) => {
//             map[color.codigoHexa.toUpperCase()] = color.id; // Clave: código hexa, Valor: ID
//             return map;
//         }, {});

//         return colorMap; // Devuelve el mapa
//     } catch (error) {
//         console.error(error.response);
//         throw new Error(error.response?.data?.mensaje || "Error al obtener los colores");
//     }
// }

// POST
export async function createColor(nuevoColor) {
    try {
        const response = await axios.post("https://localhost:7050/api/Color/crearColor", nuevoColor);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteColor(colorId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Color/eliminarColor?ID=${colorId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}