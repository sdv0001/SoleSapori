import React, { useState, useEffect } from 'react';
import "../recipeList/RecipeList.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { saveRecipe, removeRecipe } from '../../state/index';
import axios from 'axios';

const RecipeList = ({ recipe, handleRecipeDetails, isBookmarked, isHome }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setLocalIsBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmarkClick = async (recipeId) => {
    try {
      console.log("Bookmark clicked for recipe ID:", recipeId);
      if (localIsBookmarked) {
        // Rimuovi dai preferiti
        await axios.put(
          `http://localhost:6001/users/${user._id}/savedRecipe`,
          { recipeId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(removeRecipe({ recipeId }));
      } else {
        // Aggiungi ai preferiti
        await axios.put(
          `http://localhost:6001/users/${user._id}/savedRecipe`,
          { recipeId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(saveRecipe({ recipeId }));
      }
      setLocalIsBookmarked(!localIsBookmarked);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleRecipeClick = () => {
    console.log("Recipe clicked:", recipe);
    handleRecipeDetails(false, recipe);
  };

  return (
    <div className='recipe-container' onClick={handleRecipeClick}>
      <img src={recipe.image} alt={recipe.titolo} className='recipe-catalogue-image' />
      <div className='recipe-catalogue-title'>
        <span className='recipe-title'>{recipe.titolo}</span>
        {isHome && (
          <FontAwesomeIcon 
            className={`bookmark-icon ${localIsBookmarked ? 'bookmarked' : ''}`}
            icon={faBookmark} 
            onClick={(e) => {
              e.stopPropagation();
              handleBookmarkClick(recipe._id);
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default RecipeList;
