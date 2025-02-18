import axios from 'axios';

export const registrarUsuario = async (data) => {
    try {
        const response = await axios.post("https://localhost:7050/api/Usuario/register", data, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};

export const login = async (data) => {
    try {
        const response = await axios.post("https://localhost:7050/api/Usuario/login", data, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};

export const logout = async () => {
    try {
        const response = await axios.post("https://localhost:7050/api/Usuario/logout", { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};
