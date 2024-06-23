import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantita: { type: String, required: true }
});

const RecipeSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  ingredienti: [IngredientSchema],
  regione: { type: String, required: true },
  tipo: { type: String, required: true },
  tempo_preparazione: { type: Number, required: true },
  difficolta: { type: String, required: true },
  istruzioni: { type: String, required: true },
  costo: { type: String, required: true },
  image: { type: String, required: true } // Memorizza solo il nome del file dell'immagine
});

// Specifica il nome della collezione come 'ricette'
const Recipe = mongoose.model('Recipe', RecipeSchema, 'ricette');

export default Recipe;
