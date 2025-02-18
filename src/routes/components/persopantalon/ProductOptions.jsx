import React, { useState, useEffect } from 'react';
import { getTalleAlfabetico } from "../../../helpers/TAService";
import { getMateriales } from "../../../helpers/materialService";
import { getRubros } from "../../../helpers/rubroService";
import { getLargos } from '../../../helpers/largoService';


function ProductOptions({
  onSizeChange,
  onCategoryChange,
  onLargeChange,
  onMaterialChange,
  selectedSize,
  selectedCategory,
  selectedMaterial,
  selectedLarge,
}) {
  const [sizes, setSizes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [larges, setLarges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const talleAlfabeticos = await getTalleAlfabetico();
      setSizes(talleAlfabeticos.datos);

      const materialsData = await getMateriales();
                  
                  const filteredMaterials = materialsData.datos.filter(material => material.descripcion === 'Algodón' || material.descripcion === 'Poliéster' || material.descripcion === 'Mezclilla');
                  
                  setMaterials(filteredMaterials);

      const rubros = await getRubros();
      setCategories(rubros.datos);

      const largos = await getLargos();
      setLarges(largos.datos)
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
        <label>Largo</label>
        <select
          value={selectedLarge || ''}
          onChange={(e) => onLargeChange(e.target.value)}
          className="form-control"
        >
          <option value="">Selecciona el tipo de largo</option>
          {larges.map((large) => (
            <option key={large.id} value={large.descripcion}>
              {large.descripcion}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductOptions;
