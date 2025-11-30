import { supabase } from "../config/supabaseClient.js";

export const CategoryModel = {
  async getAll() {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw error;
    return data;
  },
  
  async create(name) {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();
    if (error) throw error;
    return data;
  }
};