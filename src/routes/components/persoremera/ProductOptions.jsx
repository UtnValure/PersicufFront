import React, { useState, useEffect } from 'react';
import { getTalleAlfabetico } from "../../../helpers/TAService";
import { getMangas } from '../../../helpers/mangasService';
import { getMateriales } from "../../../helpers/materialService";
import { getRubros } from "../../../helpers/rubroService";
import { getCorteCuello } from '../../../helpers/corteCuelloService';

function ProductOptions({
  onSizeChange,
  onCategoryChange,
  onSleeveChange,
  onMaterialChange,
  onNecklineChange,
  selectedSize,
  selectedCategory,
  selectedMaterial,
  selectedSleeve,
  selectedNeckline,
}) {
  const [sizes, setSizes] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [necklines, setNecklines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const talleAlfabeticos = await getTalleAlfabetico();
      setSizes(talleAlfabeticos.datos);

      const mangas = await getMangas();
      setSleeves(mangas.datos);

      const materialsData = await getMateriales();
            
            const filteredMaterials = materialsData.datos.filter(material => material.descripcion === 'Algodón' || material.descripcion === 'Poliéster' || material.descripcion === 'Lino');
            
            setMaterials(filteredMaterials);

      const rubros = await getRubros();
      setCategories(rubros.datos);

      const cortesCuello = await getCorteCuello();
      setNecklines(cortesCuello.datos);
    };
    
    fetchData();
  }, []);

  return (
    <div className="product-options">
      <div className="form-group">
        <label>Tamaño</label>
        <select
          value={selectedSize || ''}
          onChange={(e) => onSizeChange(e.target.value)}
          className="form-control"
        >
          <option value="">Selecciona un tamaño</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.descripcion}>
              {size.descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Rubro</label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="form-control"
        >
          <option value="">Selecciona un rubro</option>
          {categories.map((category) => (
            <option key={category.id} value={category.descripcion}>
              {category.descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Manga</label>
        <select
          value={selectedSleeve || ''}
          onChange={(e) => onSleeveChange(e.target.value)}
          className="form-control"
        >
          <option value="">Selecciona el tipo de manga</option>
          {sleeves.map((sleeve) => (
            <option key={sleeve.id} value={sleeve.descripcion}>
              {sleeve.descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Material</label>
        <select
          value={selectedMaterial || ''}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="form-control"
        >
          <option value="">Selecciona el material</option>
          {materials.map((material) => (
            <option key={material.id} value={material.descripcion}>
              {material.descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Corte de cuello</label>
        <select
          value={selectedNeckline || ''}
          onChange={(e) => onNecklineChange(e.target.value)}
          className="form-control"
        >
          <option value="">Selecciona el corte de cuello</option>
          {necklines.map((neckline) => (
            <option key={neckline.id} value={neckline.descripcion}>
              {neckline.descripcion}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductOptions;