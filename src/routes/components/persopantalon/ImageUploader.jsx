import React, { useState, useRef } from "react";

function ImageUploader({ onImageUpload, onPositionSelect }) {
  const [uploadedImage, setUploadedImage] = useState(null); // Contiene el src de la imagen (base64)
  const [position, setPosition] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setUploadedImage(fileReader.result); // Almacena la imagen en formato base64
        if (onImageUpload) {
          onImageUpload(fileReader.result); // Envía la imagen al componente padre (en base64)
        }
      };
      fileReader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona un archivo de imagen válido.");
    }
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
    if (onPositionSelect) {
      onPositionSelect(e.target.value);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (onImageUpload) {
      onImageUpload(null); // Notifica al componente padre que no hay imagen
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Resetea el input de archivo
    }
  };

  return (
    <div className="mb-3">
      <h4>Subir imagen</h4>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control mb-2"
        ref={fileInputRef}
      />
      <select
        className="form-select"
        value={position}
        onChange={handlePositionChange}
      >
        <option value="Bolsillo izquierdo">Bolsillo izquierdo</option>
        <option value="Bolsillo derecho">Bolsillo derecho</option>
        
      </select>
      {uploadedImage ? (
        <div className="mt-3">
          <p>Imagen subida correctamente:</p>
          <img
            src={uploadedImage}
            alt="Diseño subido"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <button className="btn btn-danger mt-2" onClick={handleRemoveImage}>
            Quitar imagen
          </button>
        </div>
      ) : (
        <p className="text-muted mt-2">No se ha subido ninguna imagen aún.</p>
      )}
    </div>
  );
}

export default ImageUploader;
