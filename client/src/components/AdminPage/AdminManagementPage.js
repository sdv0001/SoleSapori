import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeForm from './RecipeForm';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "./AdminManagementPage.scss";

const AdminManagementPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:6001/recipes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Errore nel caricamento delle ricette:', error);
      }
    };

    fetchRecipes();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6001/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error('Errore nella cancellazione della ricetta:', error);
    }
  };

  const handleAdd = async (recipe) => {
    try {
      const response = await axios.post('http://localhost:6001/recipes', recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => [...prev, response.data]);
      setFormVisible(false);
    } catch (error) {
      console.error('Errore nell\'aggiunta della ricetta:', error);
    }
  };

  const handleUpdate = async (recipe) => {
    try {
      const response = await axios.put(`http://localhost:6001/recipes/${recipe.get('_id')}`, recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => prev.map((r) => (r._id === recipe.get('_id') ? response.data : r)));
      setEditingRecipe(null);
      setFormVisible(false);
    } catch (error) {
      console.error('Errore nell\'aggiornamento della ricetta:', error);
    }
  };

  const handleOpenForm = () => {
    setEditingRecipe(null);
    setFormVisible(true);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  return (
    <div className="admin-management-page">
      <button onClick={() => navigate(-1)}>Indietro</button>
      <h1>Gestione Admin</h1>
      <button className="add-recipe-button" onClick={handleOpenForm}>Aggiungi Ricetta</button>
      {isFormVisible && (
        <RecipeForm
          onSave={editingRecipe ? handleUpdate : handleAdd}
          recipe={editingRecipe}
          onClose={handleCloseForm}
        />
      )}
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe._id} className="recipe-item">
            <h2>{recipe.titolo}</h2>
            <div className="button-group">
              <button onClick={() => handleEdit(recipe)}>Modifica</button>
              <button onClick={() => handleDelete(recipe._id)}>Cancella</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminManagementPage;
