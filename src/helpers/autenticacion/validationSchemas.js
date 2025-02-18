import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  nombreUsuario: Yup.string().required('El nombre de usuario es obligatorio'),
  clave: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = Yup.object().shape({
    nombreUsuario: Yup.string().required('El nombre de usuario es obligatorio'),
    correo: Yup.string().email('el correo electronico no es valido').required('el correo electronico es requerido'),
    clave: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    claveConfirmada: Yup.string()
    .oneOf([Yup.ref('clave'), null], 'Las contraseñas deben coincidir')
    .required('Debe confirmar su contraseña'),
});
