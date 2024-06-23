import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picture } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picture,
      role: 'user',
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    user.password = undefined;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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
