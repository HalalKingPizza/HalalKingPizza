// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import {  fetchFoodItems } from "../../services/food-items";
import { signOut } from "../../services/auth-service";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  // Simple form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  async function load() {
    const data = await fetchFoodItems();
    setItems(data);
  }

  useEffect(() => {
    (async () => {
      try {
        setError("");
        await load();
      } catch (e) {
        setError(e.message || "Failed to load items");
      }
    })();
  }, []);

//   async function onCreate(e) {
//     e.preventDefault();
//     try {
//       setError("");
//       await createFoodItem({
//         food_name: name,
//         price: Number(price),
//         food_photo: photoUrl || null,
//         is_available: isAvailable,
//       });
//       setName("");
//       setPrice("");
//       setPhotoUrl("");
//       setIsAvailable(true);
//       await load();
//     } catch (e) {
//       setError(e.message || "Create failed");
//     }
//   }

  async function onToggleAvailable(item) {
    try {
      setError("");
      await updateFoodItem(item.id, { is_available: !item.is_available });
      await load();
    } catch (e) {
      setError(e.message || "Update failed");
    }
  }

//   async function onDelete(id) {
//     try {
//       setError("");
//       await deleteFoodItem(id);
//       await load();
//     } catch (e) {
//       setError(e.message || "Delete failed");
//     }
//   }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={signOut}>Sign out</button>
      </div>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <h2>Add Food Item</h2>
      <form onSubmit={onCreate} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price (e.g. 12.99)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Photo URL (for now)" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          Available
        </label>
        <button type="submit">Create</button>
      </form>

      <h2 style={{ marginTop: 24 }}>Items</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <strong>{item.food_name}</strong>
            <div>${Number(item.price).toFixed(2)}</div>
            <div style={{ opacity: 0.7 }}>{item.is_available ? "Available" : "Unavailable"}</div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => onToggleAvailable(item)}>
                Toggle Available
              </button>
              <button onClick={() => onDelete(item.id)} style={{ color: "crimson" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
