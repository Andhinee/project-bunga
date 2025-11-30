// src/routes/flowerRoutes.js
import express from "express";
import multer from "multer"; // Import Multer untuk handle file upload
import { FlowerController } from "../controllers/flowerController.js";

const router = express.Router();

// --- KONFIGURASI MULTER ---
// Kita gunakan memoryStorage agar file disimpan sementara di RAM
// sebelum diupload ke Supabase (tidak perlu disimpan ke folder lokal)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Batas file maksimal 5MB
});

// --- DEFINISI ROUTE ---

// 1. Ambil Semua Bunga (Public)
// Method: GET /api/flowers
router.get("/", FlowerController.getAll);

// 2. Ambil Bunga Berdasarkan Kategori (Public)
// Method: GET /api/flowers/category/Bunga Hias
// Catatan: Saya ubah :id menjadi :category agar sesuai dengan controller
router.get("/category/:category", FlowerController.getByCategory);

// 3. Login Admin (Cek Password)
// Method: POST /api/flowers/login
router.post("/login", FlowerController.login);

// 4. Tambah Bunga Baru (Private - Butuh Auth Header)
// Method: POST /api/flowers
// Middleware upload.single('image') akan menangkap file dari form dengan name="image"
router.post("/", upload.single('image'), FlowerController.create);

export default router;