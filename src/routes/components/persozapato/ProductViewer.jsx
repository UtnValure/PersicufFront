import React, { forwardRef } from 'react';
import '../../../styles/persozapato/ProductViewer.css';

const ProductViewer = forwardRef(({ color, hasMetalToe }, ref) => {
  const getShoeImage = () => {
    return `https://raw.githubusercontent.com/Calvo-Bautista/imagenes/refs/heads/main/zapatilla.png`;
  };

  return (
    <div className="product-viewer" ref={ref}>
      <div className="shoe-container" style={{ '--color': color ? `#${color}` : '#000000' }}>
        {/* Imagen de la zapatilla */}
        <img
          src={getShoeImage()}
          alt="Shoe"
          className="shoe-image"
        />
      </div>
    </div>
  );
});

export default ProductViewer;
