import axios from "axios";

// GET
export async function getImagenes() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/Imagen/obtenerImagenes");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las Imagenes");
    }
}

export async function getimgURLporID(id) {
    try {
        const response = await getImagenes();
        const imgs = response.datos; // Asegúrate de que datos sea correcto según el formato de la API
        const img = imgs.find(t => t.id === id);
        if (img) {
            return img.path;
        } else {
            throw new Error(`No se encontró un img con el id: ${id}`);
        }
    } catch (error) {
        console.error("Error al obtener la url del img:", error.message);
        throw error;
    }
}

// POST
export async function createImagen(nuevaImagen) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/Imagen/crearImagen", nuevaImagen);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteImagen(ImagenId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/Imagen/eliminarImagen?ID=${ImagenId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

// Obtener el ID de un img por su nombre
export async function getimgID(url) {
    try {
        const response = await getImagenes();
        const imgs = response.datos; // Asegúrate de que datos sea correcto según el formato de la API
        const img = imgs.find(t => t.path === url);
        if (img) {
            return img.id;
        } else {
            throw new Error(`No se encontró un img con el url: ${url}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del img:", error.message);
        throw error;
    }
}

export async function getImagenPorID(ID) {
    if (ID != null){
        try {
            const response = await getImagenes();
            const imagenes = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
            const imagen = imagenes.find(t => t.id === Number(ID));
            if (imagen) {
                return imagen;
            } else {
                throw new Error(`No se encontró la imagen con el ID: ${ID}`);
            }
        } catch (error) {
            console.error("Error al obtener la imagen:", error.message);
            throw error;
        }
    } else {
        return null;
    }
    
}