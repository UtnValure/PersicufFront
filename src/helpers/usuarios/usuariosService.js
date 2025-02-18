import axios from "axios";

// GET ID

export function getUsuarioID() {
    const fetchUsuarioID = async () => {
        try {
          const response = await getUsuarios(); // o buscarUsuario con el ID
          const usuario = response.data; // Ajusta según el formato de respuesta de tu backend
          return usuario.id;
        } catch (error) {
          console.error("Error al obtener el usuario:", error.message);
          throw error;
        }
      };      
  }


// GET
export async function getUsuarios() {
    try {
        const response = await axios.get("https://localhost:7050/api/Usuario/obtenerUsuarios");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// GETNOMBREUSUARIO
export async function buscarUsuario(usuarioId) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Usuario/BuscarUsuario?ID=${usuarioId}`);
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createUsuario(nuevoUsuario) {
    try {
        const response = await axios.post("https://localhost:7050/api/Usuario/crearUsuario", nuevoUsuario);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteUsuario(usuarioId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Usuario/eliminarUsuario?ID=${usuarioId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

//EDIT
export async function updateUsuario(usuarioId, permisoID) {
    try {
        // Enviar usuarioId y permisoID como parámetros de consulta
        const response = await axios.patch(`https://localhost:7050/api/Usuario/modificarPermisoUsuario?ID=${usuarioId}&permisoID=${permisoID}`);
        return response;
    } catch (error) {
        console.log("Error en el service", error.response);
        throw new Error(error.response.data.mensaje);
    }
}
