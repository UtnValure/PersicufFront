/*
import axios from "axios";

//POST

export async function createPost(nuevoPost) {
    const config = {
            headers: {
                Authorization: `Token 1f2579ebc6757b7e1cc592435f6220b0e49a4414`, // Envío del token
                "Content-Type": "application/json",
            },
        };
    try {
        
        const response = await axios.post("http://localhost:8000/posts/", nuevoPost, config);
        return response.data.id;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//GET

export async function getPost(nuevoPost) {
    try {
        const response = await axios.get("http://localhost:8000/posts/", nuevoPost);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

export async function postImagen(nuevoPost,) {
    const config = {
        headers: {
            Authorization: `Token 1f2579ebc6757b7e1cc592435f6220b0e49a4414`, // Envío del token
            "Content-Type": "application/json",
        },
    };
    try {
        const response = await axios.post('http://localhost:8000/posts/'+nuevoPost.post+'/images/', nuevoPost, config);
        console.log(response.response);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response)
        throw new Error(error.response);
    }
};

export async function createReview(Post) {
    const config = {
            headers: {
                Authorization: `Token 1f2579ebc6757b7e1cc592435f6220b0e49a4414`, // Envío del token
                "Content-Type": "application/json",
            },
        };
    try {
        console.log(Post.id)
        const response = await axios.post("http://localhost:8000/posts/"+Post.id+"/reviews/", Post, config);
        return response.data.id;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
};

export async function obtenerReview(PostID) {
    const config = {
        headers: {
            Authorization: `Token 1f2579ebc6757b7e1cc592435f6220b0e49a4414`, // Envío del token
            "Content-Type": "application/json",
        },
    };
    try {
        const response = await axios.get("http://localhost:8000/posts/" + PostID + "/reviews/", config);
        return response.data; 
    } catch (error) {
        console.log("Error al obtener reseñas:", error);
        throw new Error(error.response.data.mensaje);
    }
};

export async function obtenerValoracionTotal(PostID) {
    const config = {
        headers: {
            Authorization: `Token 1f2579ebc6757b7e1cc592435f6220b0e49a4414`, // Envío del token
            "Content-Type": "application/json",
        },
    };
    try {
        const response = await axios.get(`http://localhost:8000/posts/${PostID}/reviews/`, config);

        const reviews = response.data; // Lista de reseñas
        if (reviews == []) {
            return 0; // Si no hay reseñas, retornar 0
        }

        // Sumar todas las calificaciones y dividir por la cantidad de reseñas
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const promedio = totalRating / reviews.length;

        return promedio.toFixed(2); // Devolver con dos decimales
    } catch (error) {
        console.log("Error al obtener valoracion total:", error);
        throw new Error(error.response?.data?.mensaje || "Error desconocido");
    }
}


export async function obtenerNombreUsuarioReview(ID) {
    try { 
        const response = await axios.get("http://localhost:8000/users/"+ID+"/");
        return response.data.username; // Asegúrate de que se está devolviendo la respuesta de reviews
    } catch (error) {
        console.log("Error al obtener el nombre:", error);
        throw new Error(error.response.data.mensaje);
    }
};
*/
