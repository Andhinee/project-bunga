// src/controllers/flowerController.js
import { FlowerModel } from "../models/flowerModel.js";
import { supabase } from "../config/supabaseClient.js"; 
import dotenv from "dotenv";

dotenv.config();

export const FlowerController = {
  // 1. GET ALL (Publik - Siapa saja bisa lihat)
  async getAll(req, res) {
    try {
      const flowers = await FlowerModel.getAll();
      res.json(flowers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2. GET BY CATEGORY (Publik)
  async getByCategory(req, res) {
    try {
      // req.params.category diambil dari URL (misal: /api/flowers/category/Hias)
      const flowers = await FlowerModel.getByCategory(req.params.category);
      res.json(flowers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 3. LOGIN CHECK (Endpoint Khusus untuk Form Login)
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      const serverUser = process.env.ADMIN_USERNAME;
      const serverPass = process.env.ADMIN_PASSWORD;

      // Validasi: Pastikan .env sudah diset
      if (!serverUser || !serverPass) {
        return res.status(500).json({ error: "Server Error: Admin credentials not set." });
      }

      // Cek apakah username & password cocok
      if (username === serverUser && password === serverPass) {
        return res.status(200).json({ message: "Login Berhasil", token: "valid" });
      } else {
        return res.status(401).json({ error: "Username atau Password Salah!" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 4. CREATE (Private - Butuh Username & Password Admin di Header)
  async create(req, res) {
    try {
      // --- LANGKAH 1: CEK OTENTIKASI ---
      const clientUser = req.headers['x-admin-username'];
      const clientPass = req.headers['x-admin-password'];
      const serverUser = process.env.ADMIN_USERNAME;
      const serverPass = process.env.ADMIN_PASSWORD;

      // Jika password di .env belum diset atau password dari klien salah
      if (!serverUser || !serverPass) {
        return res.status(500).json({ error: "Konfigurasi Server Error (Environment Variables)" });
      }

      if (clientUser !== serverUser || clientPass !== serverPass) {
        return res.status(401).json({ 
            error: "Akses Ditolak: Username atau Password Admin Salah!" 
        });
      }

      // --- LANGKAH 2: UPLOAD GAMBAR KE SUPABASE STORAGE ---
      const file = req.file;
      const body = req.body;
      let publicUrl = null;

      // Jika ada file yang diupload
      if (file) {
        // Buat nama file unik (pake timestamp biar gak bentrok)
        const fileName = `flower-${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

        // Upload ke Bucket 'flower-images'
        const { error: uploadError } = await supabase.storage
          .from('flower-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype
          });

        if (uploadError) throw new Error(`Gagal Upload Gambar: ${uploadError.message}`);

        // Ambil URL Publik gambar
        const { data: urlData } = supabase.storage
          .from('flower-images')
          .getPublicUrl(fileName);
          
        publicUrl = urlData.publicUrl;
      }

      // --- LANGKAH 3: SIMPAN DATA KE DATABASE ---
      const flowerData = {
        ...body,           
        image_url: publicUrl 
      };

      const newFlower = await FlowerModel.create(flowerData);
      
      res.status(201).json(newFlower);

    } catch (err) {
      console.error("Error di Controller:", err);
      res.status(400).json({ error: err.message });
    }
  }
};