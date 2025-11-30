import { supabase } from "../config/supabaseClient.js";

export const FlowerModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("flowers")
      .select(`
        *,
        categories ( id, name )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("flowers")
      .insert([payload])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getByCategory(categoryId) {
      const { data, error } = await supabase
        .from("flowers")
        .select("*")
        .eq("category_id", categoryId);
      if (error) throw error;
      return data;
  }
};