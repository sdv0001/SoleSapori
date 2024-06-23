import React, { useState } from 'react';
import axios from 'axios';
import "../recipeDetail/RecipeDetail.scss";
import { useDispatch, useSelector } from 'react-redux';
import { saveRecipe, removeRecipe } from '../../state/index';

const RecipeDetail = ({ recipe }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const savedRecipes = useSelector((state) => state.savedRecipes);
  const [activeTab, setActiveTab] = useState('instructions');
  const [isFavorite, setIsFavorite] = useState(savedRecipes.includes(recipe._id));

  const toggleFavorite = async () => {
    if (!user) return; // Se l'utente non è definito, esci dalla funzione

    try {
      await axios.put(
        `http://localhost:6001/users/${user._id}/savedRecipe`,
        { recipeId: recipe._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (isFavorite) {
        dispatch(removeRecipe({ recipeId: recipe._id }));
      } else {
        dispatch(saveRecipe({ recipeId: recipe._id }));
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite', error);
    }
  };

  return (
    <div className="recipe-detail-container">
      <h1 className="recipe-detail-heading">{recipe.titolo}</h1>
      <div className="recipe-detail-flex-container">
        <div className="recipe-detail-left-wrapper">
          <span className="cooking-time">Cooking time: <span className="highlight-text">{recipe.tempo_preparazione} minutes</span></span>
          <img
            className="recipe-detail-image"
            src={recipe.image}
            alt={recipe.titolo}
          />
        </div>
        <div className="recipe-detail-right-wrapper">
          <div className="recipe-detail-button-wrapper">
            <div className="recipe-tab-buttons">
              <button
                className={`recipe-tab-button ${activeTab === 'instructions' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
              <button
                className={`recipe-tab-button ${activeTab === 'ingredients' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </button>
            </div>
            <button
              type="button"
              className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
          {activeTab === 'instructions' && (
            <div className="recipe-detail-instruction">
              <div
                dangerouslySetInnerHTML={{ __html: recipe.istruzioni }}
              ></div>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <ul className="recipe-ingredients-list">
              {recipe.ingredienti.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  {ingredient.nome}: {ingredient.quantita}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;