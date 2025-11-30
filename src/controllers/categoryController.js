import { CategoryModel } from "../models/categoryModel.js";

export const CategoryController = {
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  async create(req, res) {
    try {
        const { name } = req.body;
        const category = await CategoryModel.create(name);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  }
};