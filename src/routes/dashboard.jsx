import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUsuarios, deleteUsuario, updateUsuario } from "../helpers/usuarios/usuariosService"; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para cargar usuarios desde el servicio
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUsuarios(); // Llamada al servicio
      console.log('Respuesta de la API:', response); // Log para revisar la respuesta
  
      // Asegurarte de que los datos estén en el lugar correcto
      if (response && response.data && Array.isArray(response.data.datos)) {
        const usuarios = response.data.datos.map((usuario) => ({
          id: usuario.id,
          name: usuario.nombreUsuario,
          isAdmin: usuario.permisoID === 1, // Si permisoID es 1, marcar como admin
        }));
        setUsers(usuarios);
      } else {
        setError('No se encontraron usuarios');
      }
    } catch (err) {
      console.error(err); // Mostrar el error real
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Llamada inicial para cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isAdmin: !user.isAdmin } : user
    ));
  };

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmDelete) {
      try {
        deleteUsuario(id); // Llamada a la API para eliminar el usuario
        setUsers(users.filter(user => user.id !== id)); // Actualizar el estado
      } catch (err) {
        console.error("Error al eliminar el usuario:", err);
        setError('Error al eliminar el usuario');
      }
    }
  };

  const handleUpdateUser = async (id, isAdmin) => {
    try {
      const permisoID = isAdmin ? 1 : 2; // Si está marcado como admin, asignar 1, si no, 2
      await updateUsuario(id, permisoID); // Llamar al servicio con los dos parámetros
      setUsers(users.map(user => 
        user.id === id ? { ...user, isAdmin } : user
      ));
    } catch (err) {
      console.error("Error al actualizar el usuario:", err.message);
      setError('Error al actualizar el usuario');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Panel de Administración - Persicuf</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'clothing' ? 'active' : ''}`}
            onClick={() => setActiveTab('clothing')}
          >
            Prendas de Ropa
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div>
          <h2>Gestión de Usuarios</h2>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Admin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={() => toggleAdminStatus(user.id)}
                        />
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdateUser(user.id, user.isAdmin)}>Actualizar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'clothing' && (
        <div>
          <h2>Gestión de Prendas de Ropa</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clothingItems.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteClothingItem(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;