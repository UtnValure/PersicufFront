import React, { forwardRef } from 'react';
import '../../../styles/persopantalon/ProductViewer.css';

const ProductViewer = forwardRef(({ color, uploadedImage, imagePosition, selectedLarge }, ref) => {
  const isBackView = imagePosition === 'Detrás';

  const getImageStyle = () => {
    const baseStyle = { maxWidth: '20%', maxHeight: '20%' };
    switch (imagePosition) {
      case 'Bolsillo izquierdo':
        return { ...baseStyle, top: '45%', left: '30%', transform: 'translate(-50%, -50%)' };
      case 'Bolsillo derecho':
        return { ...baseStyle, top: '45%', left: '70%', transform: 'translate(-50%, -50%)' };
      case 'Detrás':
        return { ...baseStyle, top: '25%', left: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return baseStyle;
    }
  };

  const getPantsImage = () => {
    const largeType = selectedLarge === 'Largo' ? 'largo' : 'corto';
    const view = isBackView ? 'atras' : 'adelante';
    return `https://raw.githubusercontent.com/Calvo-Bautista/imagenes/refs/heads/main/pantalon${largeType}${view}.png`;
  };

  return (
    <div className="product-viewer" ref={ref}>
      <div className="product-viewer-container">
        {/* Color base del pantalón */}
        <div
          className="base-pants"
          style={{ '--color': `#${color}` }}
        />

        {/* Imagen del pantalón */}
        <img
          src={getPantsImage()}
          alt="Pantalón"
          className="pants-image"
        />

        {/* Imagen subida por el usuario */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Diseño subido"
            style={getImageStyle()}
            className="uploaded-design"
          />
        )}
      </div>
    </div>
  );
});

export default ProductViewer;
