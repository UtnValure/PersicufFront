import React, { useState } from "react";
import { buscarPrendas } from "../../helpers/prendasService";

const Buscador = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
        setError(""); // Limpiar errores previos
        try {
            const prendas = await buscarPrendas(searchTerm);
            setResults(prendas); // Actualizar resultados
        } catch (error) {
            setError(error.message); // Mostrar mensaje de error
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSearch} className="d-flex justify-content-center mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar prendas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
                <button className="btn btn-primary" type="submit">
                    Buscar
                </button>
            </form>

            {error && <p className="text-danger">{error}</p>}

            <ul className="list-group">
                {results.map((prenda) => (
                    <li key={prenda.id} className="list-group-item">
                        {prenda.nombre}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Buscador;
