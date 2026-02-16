// src/pages/customer/MenuPage.jsx
import { useEffect, useState } from "react";
import { fetchFoodItems } from "../../services/food-items";

export default function MenuPage() {
      console.log("✅ MenuPage rendered");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

//   useEffect(() => {
//     let ignore = false;

//     (async () => {
//       try {
//         setError("");
//         const data = await fetchFoodItems();
//         if (!ignore) setItems(data);
//       } catch (e) {
//         if (!ignore) setError(e.message || "Failed to load menu");
//       }
//     })();

//     return () => {
//       ignore = true;
//     };
//   }, []);
useEffect(() => {
  console.log("✅ useEffect ran (MenuPage)");

  (async () => {
    try {
      setError("");
      console.log("✅ calling fetchFoodItems...");
      const data = await fetchFoodItems();
      console.log("✅ fetchFoodItems returned:", data);
      setItems(data);
    } catch (e) {
      console.log("❌ fetchFoodItems error:", e);
      setError(e?.message || "Failed to load menu");
    }
  })();
}, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Halal King Pizza Menu</h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            {item.food_photos? (
              <img
                src={item.food_photos}
                alt={item.food_name}
                style={{ width: "100%", height: 450, objectFit: "cover", borderRadius: 10 }}
              />
            ) : null}

            <h3 style={{ marginTop: 10 }}>{item.food_name}</h3>
            <p>${Number(item.price).toFixed(2)}</p>
            <p style={{ opacity: 0.7 }}>{item.is_available ? "Available" : "Unavailable"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
