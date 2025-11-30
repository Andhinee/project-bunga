// src/controllers/flowerController.js
import { FlowerModel } from "../models/flowerModel.js";
import { supabase } from "../config/supabaseClient.js"; 
import dotenv from "dotenv";

dotenv.config();

export const FlowerController = {

  // 1. GET ALL
  async getAll(req, res) {
    try {
      const flowers = await FlowerModel.getAll();
      res.json(flowers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }, // <--- JANGAN LUPA KOMA INI

  // 2. GET BY CATEGORY
  async getByCategory(req, res) {
    try {
      const flowers = await FlowerModel.getByCategory(req.params.category);
      res.json(flowers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }, // <--- JANGAN LUPA KOMA INI

  // 3. LOGIN CHECK
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const serverUser = process.env.ADMIN_USERNAME;
      const serverPass = process.env.ADMIN_PASSWORD;

      if (!serverUser || !serverPass) {
        return res.status(500).json({ error: "Server config error." });
      }

      if (username === serverUser && password === serverPass) {
        return res.status(200).json({ message: "Login Berhasil", token: "valid" });
      } else {
        return res.status(401).json({ error: "Username atau Password Salah!" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }, // <--- JANGAN LUPA KOMA INI

  // 4. CREATE (UPLOAD)
  async create(req, res) {
    try {
      // A. Cek Login
      const clientUser = req.headers['x-admin-username'];
      const clientPass = req.headers['x-admin-password'];
      const serverUser = process.env.ADMIN_USERNAME;
      const serverPass = process.env.ADMIN_PASSWORD;

      if (!serverUser || !serverPass) {
        return res.status(500).json({ error: "Server config error" });
      }

      if (clientUser !== serverUser || clientPass !== serverPass) {
        return res.status(401).json({ error: "Login Salah!" });
      }

      // B. Cek File (Wajib Ada)
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "File Gambar Wajib Diupload!" });
      }

      // C. Upload ke Supabase
      // Pastikan nama bucket 'flower-images' (Huruf Kecil) sudah dibuat di Supabase
      const bucketName = 'flower-images'; 
      const fileName = `flower-${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype
        });

      if (uploadError) {
        throw new Error(`Upload Gagal: ${uploadError.message}`);
      }

      // D. Ambil Link Gambar
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // E. Simpan ke Database
      const newFlower = await FlowerModel.create({
        ...req.body,
        image_url: urlData.publicUrl
      });
      
      res.status(201).json(newFlower);

    } catch (err) {
      console.error("Error:", err);
      res.status(400).json({ error: err.message });
    }
  } 
  // <--- TIDAK PERLU KOMA DI FUNGSI TERAKHIR
};