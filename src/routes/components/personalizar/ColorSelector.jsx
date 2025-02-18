import React, { useEffect, useState } from 'react';
import { getColores } from '../../../helpers/coloresService.js';

function ColorSelector({ onColorSelect }) {
  const [colores, setColores] = useState([]);

  useEffect(() => {
    const fetchColores = async () => {
      try {
        const colores = await getColores();
        if (colores.length > 0) { // Verifica si hay colores disponibles
          setColores(colores); // Actualiza el estado con el array de colores
        } else {
          console.error('No se encontraron colores disponibles.');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    };
  
    fetchColores();
  }, []);
  

  return (
    <div className="mb-3">
      <h4>Selecciona un color</h4>
      <div className="d-flex">
        {colores.map((color) => (
          <div
            key={color.id}
            onClick={() => onColorSelect({ codigoHexa: color.codigoHexa })}
            style={{
              backgroundColor: `#${color.codigoHexa}`,
              width: '30px',
              height: '30px',
              margin: '0 5px',
              cursor: 'pointer',
              border: '1px solid black',
            }}
            title={color.nombre} // Muestra el nombre al pasar el cursor
          />
        ))}
      </div>
    </div>
  );
}

export default ColorSelector;