import React, { useState, useEffect } from 'react';
import "./RecipeForm.scss";

const RecipeForm = ({ onSave, recipe, onClose }) => {
  const [formData, setFormData] = useState({
    _id: '',
    titolo: '',
    ingredienti: [],
    difficolta: '',
    tempo_preparazione: '',
    istruzioni: '',
    image: null,
    costo: 'medio',
    regione: '',
    tipo: '',
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        _id: recipe._id || '',
        titolo: recipe.titolo || '',
        ingredienti: recipe.ingredienti || [],
        difficolta: recipe.difficolta || '',
        tempo_preparazione: recipe.tempo_preparazione || '',
        istruzioni: recipe.istruzioni || '',
        image: null,
        costo: recipe.costo || 'medio',
        regione: recipe.regione || '',
        tipo: recipe.tipo || '',
      });
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredienti];
    newIngredients[index] = value;
    setFormData((prev) => ({ ...prev, ingredienti: newIngredients }));
  };

  const handleAddIngredient = () => {
    setFormData((prev) => ({ ...prev, ingredienti: [...prev.ingredienti, { nome: '', quantita: '' }] }));
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = formData.ingredienti.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ingredienti: newIngredients }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'ingredienti') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }
    onSave(data);
  };

  return (
    <div className="recipe-form-modal">
      <form className="recipe-form" onSubmit={handleSubmit}>
        <label>
          Titolo:
          <input
            type="text"
            name="titolo"
            value={formData.titolo}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ingredienti:
          {formData.ingredienti.map((ingredient, index) => (
            <div className="ingredient-container" key={index}>
              <input
                type="text"
                className="ingredient-name"
                placeholder="Nome"
                value={ingredient.nome || ''}
                onChange={(e) => handleIngredientChange(index, { ...ingredient, nome: e.target.value })}
                required
              />
              <input
                type="text"
                className="ingredient-quantity"
                placeholder="Quantità"
                value={ingredient.quantita || ''}
                onChange={(e) => handleIngredientChange(index, { ...ingredient, quantita: e.target.value })}
                required
              />
              <button type="button" onClick={() => handleRemoveIngredient(index)}>Rimuovi</button>
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient}>Aggiungi Ingrediente</button>
        </label>
        <label>
          Costo:
          <select
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            required
          >
            <option value="basso">Basso</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
        </label>
        <label>
          Regione:
          <input
            type="text"
            name="regione"
            value={formData.regione}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tipo:
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="Antipasto">Antipasto</option>
            <option value="Primi piatti">Primi piatti</option>
            <option value="Secondi piatti">Secondi piatti</option>
            <option value="Dolci">Dolci</option>
          </select>
        </label>
        <label>
          Difficolta:
          <select
            name="difficolta"
            value={formData.difficolta}
            onChange={handleChange}
            required
          >
            <option value="Facile">Facile</option>
            <option value="Media">Media</option>
            <option value="Difficile">Difficile</option>
          </select>
        </label>
        <label>
          Tempo di preparazione:
          <input
            type="number"
            name="tempo_preparazione"
            value={formData.tempo_preparazione}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Istruzioni:
          <textarea
            name="istruzioni"
            value={formData.istruzioni}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Immagine:
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Salva</button>
        <button type="button" onClick={onClose}>Chiudi</button>
      </form>
    </div>
  );
};

export default RecipeForm;
