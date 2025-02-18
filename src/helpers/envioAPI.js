// import axios from "axios";

// //POST

// export async function createEnvio(nuevoEnvio) {
//     const config = {
//         headers: {
//              'Authorization': 'Bearer kc3lpz8ukoppvaaq1z5vzoyy4ckqzojqgb693gwv', 
//              'Content-Type': 'application/json'
//         },
//     };
//     try {
//         const response = await axios.post("https://cors-anywhere.herokuapp.com/https://veloway-backend-dahf.onrender.com/api/envios/create", nuevoEnvio, config);
//         console.log("Envio:",response);
//         return response.data.nroSeguimiento;
//     } catch (error) {
//         console.log("Este es el error: ", error);
//         throw new Error(error);
//     }
// };

// export async function getEnvio(nroSeguimiento) {
//     const config = {
//         headers: {
//              'Authorization': 'Bearer kc3lpz8ukoppvaaq1z5vzoyy4ckqzojqgb693gwv', 
//              'Content-Type': 'application/json'
//         },
//     };
//     try {
//         const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://veloway-backend-dahf.onrender.com/api/envios/nro-seguimiento/${nroSeguimiento}`,config);
//         console.log("Envio:",response);
//         return response.data;
//     } catch (error) {
//         console.log("Este es el error: ", error);
//         throw new Error(error);
//     }
// };

