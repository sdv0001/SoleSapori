// Import necessario
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../homePage/HomePage.scss";
import Header from "../header/Header";
import RecipeList from "../recipeList/RecipeList";
import RecipeDetail from "../recipeDetail/RecipeDetail";
import { setSavedRecipes } from "../../state";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, savedRecipes, token } = useSelector((state) => state);

  const [recipeDetail, setRecipeDetail] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  const handleBookmarkClick = async (recipeId) => {
    const response = await axios.put(
      `http://localhost:6001/users/${user._id}/savedRecipe`,
      { recipeId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const savedRecipesData = response.data;
    if (savedRecipesData) {
      dispatch(
        setSavedRecipes({
          savedRecipes: savedRecipesData,
        })
      );
    }
  };

  const getRandom = async () => {
    try {
      const api = await axios.get("http://localhost:6001/recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Dati ricevuti dal backend (getRandom):", api.data); // Log dettagliato
      setRandomRecipes(api.data);
    } catch (error) {
      console.error("Errore nel caricamento delle ricette:", error);
    }
  };

  useEffect(() => {
    getRandom();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRecipeDetails = async (check, recipeDetail) => {
    if (check) {
      const response = await axios.get(`http://localhost:6001/recipes/${recipeDetail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log("Dati ricevuti dal backend (handleRecipeDetails):", data); // Log dettagliato
      setRecipeDetail(data);
    } else {
      setRecipeDetail(recipeDetail);
    }
  };

  const searchRecipes = async (params) => {
    try {
      const response = await axios.get('http://localhost:6001/recipes/search', { params });
      console.log("Dati cercati ricevuti dal backend (searchRecipes):", response.data); // Log dettagliato
      setSearchedRecipes(response.data);
    } catch (error) {
      console.error("Errore nella ricerca delle ricette:", error);
    }
  };

  function handleNavigateHome() {
    setRecipeDetail(null);
    navigate("/home");
  }

  function handleNavigateProfile(userId) {
    setRecipeDetail(null);
    navigate(`/profile/${userId}`);
  }

  return (
    <div className="home-page-container">
      <Header
        searchRecipes={searchRecipes}
        isHome={true}
        handleNavigateHome={handleNavigateHome}
        handleNavigateProfile={handleNavigateProfile}
      />

      {recipeDetail ? (
        <RecipeDetail recipe={recipeDetail} />
      ) : (
        <div className="recipe-catalogue-container">
          {console.log("Ricette random:", randomRecipes)}
          {console.log("Ricette cercate:", searchedRecipes)}
          {searchedRecipes.length > 0
            ? searchedRecipes.map((recipe, index) => (
                <RecipeList
                  key={index}
                  recipe={recipe}
                  recipeType="searchedRecipe"
                  handleRecipeDetails={handleRecipeDetails}
                  onBookmarkClick={handleBookmarkClick}
                  isBookmarked={savedRecipes.includes(recipe._id)}
                  isHome={true}
                />
              ))
            : randomRecipes.map((recipe, index) => (
                <RecipeList
                  key={index}
                  recipe={recipe}
                  recipeType="randomRecipe"
                  handleRecipeDetails={handleRecipeDetails}
                  onBookmarkClick={handleBookmarkClick}
                  isBookmarked={savedRecipes.includes(recipe._id)}
                  isHome={true}
                />
              ))}
        </div>
      )}

      {/* Link alla pagina di gestione per admin */}
      {user.role === 'admin' && (
        <div className="admin-management-link">
          <Link to="/admin">Gestione Admin</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
