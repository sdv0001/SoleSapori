import express from "express";
import connectDB from "./mongodb/connect.js";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/users.js";
import recipeRoutes from "./routes/Recipes.js"; 
import authRoutes from "./routes/auth.js";
import { verifyToken, isAdmin } from "./middleware/auth.js";
import { register, login } from "./controllers/auth.js"; // Assicurati di importare queste funzioni

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/DB_Pics", express.static(path.join(__dirname, "public/assets/DB_Pics"))); // Serve la cartella DB_Pics

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/auth/login", login);
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

/* PROTECTED ROUTES */
app.use("/users", verifyToken, userRoutes);
app.use("/recipes", verifyToken, recipeRoutes);
app.use("/auth", authRoutes);

/* ROUTE FOR UPLOADING IMAGES */
app.post("/upload", verifyToken, isAdmin, upload.single("image"), (req, res) => {
  try {
    res.status(200).json({ imagePath: `/assets/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
});

const PORT = process.env.PORT || 6001;

const startServer = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI);
    await connectDB(process.env.MONGODB_URI);
    console.log("MongoDB connected, starting server...");
    app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
