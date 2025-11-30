import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import flowerRoutes from "./routes/flowerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
// Melayani file frontend statis dari folder 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Routes API
app.use("/api/flowers", flowerRoutes);
app.use("/api/categories", categoryRoutes);

// Route Fallback untuk Frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});