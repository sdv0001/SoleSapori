import React, { useEffect, useState } from "react";
import "../profilePage/ProfilePage.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setSavedRecipes } from "../../state/index";
import Header from "../header/Header";
import RecipeList from "../recipeList/RecipeList";
import RecipeDetail from "../recipeDetail/RecipeDetail";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [recipeDetail, setRecipeDetail] = useState(null);
  const dispatch = useDispatch();

  // Select user, token, and saved recipes from the Redux store
  const { user, token, savedRecipes } = useSelector((state) => state);

  // Fetch saved recipes and update state and Redux store
  const getSavedRecipes = async () => {
    try {
      console.log("Fetching saved recipes for user:", user._id);
      const savedRecipesResponse = await axios.get(
        `http://localhost:6001/users/${user._id}/savedRecipe`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const savedRecipesData = await savedRecipesResponse.data;
      console.log("Saved recipes data:", savedRecipesData);
      
      if (savedRecipesData) {
        dispatch(
          setSavedRecipes({
            savedRecipes: savedRecipesData.map(id => id.toString()), // Assicuriamoci che gli ID siano stringhe
          })
        );
      }

      // Aggiungi log per l'URL, headers e payload
      const url = `http://localhost:6001/recipes/getBulk`;

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      const payload = { ids: savedRecipesData };

      console.log("Making POST request to:", url);
      console.log("With headers:", headers);
      console.log("And payload:", payload);

      const response = await axios.post(
        url,
        payload,
        { headers }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      const data = response.data;
      console.log("Fetched bulk recipes:", data);
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching saved recipes or bulk recipes:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  };

  useEffect(() => {
    getSavedRecipes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log("Updated recipes state:", recipes);
  }, [recipes]);

  function handleRecipeDetails(check, recipeDetail) {
    console.log("Recipe detail:", recipeDetail);
    setRecipeDetail(recipeDetail);
  }

  function handleNavigateHome() {
    setRecipeDetail(null);
    navigate('/home');
  }

  function handleNavigateProfile(userId) {
    setRecipeDetail(null);
    navigate(`/profile/${userId}`)
  }

  return (
    <div>
      <Header isHome={false} handleNavigateHome={handleNavigateHome} handleNavigateProfile={handleNavigateProfile} />
      {recipeDetail ? (
        <RecipeDetail recipe={recipeDetail} />
      ) : (
        <div className="profile-container">
          <div className="user-container">
            <div className="user-details">
              <h2>{user.firstName} {user.lastName}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <h1 className="saved-recipes-text">Ricette salvate</h1>
          <div className="profile-recipe-catalogue-container">
            {recipes && recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <RecipeList
                  key={index}
                  recipe={recipe}
                  handleRecipeDetails={handleRecipeDetails}
                  isBookmarked={savedRecipes.includes(recipe._id.toString())} // Assicuriamoci che gli ID siano stringhe
                  isHome={false}
                />
              ))
            ) : (
              <p>Nessuna ricetta salvata.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
