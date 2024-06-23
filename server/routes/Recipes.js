import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import multer from 'multer';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Per ottenere __dirname in un modulo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.get('/search', verifyToken, async (req, res) => {
  console.log('Search endpoint called with query:', req.query);
  const { ingredient, regione, tipo, tempo_preparazione, difficolta } = req.query;
  let query = {};

  if (ingredient) {
    query['ingredienti.nome'] = { $regex: ingredient, $options: 'i' };
  }
  if (regione) {
    query.regione = { $regex: regione, $options: 'i' };
  }
  if (tipo) {
    query.tipo = { $regex: tipo, $options: 'i' };
  }
  if (tempo_preparazione) {
    const [min, max] = tempo_preparazione.split('-').map(Number);
    query.tempo_preparazione = { $gte: min, $lte: max };
  }
  if (difficolta) {
    query.difficolta = { $regex: difficolta, $options: 'i' };
  }

  try {
    const recipes = await Recipe.find(query);
    const recipesWithImageURL = recipes.map(recipe => ({
      ...recipe._doc,
      image: `http://localhost:6001/assets/${recipe.image}`,
    }));
    res.json(recipesWithImageURL);
  } catch (err) {
    console.error('Error in search endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  console.log('Get all recipes endpoint called');
  try {
    const recipes = await Recipe.find();
    const recipesWithImageURL = recipes.map(recipe => ({
      ...recipe._doc,
      image: `http://localhost:6001/assets/${recipe.image}`,
    }));
    res.json(recipesWithImageURL);
  } catch (err) {
    console.error('Error in get all recipes endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/regions', verifyToken, async (req, res) => {
  console.log('Get regions endpoint called');
  try {
    const regions = await Recipe.distinct('regione');
    res.json(regions);
  } catch (err) {
    console.error('Error in get regions endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/types', verifyToken, async (req, res) => {
  console.log('Get types endpoint called');
  try {
    const types = await Recipe.distinct('tipo');
    res.json(types);
  } catch (err) {
    console.error('Error in get types endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/difficulties', verifyToken, async (req, res) => {
  console.log('Get difficulties endpoint called');
  try {
    const difficulties = await Recipe.distinct('difficolta');
    const validDifficulties = difficulties.filter(difficulty => difficulty !== null && difficulty !== '');
    console.log("Difficoltà trovate:", validDifficulties);
    res.json(validDifficulties);
  } catch (err) {
    console.error("Errore nel recupero delle difficoltà:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/getBulk', verifyToken, async (req, res) => {
  console.log('Get bulk recipes endpoint called with IDs:', req.body.ids);
  try {
    const { ids } = req.body;
    const recipes = await Recipe.find({ _id: { $in: ids } });
    const recipesWithImageURL = recipes.map(recipe => ({
      ...recipe._doc,
      image: `http://localhost:6001/assets/${recipe.image}`,
    }));
    res.json(recipesWithImageURL);
  } catch (err) {
    console.error('Error in get bulk recipes endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/toggleFavorite', verifyToken, async (req, res) => {
  console.log('Toggle favorite recipe endpoint called with userId:', req.body.userId, 'and recipeId:', req.body.recipeId);
  const { userId, recipeId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.favorites.indexOf(recipeId);
    if (index === -1) {
      user.favorites.push(recipeId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    return res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error in toggle favorite recipe endpoint:', error.message);
    return res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  console.log('Get recipe by ID endpoint called with ID:', req.params.id);
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    const recipeWithImageURL = {
      ...recipe._doc,
      image: `http://localhost:6001/assets/${recipe.image}`
    };
    res.json(recipeWithImageURL);
  } catch (err) {
    console.error('Error in get recipe by ID endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  console.log('Create recipe endpoint called with body:', req.body);
  const { titolo, ingredienti, regione, tipo, tempo_preparazione, difficolta, istruzioni, costo } = req.body;
  const image = req.file ? req.file.filename : null;

  // Parse ingredienti
  let parsedIngredienti;
  try {
    parsedIngredienti = JSON.parse(ingredienti);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid format for ingredienti' });
  }

  const recipe = new Recipe({
    titolo,
    ingredienti: parsedIngredienti,
    regione,
    tipo,
    tempo_preparazione,
    difficolta,
    istruzioni,
    costo,
    image
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error in create recipe endpoint:', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  console.log('Update recipe endpoint called with ID:', req.params.id, 'and body:', req.body);
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { titolo, ingredienti, regione, tipo, tempo_preparazione, difficolta, istruzioni, costo } = req.body;

    // Parse ingredienti
    let parsedIngredienti;
    try {
      parsedIngredienti = JSON.parse(ingredienti);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid format for ingredienti' });
    }

    const image = req.file ? req.file.filename : recipe.image;

    recipe.titolo = titolo;
    recipe.ingredienti = parsedIngredienti;
    recipe.regione = regione;
    recipe.tipo = tipo;
    recipe.tempo_preparazione = tempo_preparazione;
    recipe.difficolta = difficolta;
    recipe.istruzioni = istruzioni;
    recipe.costo = costo;
    recipe.image = image;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    console.error('Error in update recipe endpoint:', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  console.log('Delete recipe endpoint called with ID:', req.params.id);
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.image) {
      fs.unlinkSync(path.join(__dirname, '../public/assets', recipe.image));
    }

    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error('Error in delete recipe endpoint:', err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
