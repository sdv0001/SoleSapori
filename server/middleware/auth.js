import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify token sent in the request header.
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      console.log("Token not found");
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id); // Trova l'utente nel database
    if (!user) {
      console.log("User not found");
      return res.status(403).send("Access Denied");
    }

    req.user = { ...verified, role: user.role }; // Aggiorna req.user con il ruolo dal database
    console.log("User verified:", req.user); // Log per verificare l'utente verificato
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  console.log("isAdmin middleware - req.user:", req.user); // Log per verificare req.user
  if (req.user && req.user.role === "admin") {
    console.log("Admin verified:", req.user); // Log per verificare se l'utente è admin
    next();
  } else {
    console.log("Access Denied. User role:", req.user ? req.user.role : "none"); // Log per verificare il ruolo
    res.status(403).json({ message: 'Access Denied. Only administrators can perform this action.' });
  }
};
