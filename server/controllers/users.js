import SavedRecipes from "../models/SavedRecipes.js";

/* READ */
export const getSavedRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const savedRecipes = await SavedRecipes.find({ userId });
    res.status(200).json(savedRecipes[0].recipeId);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const updateSavedRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;
    const userSavedRecipe = await SavedRecipes.findOne({ userId });

    if (!userSavedRecipe) {
      const newSavedRecipes = new SavedRecipes({
        userId,
        recipeId: [recipeId]
      });
      await newSavedRecipes.save();
    } else {
      const index = userSavedRecipe.recipeId.indexOf(recipeId);
      if (index === -1) {
        userSavedRecipe.recipeId.push(recipeId);
      } else {
        userSavedRecipe.recipeId.splice(index, 1);
      }
      await userSavedRecipe.save();
    }

    const updatedSavedRecipes = await SavedRecipes.findOne({ userId });
    res.status(200).json(updatedSavedRecipes.recipeId);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
