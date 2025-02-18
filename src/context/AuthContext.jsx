//el contexto de autenticacion se encargue de almacenar y gestionar la información del usuario logueado, 
//incluyendo su rol.
import React, { createContext, useState, useEffect } from 'react';
import { login, logout } from '../helpers/usuarios/loginRegisterLogout';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [userId, setUserId] = useState(null); 
    const [role, setRole] = useState(null); 
    const [auth, setAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const verificarAutenticacion = async () => {
            const storedUser = localStorage.getItem("user");
            const storedRole = localStorage.getItem("userRole");
            const storedId = localStorage.getItem("userId");
            const storedAuthorization = localStorage.getItem("authorization");


            if (storedUser) {
                setUser(JSON.parse(storedUser)); 
            }

            if (storedRole) {
                setRole(storedRole); 
            }

            if (storedId) {
                setUserId(parseInt(storedId));
            }
            setLoading(false);
            if (storedAuthorization){
                setAuthenticated(storedAuthorization)
            }
        };

        verificarAutenticacion();
    }, []);

    const iniciarSesion = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const userInfo = await login(userData);
            console.log("estoy en inicio de sesion", userInfo);

            localStorage.setItem("user", JSON.stringify(userInfo.userData));
            localStorage.setItem("userId", userInfo.userData.id);
            localStorage.setItem("userRole", userInfo.userData.rol);
            localStorage.setItem("authorization", userInfo.userData.token);

            setUser(userInfo.userData); 
            setUserId(parseInt(userInfo.userData.id));
            setRole(userInfo.userData.rol); 
            setAuthenticated(userInfo.userData.token);
            return true;
        } catch (error) {
            console.error('Error en el login:', error);
            setError('Usuario o contraseña incorrectos');
            return false;
        }finally {
            setLoading(false);
        }
    };

    const cerrarSesion = async () => {
        setLoading(true);
        try {
            await logout(); 
            setUser(null);
            setUserId(null);
            setRole(null); 
            setAuthenticated(null);
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            localStorage.removeItem("authorization");
        } catch (error) {
            console.error('Error en el logout:', error);
        }finally{
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userId, role, auth, loading, iniciarSesion, cerrarSesion, error }}>
            {children}
        </AuthContext.Provider>
    );
};