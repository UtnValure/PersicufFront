import React, { useState, useEffect, useContext, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import ProductViewer from './persoremera/ProductViewer';
import ColorSelector from './personalizar/ColorSelector';
import ProductOptions from './persoremera/ProductOptions';
import ImageUploader from './persoremera/ImageUploader';
import { createRemera } from '../../helpers/remerasService';
import { getColores } from '../../helpers/coloresService';
import { getTalleAlfabeticoID } from '../../helpers/TAService';
import { getCorteCuelloID } from '../../helpers/corteCuelloService';
import { getMangaID, getMangas } from '../../helpers/mangasService';
import { getMaterialID, getMateriales } from '../../helpers/materialService';
import { createImagen, getimgID } from "../../helpers/imagenService";
import { getubicacionID } from '../../helpers/ubicacionesService';
import { getRubros } from '../../helpers/rubroService';
import axios from "axios";
import domToImage from 'dom-to-image-more';
// import { createPost } from '../../helpers/reviewService';
import '../../styles/Personalizacion.css'

const base64ToFile = (base64String, filename) => {
  let arr = base64String.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const usePersonalizacionRemeras = () => {
  const [selectedColor, setSelectedColor] = useState({ codigoHexa: 'FFFFFF' });
  const [selectedSize, setSelectedSize] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePosition, setImagePosition] = useState('Pecho centro');
  const [selectedSleeve, setSelectedSleeve] = useState('');
  const [selectedNeckline, setSelectedNeckline] = useState('');
  const [shirtName, setShirtName] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [colors, setColors] = useState([]);
  const [sleeveTypes, setSleeveTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [price, setPrice] = useState(0);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const colores = await getColores();
        setColors(colores);

        const mangas = await getMangas();
        if (mangas?.datos) setSleeveTypes(mangas.datos);

        const materiales = await getMateriales();
        if (materiales?.datos) setMaterialTypes(materiales.datos);

        const categories = await getRubros();
        if (categories?.datos) setCategoryTypes(categories.datos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchAllData();
  }, []);

  const updatePrice = () => {
    let basePrice = 0;
    const sleeve = sleeveTypes.find(item => item.descripcion === selectedSleeve);
    if (sleeve) basePrice += sleeve.precio;

    const material = materialTypes.find(item => item.descripcion === selectedMaterial);
    if (material) basePrice += material.precio;

    if (uploadedImage) basePrice += 4000;

    setPrice(basePrice);
  };

  useEffect(() => {
    updatePrice();
  }, [selectedSleeve, selectedMaterial, uploadedImage]);

  const getColorID = () => {
    const color = colors.find(c => c.codigoHexa.toUpperCase() === selectedColor.codigoHexa.toUpperCase());
    return color ? color.id : null;
  };

  const getCategoryID = () => {
    const category = categoryTypes.find(c => c.descripcion === selectedCategory);
    return category ? category.id : null;
  };

  return {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    uploadedImage,
    setUploadedImage,
    imagePosition,
    setImagePosition,
    selectedSleeve,
    setSelectedSleeve,
    selectedNeckline,
    setSelectedNeckline,
    shirtName,
    setShirtName,
    selectedMaterial,
    setSelectedMaterial,
    getColorID,
    categoryTypes,
    setCategoryTypes,
    price,
    selectedCategory,
    setSelectedCategory,
    getCategoryID,
  };
};

function PersonalizacionRemeras() {
  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    uploadedImage,
    setUploadedImage,
    imagePosition,
    setImagePosition,
    selectedSleeve,
    setSelectedSleeve,
    selectedNeckline,
    setSelectedNeckline,
    shirtName,
    setShirtName,
    selectedMaterial,
    setSelectedMaterial,
    getColorID,
    categoryTypes,
    setCategoryTypes,
    price,
    selectedCategory,
    setSelectedCategory,
    getCategoryID,
  } = usePersonalizacionRemeras();

  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const viewerRef = useRef(null);

  const handleSaveShirt = async () => {
    if (!shirtName) {
      alert('Por favor, escribe un nombre para tu remera antes de guardar.');
      return;
    }

    const colorID = getColorID();
    if (!colorID) {
      alert('El color seleccionado no es válido.');
      return;
    }

    const categoryID = getCategoryID();
    if (!categoryID) {
      alert('Por favor, selecciona un rubro.');
      return;
    }

    if (!userId) {
      alert('No se pudo identificar al usuario. Inténtalo nuevamente.');
      return;
    }

    try {
      let estampado = null;
      let renderURL = null;
      let imagen = null;
      const FILESTACK_API_KEY = 'AjII17vhrTW6nlVmqqZ8sz';
      if (uploadedImage) {
        const imageFile = base64ToFile(uploadedImage, 'upload.png');
        const formData = new FormData();
        formData.append('fileUpload', imageFile);

        try {
          const response = await axios.post(
            `https://www.filestackapi.com/api/store/S3?key=${FILESTACK_API_KEY}`,
            formData
          );
          const imageURL = response.data.url;
          const imgData = { path: imageURL, ubicacionID: await getubicacionID(imagePosition) };
          await createImagen(imgData);
          estampado = await getimgID(imageURL);
        } catch (error) {
          alert('No se pudo subir la imagen. Inténtalo nuevamente.');
          return;
        }
      }

      if (viewerRef.current) {
        const renderBlob = await domToImage.toBlob(viewerRef.current);
        const renderFile = new File([renderBlob], 'render.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('fileUpload', renderFile);

        const response = await axios.post(
          `https://www.filestackapi.com/api/store/S3?key=${FILESTACK_API_KEY}`,
          formData
        );

        renderURL = response.data.url;
        const imgData2 = { path: renderURL };
        await createImagen(imgData2);
        imagen = await getimgID(renderURL);
      }

      // const post = {
      //         title:shirtName,
      //         content:"Una remera personalizada en Persicuf!"
      //         };
            
      //         console.log("Post a enviar:", post);
      //         const postD = await createPost(post);

      const shirtData = {
        precio: price,
        rubroID: categoryID,
        colorID,
        estampadoID: estampado,
        imagenID: imagen,
        materialID: await getMaterialID(selectedMaterial),
        usuarioID: userId,
        nombre: shirtName,
        talleAlfabeticoID: await getTalleAlfabeticoID(selectedSize),
        corteCuelloID: await getCorteCuelloID(selectedNeckline),
        mangaID: await getMangaID(selectedSleeve),
        //postID: postD,
      };

      await createRemera(shirtData);
      alert(`Tu remera "${shirtName}" ha sido guardada exitosamente.`);
      navigate('/');
    } catch (error) {
      console.error('Error al guardar la prenda:', error);
      alert('No se pudo guardar la prenda. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Personaliza tu remera</h1>
      <div className="row">
        <div className="col-md-6">
          <ProductViewer
            ref={viewerRef}
            color={selectedColor.codigoHexa}
            uploadedImage={uploadedImage}
            imagePosition={imagePosition}
            selectedSleeve={selectedSleeve}
            selectedNeckline={selectedNeckline}
            selectedCategory={selectedCategory}
            className="product-viewer"
          />
          <div className="mt-3 text-start">
            <h4>Precio: ${price}</h4>
          </div>
        </div>
        <div className="col-md-6 text-start">
          <ColorSelector onColorSelect={setSelectedColor} className="color-selector" />
          <ImageUploader
            onImageUpload={setUploadedImage}
            onPositionSelect={setImagePosition}
            className="image-uploader"
          />
          <div className="mb-3">
            <label htmlFor="shirtName" className="form-label">Nombre de la remera:</label>
            <input
              type="text"
              id="shirtName"
              className="form-control"
              value={shirtName}
              onChange={(e) => setShirtName(e.target.value)}
              placeholder="Ingresa un nombre para tu remera"
            />
          </div>
          <ProductOptions
            onSizeChange={setSelectedSize}
            onCategoryChange={setSelectedCategory}
            onSleeveChange={setSelectedSleeve}
            onMaterialChange={setSelectedMaterial}
            onNecklineChange={setSelectedNeckline}
            selectedSize={selectedSize}
            selectedCategory={selectedCategory}
            selectedMaterial={selectedMaterial}
            selectedSleeve={selectedSleeve}
            selectedNeckline={selectedNeckline}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveShirt}
          >
            Guardar prenda
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalizacionRemeras;