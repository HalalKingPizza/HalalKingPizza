// // // src/services/foodItemsService.js
// import { supabase } from "./supabase-client";

// const TABLE = "FoodItems"; 

// // import { supabase } from "./supabase-client";

// // const TABLE = "FoodItems"; // Change ONLY if your table name is different

// export async function fetchFoodItems() {
//   console.log("🔥 fetchFoodItems START");

//   const { data, error } = await supabase
//     .from(TABLE)
//     .select("*");

//   console.log("🔥 Supabase response:", { data, error });

//   if (error) throw error;

//   return data ?? [];
// }

// export async function createFoodItem(newItem) {
//   // newItem example:
//   // { food_name, price, food_photo, is_available }
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

const TABLE = "FoodItems";

// export async function fetchFoodItems() {
//   const { data, error } = await supabase.from(TABLE).select("*");
//   if (error) throw error;
//   return data ?? [];
// }

// import { supabase } from "./supabase-client";

// const TABLE = "FoodItems";

export async function fetchFoodItems() {
  console.log("🔥 fetchFoodItems START");

  const startedAt = Date.now();

  const req = supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  // If this hangs, we’ll know in 8 seconds
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("⏱️ Supabase request timed out (blocked/hanging)")), 8000)
  );

  try {
    const { data, error } = await Promise.race([req, timeout]);
    console.log("✅ fetchFoodItems DONE in", Date.now() - startedAt, "ms");
    console.log("✅ data:", data);
    console.log("✅ error:", error);

    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.log("❌ fetchFoodItems FAILED:", e);
    throw e;
  }
}


export async function createFoodItem(newItem) {
  const { data, error } = await supabase.from(TABLE).insert([newItem]).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateFoodItem(id, updates) {
  const { data, error } = await supabase.from(TABLE).update(updates).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteFoodItem(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
}
