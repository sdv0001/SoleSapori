import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
  token: null,
  savedRecipes: []
};

// Creating the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.savedRecipes = [];
    },
    setSavedRecipes: (state, action) => {
      state.savedRecipes = action.payload.savedRecipes;
    },
    saveRecipe: (state, action) => {
      if (!state.savedRecipes.includes(action.payload.recipeId)) {
        state.savedRecipes.push(action.payload.recipeId);
      }
    },
    removeRecipe: (state, action) => {
      state.savedRecipes = state.savedRecipes.filter(
        recipeId => recipeId !== action.payload.recipeId
      );
    }
  }
});

// Exporting actions and reducer
export const { setLogin, setLogout, setSavedRecipes, saveRecipe, removeRecipe } = authSlice.actions;
export default authSlice.reducer;
