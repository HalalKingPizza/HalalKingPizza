// // src/services/foodItemsService.js
// import { supabase } from "./supabase-client";

// const TABLE = "FoodItems"; 

// export async function fetchFoodItems() {
//   const { data, error } = await supabase
//     .from(TABLE)
//     .select("*")
//     .order("created_at", { ascending: false });



//   console.log("FoodItems data:", data);
//   console.log("FoodItems error:", error);

//   if (error) throw error;
//   return data ?? [];
// }


// export async function createFoodItem(newItem) {
//   // newItem example:
//   // { fooditems_name, price, fooditems_photo, is_available }
//   const { data, error } = await supabase.from(TABLE).insert([newItem]).select("*").single();
//   if (error) throw error;
//   return data;
// }

// export async function updateFoodItem(id, updates) {
//   const { data, error } = await supabase
//     .from(TABLE)
//     .update(updates)
//     .eq("id", id)
//     .select("*")
//     .single();

//   if (error) throw error;
//   return data;
// }

// export async function deleteFoodItem(id) {
//   const { error } = await supabase.from(TABLE).delete().eq("id", id);
//   if (error) throw error;
//   return true;
// }


import { supabase } from "./supabase-client";

const TABLE = "FoodItems"; // Change ONLY if your table name is different

export async function fetchFoodItems() {
  console.log("🔥 fetchFoodItems START");

  const { data, error } = await supabase
    .from(TABLE)
    .select("*");

  console.log("🔥 Supabase response:", { data, error });

  if (error) throw error;

  return data ?? [];
}
