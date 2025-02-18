import axios from "axios";


export async function getMangaID(nombreManga) {
    try {
        const response = await getMangas();
        const Mangas = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const Manga = Mangas.find(l => l.descripcion === nombreManga);
        if (Manga) {
            return Manga.id;
        } else {
            throw new Error(`No se encontró un Corte con el nombre: ${nombreManga}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del Corte:", error.message);
        throw error;
    }
}




export async function getMangas() {
    try {
        const response = await axios.get("https://persicufback-production.up.railway.app/api/Manga/obtenerMangas");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los Mangas");
    }
}

export async function createManga(nuevoManga) {
    try {
        const response = await axios.post("https://persicufback-production.up.railway.app/api/Manga/crearManga", nuevoManga);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

export async function deleteTalleAlfabetico(MangaId) {
    try {
        const response = await axios.delete(`https://persicufback-production.up.railway.app/api/Manga/eliminarManga?ID=${MangaId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

export async function getMangaPorID(ID) {
    try {
        const response = await getMangas();
        const mangas = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const Manga = mangas.find(t => t.id === Number(ID));
        if (Manga) {
            return Manga;
        } else {
            throw new Error(`No se encontró la Manga con el ID: ${ID}`);
        }
    } catch (error) {
        console.error("Error al obtener la Manga:", error.message);
        throw error;
    }
}