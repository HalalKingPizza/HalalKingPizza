// // src/pages/admin/AdminDashboard.jsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   fetchFoodItems,
//   createFoodItem,
//   updateFoodItem,
//   deleteFoodItem,
// } from "../../services/food-items";
// import { signOut } from "../../services/auth-service";
// import { uploadFoodImage } from "../../services/storage-service";
// import { useAuth } from "../../context/authContext";

// const CATEGORY_OPTIONS = [
//   "Popular",
//   "Happy Tizers",
//   "Oven Baked Sub",
//   "Stramboli",
//   "Calzones",
//   'Pizza by Pie Personal (10")',
//   'Medium Pizza (14")',
//   'Large Pizza (16")',
//   "Pizza By Slice",
//   "Halal King Combo Special",
//   "Halal King and Gyro Special",
//   "Dessert",
//   "Drinks",
// ];

// const CACHE_KEY = "hkp_admin_items_v1";

// export default function AdminDashboard() {
//   const { user } = useAuth();

//   const [items, setItems] = useState([]);
//   const [error, setError] = useState("");

//   // busy = for actions like create/toggle/delete (NOT for initial loading)
//   const [busy, setBusy] = useState(false);

//   // shows a small “Refreshing…” label only
//   const [refreshing, setRefreshing] = useState(false);

//   const [activeView, setActiveView] = useState("inventory");
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   // form
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [category, setCategory] = useState("Popular");

//   const mountedRef = useRef(true);

//   const previewUrl = useMemo(() => {
//     if (!photoFile) return "";
//     return URL.createObjectURL(photoFile);
//   }, [photoFile]);

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   // ✅ Hydrate from cache immediately (so you never stare at a blank/loading screen)
//   useEffect(() => {
//     try {
//       const raw = sessionStorage.getItem(CACHE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         if (Array.isArray(parsed)) setItems(parsed);
//       }
//     } catch {
//       // ignore cache errors
//     }
//   }, []);

//   // ✅ Safe load with timeout + background refresh
//   async function load({ silent = false } = {}) {
//     let timerId = null;

//     try {
//       if (!silent) setError("");
//       setRefreshing(true);

//       // timeout wrapper (prevents “infinite loading”)
//       const timeoutMs = 12000;
//       const timeoutPromise = new Promise((_, reject) => {
//         timerId = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
//       });

//       const data = await Promise.race([fetchFoodItems(), timeoutPromise]);

//       if (!mountedRef.current) return;

//       const next = data ?? [];
//       setItems(next);

//       // cache it
//       try {
//         sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
//       } catch {
//         // ignore caching failures
//       }
//     } catch (e) {
//       if (!mountedRef.current) return;

//       // IMPORTANT: don’t wipe items on error — keep showing cached/old list
//       setError(e?.message || "Failed to load items");
//     } finally {
//       if (timerId) clearTimeout(timerId);
//       if (mountedRef.current) setRefreshing(false);
//     }
//   }

//   useEffect(() => {
//     mountedRef.current = true;

//     // load in background on mount (won’t blank UI)
//     load({ silent: true });

//     return () => {
//       mountedRef.current = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function onCreate(e) {
//     e.preventDefault();
//     if (!name.trim()) {
//       setError("Name is required.");
//       return;
//     }

//     try {
//       setBusy(true);
//       setError("");

//       let uploadedUrl = null;
//       if (photoFile) uploadedUrl = await uploadFoodImage(photoFile);

//       await createFoodItem({
//         food_name: name.trim(),
//         price: price === "" ? null : Number(price),
//         food_photos: uploadedUrl,
//         is_available: isAvailable,
//         category,
//       });

//       // reset form
//       setName("");
//       setPrice("");
//       setIsAvailable(true);
//       setPhotoFile(null);
//       setCategory("Popular");
//       setShowCreateModal(false);

//       // refresh list (silent)
//       await load({ silent: true });
//     } catch (e) {
//       setError(e?.message || "Create failed");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function onToggleAvailable(item) {
//     try {
//       setBusy(true);
//       setError("");
//       await updateFoodItem(item.id, { is_available: !item.is_available });

//       // optimistic UI (instant)
//       setItems((prev) =>
//         prev.map((x) => (x.id === item.id ? { ...x, is_available: !x.is_available } : x))
//       );

//       // background sync (keeps consistent with DB)
//       load({ silent: true });
//     } catch (e) {
//       setError(e?.message || "Update failed");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function onDelete(id) {
//     if (!window.confirm("Delete this item?")) return;

//     try {
//       setBusy(true);
//       setError("");

//       // optimistic UI
//       setItems((prev) => prev.filter((x) => x.id !== id));

//       await deleteFoodItem(id);

//       // background sync
//       load({ silent: true });
//     } catch (e) {
//       setError(e?.message || "Delete failed");
//       // if delete fails, reload from server to restore
//       load({ silent: true });
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function onLogout() {
//     try {
//       setBusy(true);
//       await signOut();
//     } finally {
//       setBusy(false);
//     }
//   }

//   const adminName = user?.email?.split("@")[0] || "Admin";

//   return (
//     <div className="dashboardWrapper">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div>
//           <div className="panelTitle">ADMIN PANEL</div>
//           <div className="brand">Halal King Pizza</div>

//           <button className="sideBtn" onClick={() => setShowCreateModal(true)} disabled={busy}>
//             + Create Item
//           </button>

//           <button
//             className={`sideBtn ${activeView === "inventory" ? "active" : ""}`}
//             onClick={() => setActiveView("inventory")}
//             disabled={busy}
//           >
//             📦 View Inventory
//           </button>

//           <button className="sideBtn danger" onClick={onLogout} disabled={busy}>
//             🚪 Sign out
//           </button>
//         </div>

//         <div className="profileCard">
//           <div className="avatar">{adminName.charAt(0).toUpperCase()}</div>
//           <div>
//             <div className="profileName">{adminName}</div>
//             <div className="profileRole">Admin</div>
//           </div>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="mainContent">
//         <div className="welcomeBlock">
//           <h1>Hi {adminName}</h1>
//           <p>What would you like to see?</p>

//           <div className="metaRow">
//             {refreshing ? <span className="refreshPill">Refreshing…</span> : null}
//             <button className="ghostBtn" onClick={() => load({ silent: true })} disabled={busy}>
//               ↻ Refresh
//             </button>
//           </div>
//         </div>

//         {error ? <p style={{ color: "crimson", marginTop: 10 }}>{error}</p> : null}

//         {activeView === "inventory" && (
//           <div className="inventoryCard">
//             <div className="inventoryHeader">
//               <div>
//                 <h2>Inventory</h2>
//                 <span>Manage dishes, availability, and prices.</span>
//               </div>

//               <button className="newItemBtn" onClick={() => setShowCreateModal(true)} disabled={busy}>
//                 + New Item
//               </button>
//             </div>

//             <div className="inventoryList">
//               {items.length === 0 ? (
//                 <div className="emptyState">
//                   No items yet. Click <b>New Item</b> to add one.
//                 </div>
//               ) : (
//                 items.map((item) => (
//                   <div key={item.id} className="inventoryRow">
//                     <img src={item.food_photos || ""} alt="" className="itemImage" />

//                     <div className="itemName">
//                       {item.food_name}
//                       <div className="itemCategory">{item.category || "Popular"}</div>
//                     </div>

//                     <div className="itemPrice">${Number(item.price || 0).toFixed(2)}</div>

//                     <div className="itemStatus">{item.is_available ? "Available" : "Unavailable"}</div>

//                     <div className="itemActions">
//                       <button className="toggleBtn" onClick={() => onToggleAvailable(item)} disabled={busy}>
//                         {item.is_available ? "Mark Unavailable" : "Mark Available"}
//                       </button>

//                       <button className="deleteBtn" onClick={() => onDelete(item.id)} disabled={busy}>
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </main>

//       {/* CREATE MODAL */}
//       {showCreateModal && (
//         <div className="modalOverlay" onClick={() => setShowCreateModal(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modalHeader">
//               <h3>Create Food Item</h3>
//               <button onClick={() => setShowCreateModal(false)} disabled={busy}>
//                 Close
//               </button>
//             </div>

//             <form onSubmit={onCreate} className="modalBody">
//               <input
//                 className="field"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 disabled={busy}
//               />

//               <input
//                 className="field"
//                 placeholder="Price (e.g. 12.99)"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 disabled={busy}
//               />

//               <select className="field" value={category} onChange={(e) => setCategory(e.target.value)} disabled={busy}>
//                 {CATEGORY_OPTIONS.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="file"
//                 className="field"
//                 accept="image/*"
//                 onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//                 disabled={busy}
//               />

//               <label className="checkboxRow">
//                 <input
//                   type="checkbox"
//                   checked={isAvailable}
//                   onChange={(e) => setIsAvailable(e.target.checked)}
//                   disabled={busy}
//                 />
//                 Available
//               </label>

//               <button className="createBtn" disabled={busy}>
//                 {busy ? "Creating..." : "Create"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* STYLES */}
//       <style>{`
//         .dashboardWrapper{
//           display:flex;
//           min-height:100vh;
//           background:#f5f5f5;
//           color:#111;
//           font-family:sans-serif;
//         }

//         .sidebar{
//           width:260px;
//           background:#ffffff;
//           padding:28px 20px;
//           display:flex;
//           flex-direction:column;
//           justify-content:space-between;
//           border-right:1px solid #e5e5e5;
//         }

//         .panelTitle{
//           font-size:12px;
//           opacity:0.6;
//           letter-spacing:1px;
//         }

//         .brand{
//           font-size:18px;
//           font-weight:700;
//           margin-bottom:20px;
//         }

//         .sideBtn{
//           width:100%;
//           padding:10px;
//           border-radius:10px;
//           margin-bottom:10px;
//           border:1px solid #e6e6e6;
//           background:#f1f1f1;
//           color:#111;
//           cursor:pointer;
//         }

//         .sideBtn.active{
//           background:#111;
//           color:white;
//           border-color:#111;
//         }

//         .sideBtn.danger{
//           background:#fff0f0;
//           color:#cc0000;
//           border-color:#ffd1d1;
//         }

//         .profileCard{
//           display:flex;
//           align-items:center;
//           gap:10px;
//           margin-top:20px;
//           padding-top:14px;
//           border-top:1px solid #eee;
//         }

//         .avatar{
//           width:40px;
//           height:40px;
//           border-radius:50%;
//           background:#111;
//           color:white;
//           display:flex;
//           align-items:center;
//           justify-content:center;
//           font-weight:bold;
//         }

//         .profileName{ font-weight:700; }
//         .profileRole{ font-size:12px; color:#666; }

//         .mainContent{
//           flex:1;
//           padding:40px 60px;
//           max-width:1100px;
//         }

//         .welcomeBlock h1{
//           font-size:52px;
//           margin:0;
//           letter-spacing:-0.5px;
//         }

//         .welcomeBlock p{
//           color:#666;
//           margin-top:8px;
//         }

//         .metaRow{
//           margin-top:14px;
//           display:flex;
//           align-items:center;
//           gap:10px;
//         }

//         .refreshPill{
//           font-size:12px;
//           padding:6px 10px;
//           border-radius:999px;
//           border:1px solid #e6e6e6;
//           background:#fff;
//           color:#333;
//         }

//         .ghostBtn{
//           font-size:12px;
//           padding:6px 10px;
//           border-radius:999px;
//           border:1px solid #e6e6e6;
//           background:#fff;
//           cursor:pointer;
//         }

//         .inventoryCard{
//           margin-top:30px;
//           background:white;
//           border-radius:16px;
//           padding:24px;
//           max-width:900px;
//           box-shadow:0 10px 30px rgba(0,0,0,0.08);
//           border:1px solid #eee;
//         }

//         .inventoryHeader{
//           display:flex;
//           justify-content:space-between;
//           align-items:center;
//           margin-bottom:20px;
//         }

//         .inventoryHeader span{
//           color:#666;
//           font-size:14px;
//         }

//         .newItemBtn{
//           padding:10px 14px;
//           border-radius:10px;
//           border:1px solid #111;
//           background:#111;
//           color:white;
//           cursor:pointer;
//           font-weight:800;
//         }

//         .emptyState{
//           padding:18px 0;
//           color:#666;
//         }

//         .inventoryRow{
//           display:grid;
//           grid-template-columns:70px 1fr 100px 120px 220px;
//           align-items:center;
//           gap:15px;
//           padding:12px 0;
//           border-top:1px solid #eee;
//           font-size:14px;
//         }

//         .itemImage{
//           width:60px;
//           height:60px;
//           object-fit:cover;
//           border-radius:10px;
//           background:#f3f3f3;
//           border:1px solid #eee;
//         }

//         .itemName{ font-weight:800; }
//         .itemCategory{
//           margin-top:4px;
//           font-size:12px;
//           color:#777;
//           font-weight:500;
//         }

//         .itemPrice{ font-weight:700; }
//         .itemStatus{ color:#555; font-weight:700; }

//         .itemActions{
//           display:flex;
//           gap:8px;
//           justify-content:flex-end;
//         }

//         .toggleBtn{
//           padding:8px 10px;
//           border-radius:10px;
//           border:1px solid #d9f2e6;
//           background:#0a7;
//           color:white;
//           font-size:13px;
//           cursor:pointer;
//           font-weight:800;
//         }

//         .deleteBtn{
//           padding:8px 10px;
//           border-radius:10px;
//           border:1px solid #ffb3b3;
//           background:#fff;
//           color:#cc0000;
//           font-size:13px;
//           cursor:pointer;
//           font-weight:800;
//         }

//         .modalOverlay{
//           position:fixed;
//           inset:0;
//           background:rgba(0,0,0,0.35);
//           display:flex;
//           align-items:center;
//           justify-content:center;
//           padding:16px;
//         }

//         .modal{
//           width:420px;
//           max-width:100%;
//           background:#ffffff;
//           color:#111;
//           border-radius:16px;
//           padding:20px;
//           border:1px solid #eee;
//           box-shadow:0 18px 50px rgba(0,0,0,0.18);
//         }

//         .modalHeader{
//           display:flex;
//           justify-content:space-between;
//           margin-bottom:16px;
//           gap:12px;
//           align-items:center;
//         }

//         .modalHeader button{
//           padding:8px 12px;
//           border-radius:10px;
//           border:1px solid #e6e6e6;
//           background:#f3f3f3;
//           color:#111;
//           cursor:pointer;
//           font-weight:800;
//         }

//         .modalBody{
//           display:grid;
//           gap:10px;
//         }

//         .field{
//           width:100%;
//           box-sizing:border-box;
//           padding:10px;
//           border-radius:10px;
//           border:1px solid #e6e6e6;
//           background:#fff;
//           color:#111;
//           outline:none;
//         }

//         .checkboxRow{
//           display:flex;
//           gap:8px;
//           align-items:center;
//           color:#333;
//           font-weight:700;
//         }

//         .createBtn{
//           margin-top:10px;
//           padding:10px;
//           border-radius:10px;
//           border:none;
//           background:#0a7;
//           color:white;
//           cursor:pointer;
//           font-weight:900;
//         }
//       `}</style>
//     </div>
//   );
// }




// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import {
  fetchFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../../services/food-items";
import { signOut } from "../../services/auth-service";
import { uploadFoodImage } from "../../services/storage-service";
import { useAuth } from "../../context/authContext";

const CATEGORY_OPTIONS = [
  "All",
  "Popular",
  "Happy Tizers",
  "Oven Baked Sub",
  "Stramboli",
  "Calzones",
  'Pizza by Pie Personal (10")',
  'Medium Pizza (14")',
  'Large Pizza (16")',
  "Pizza By Slice",
  "Halal King Combo Special",
  "Halal King and Gyro Special",
  "Dessert",
  "Drinks",
];

function safeCategory(item) {
  return (item?.category || "Popular").trim() || "Popular";
}

function effectiveOrder(item, fallback) {
  const v = item?.sort_order;
  return Number.isFinite(v) ? v : fallback;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeView, setActiveView] = useState("inventory");

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter by category
  const [viewCategory, setViewCategory] = useState("All");

  // CREATE form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Popular");
  const [isAvailable, setIsAvailable] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);

  // EDIT modal + state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("Popular");
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editPhotoFile, setEditPhotoFile] = useState(null);

  const createPreviewUrl = useMemo(() => {
    if (!photoFile) return "";
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  const editPreviewUrl = useMemo(() => {
    if (!editPhotoFile) return "";
    return URL.createObjectURL(editPhotoFile);
  }, [editPhotoFile]);

  useEffect(() => {
    return () => {
      if (createPreviewUrl) URL.revokeObjectURL(createPreviewUrl);
    };
  }, [createPreviewUrl]);

  useEffect(() => {
    return () => {
      if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    };
  }, [editPreviewUrl]);

  async function load() {
    const data = await fetchFoodItems();
    setItems(data ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        setError("");
        await load();
      } catch (e) {
        setError(e?.message || "Failed to load items");
      }
    })();
  }, []);

  const adminName = user?.email?.split("@")[0] || "Admin";

  // Filter items by category selector, then sort by sort_order
  const visibleItems = useMemo(() => {
    const base =
      viewCategory === "All"
        ? items
        : (items ?? []).filter((i) => safeCategory(i) === viewCategory);

    // Sort by sort_order if present, otherwise stable fallback
    return (base ?? [])
      .map((i, idx) => ({ ...i, __fallbackOrder: (idx + 1) * 10 }))
      .sort((a, b) => {
        const ao = effectiveOrder(a, a.__fallbackOrder);
        const bo = effectiveOrder(b, b.__fallbackOrder);
        if (ao !== bo) return ao - bo;
        return String(a.food_name || "").localeCompare(String(b.food_name || ""));
      });
  }, [items, viewCategory]);

  async function onCreate(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setBusy(true);
      setError("");

      let uploadedUrl = null;
      if (photoFile) uploadedUrl = await uploadFoodImage(photoFile);

      await createFoodItem({
        food_name: name.trim(),
        price: price === "" ? null : Number(price),
        description: description.trim() ? description.trim() : null,
        category,
        food_photos: uploadedUrl,
        is_available: isAvailable,
        // sort_order optional; DB default or null is okay for now
      });

      setName("");
      setPrice("");
      setDescription("");
      setCategory("Popular");
      setIsAvailable(true);
      setPhotoFile(null);

      setShowCreateModal(false);
      await load();
    } catch (e) {
      setError(e?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  function openEdit(item) {
    setError("");
    setEditingItem(item);

    setEditName(item.food_name ?? "");
    setEditPrice(item.price != null ? String(item.price) : "");
    setEditDescription(item.description ?? "");
    setEditCategory(safeCategory(item));
    setEditIsAvailable(item.is_available !== false);
    setEditPhotoFile(null);

    setShowEditModal(true);
  }

  async function onUpdate(e) {
    e.preventDefault();
    if (!editingItem) return;
    if (!editName.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setBusy(true);
      setError("");

      let nextPhotoUrl = editingItem.food_photos ?? null;
      if (editPhotoFile) {
        nextPhotoUrl = await uploadFoodImage(editPhotoFile);
      }

      await updateFoodItem(editingItem.id, {
        food_name: editName.trim(),
        price: editPrice === "" ? null : Number(editPrice),
        description: editDescription.trim() ? editDescription.trim() : null,
        category: editCategory,
        is_available: editIsAvailable,
        food_photos: nextPhotoUrl,
      });

      setShowEditModal(false);
      setEditingItem(null);
      await load();
    } catch (e) {
      setError(e?.message || "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function onToggleAvailable(item) {
    try {
      setBusy(true);
      setError("");
      await updateFoodItem(item.id, { is_available: !item.is_available });
      await load();
    } catch (e) {
      setError(e?.message || "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this item?")) return;

    try {
      setBusy(true);
      setError("");
      await deleteFoodItem(id);
      await load();
    } catch (e) {
      setError(e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    try {
      setBusy(true);
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  // ✅ NEW: Move item up/down (swap sort_order values)
  async function swapOrder(a, b, aFallback, bFallback) {
    const aOrder = effectiveOrder(a, aFallback);
    const bOrder = effectiveOrder(b, bFallback);

    // If they’re equal (rare), force distinct orders
    const nextA = bOrder;
    const nextB = aOrder === bOrder ? aOrder + 10 : aOrder;

    await Promise.all([
      updateFoodItem(a.id, { sort_order: nextA }),
      updateFoodItem(b.id, { sort_order: nextB }),
    ]);
  }

  async function moveUp(index) {
    if (index <= 0) return;
    const list = visibleItems;
    const a = list[index];
    const b = list[index - 1];

    try {
      setBusy(true);
      setError("");
      await swapOrder(a, b, (index + 1) * 10, index * 10);
      await load();
    } catch (e) {
      setError(e?.message || "Reorder failed");
    } finally {
      setBusy(false);
    }
  }

  async function moveDown(index) {
    const list = visibleItems;
    if (index >= list.length - 1) return;
    const a = list[index];
    const b = list[index + 1];

    try {
      setBusy(true);
      setError("");
      await swapOrder(a, b, (index + 1) * 10, (index + 2) * 10);
      await load();
    } catch (e) {
      setError(e?.message || "Reorder failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dashboardWrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="panelTitle">ADMIN PANEL</div>
          <div className="brand">Halal King Pizza</div>

          <button
            className="sideBtn"
            onClick={() => setShowCreateModal(true)}
            disabled={busy}
          >
            + Create Item
          </button>

          <button
            className={`sideBtn ${activeView === "inventory" ? "active" : ""}`}
            onClick={() => setActiveView("inventory")}
            disabled={busy}
          >
            📦 View Inventory
          </button>

          <button className="sideBtn danger" onClick={onLogout} disabled={busy}>
            🚪 Sign out
          </button>
        </div>

        <div className="profileCard">
          <div className="avatar" aria-hidden="true">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="profileText">
            <div className="profileName">{adminName}</div>
            <div className="profileRole">Admin</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="mainContent">
        <div className="welcomeBlock">
          <h1>Hi {adminName}</h1>
          <p>What would you like to see?</p>
        </div>

        {error ? <p style={{ color: "crimson", marginTop: 10 }}>{error}</p> : null}

        {activeView === "inventory" && (
          <div className="inventoryCard">
            <div className="inventoryHeader">
              <div>
                <h2>Inventory</h2>
                <span>Manage dishes, availability, and prices.</span>
              </div>

              <div className="inventoryHeaderRight">
                <select
                  className="filterSelect"
                  value={viewCategory}
                  onChange={(e) => setViewCategory(e.target.value)}
                  disabled={busy}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  className="newItemBtn"
                  onClick={() => setShowCreateModal(true)}
                  disabled={busy}
                >
                  + New Item
                </button>
              </div>
            </div>

            <div className="inventoryList">
              {visibleItems.map((item, idx) => (
                <div key={item.id} className="inventoryRow">
                  <img
                    src={item.food_photos || ""}
                    alt=""
                    className="itemImage"
                  />

                  <div className="itemName">
                    <div className="itemTitle">{item.food_name}</div>
                    <div className="itemMeta">
                      <span className="itemCategory">{safeCategory(item)}</span>
                    </div>
                  </div>

                  {/* ✅ price column: never overlaps */}
                  <div className="itemPrice">
                    ${Number(item.price || 0).toFixed(2)}
                  </div>

                  <div className="itemStatus">
                    {item.is_available ? "Available" : "Unavailable"}
                  </div>

                  <div className="itemActions">
                    {/* ✅ NEW: reorder controls */}
                    <div className="reorderBox">
                      <button
                        className="reorderBtn"
                        onClick={() => moveUp(idx)}
                        disabled={busy || idx === 0}
                        title="Move up"
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        className="reorderBtn"
                        onClick={() => moveDown(idx)}
                        disabled={busy || idx === visibleItems.length - 1}
                        title="Move down"
                        type="button"
                      >
                        ↓
                      </button>
                    </div>

                    <button
                      className="editBtn"
                      onClick={() => openEdit(item)}
                      disabled={busy}
                      type="button"
                    >
                      Edit
                    </button>

                    <button
                      className="toggleBtn"
                      onClick={() => onToggleAvailable(item)}
                      disabled={busy}
                      type="button"
                    >
                      {item.is_available ? "Mark Unavailable" : "Mark Available"}
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => onDelete(item.id)}
                      disabled={busy}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {!visibleItems.length ? (
                <div className="emptyState">
                  No items in <strong>{viewCategory}</strong>.
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="modalOverlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Create Food Item</h3>
              <button
                type="button"
                className="closeBtn"
                onClick={() => setShowCreateModal(false)}
                disabled={busy}
              >
                Close
              </button>
            </div>

            <form onSubmit={onCreate} className="modalBody">
              <input
                className="field"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={busy}
              />

              <input
                className="field"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={busy}
              />

              <textarea
                className="field textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={busy}
                rows={3}
              />

              <select
                className="field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={busy}
              >
                {CATEGORY_OPTIONS.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="file"
                className="field file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                disabled={busy}
              />

              {createPreviewUrl ? (
                <img className="previewImg" src={createPreviewUrl} alt="preview" />
              ) : null}

              <label className="checkboxRow">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  disabled={busy}
                />
                Available
              </label>

              <button className="createBtn" disabled={busy}>
                {busy ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingItem && (
        <div className="modalOverlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Edit Food Item</h3>
              <button
                type="button"
                className="closeBtn"
                onClick={() => setShowEditModal(false)}
                disabled={busy}
              >
                Close
              </button>
            </div>

            <form onSubmit={onUpdate} className="modalBody">
              <input
                className="field"
                placeholder="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={busy}
              />

              <input
                className="field"
                placeholder="Price"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                disabled={busy}
              />

              <textarea
                className="field textarea"
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={busy}
                rows={3}
              />

              <select
                className="field"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                disabled={busy}
              >
                {CATEGORY_OPTIONS.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="file"
                className="field file"
                accept="image/*"
                onChange={(e) => setEditPhotoFile(e.target.files?.[0] ?? null)}
                disabled={busy}
              />

              {editPreviewUrl ? (
                <img className="previewImg" src={editPreviewUrl} alt="preview" />
              ) : null}

              <label className="checkboxRow">
                <input
                  type="checkbox"
                  checked={editIsAvailable}
                  onChange={(e) => setEditIsAvailable(e.target.checked)}
                  disabled={busy}
                />
                Available
              </label>

              <button className="createBtn" disabled={busy}>
                {busy ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboardWrapper{
          display:flex;
          min-height:100vh;
          background:#ffffff;
          color:#111;
          font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        }

        .sidebar{
          width:260px;
          background:#f7f7f8;
          padding:28px 20px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          border-right:1px solid rgba(0,0,0,0.08);
        }

        .panelTitle{
          font-size:12px;
          opacity:0.65;
          letter-spacing:1px;
        }

        .brand{
          font-size:18px;
          font-weight:700;
          margin-bottom:20px;
        }

        .sideBtn{
          width:100%;
          padding:10px;
          border-radius:10px;
          margin-bottom:10px;
          border:1px solid rgba(0,0,0,0.08);
          background:#fff;
          color:#111;
          cursor:pointer;
        }

        .sideBtn.active{
          background:#111;
          color:#fff;
          border-color:#111;
        }

        .sideBtn.danger{
          background:#fff;
          color:#b42318;
          border:1px solid rgba(180,35,24,0.25);
        }

        .profileCard{
          display:flex;
          align-items:center;
          gap:12px;
          padding-top:14px;
          border-top:1px solid rgba(0,0,0,0.08);
        }

        .avatar{
          width:44px;
          height:44px;
          border-radius:999px;
          background:#111;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:800;
          flex:0 0 auto;
        }

        .profileText{ min-width:0; }
        .profileName{ font-weight:700; line-height:1.1; }
        .profileRole{ font-size:12px; opacity:0.65; margin-top:2px; }

        .mainContent{
          flex:1;
          padding:40px 60px;
          max-width:1100px;
        }

        .welcomeBlock h1{
          font-size:48px;
          margin:0;
          letter-spacing:-0.02em;
        }

        .welcomeBlock p{
          opacity:0.7;
          margin-top:8px;
        }

        .inventoryCard{
          margin-top:30px;
          background:#ffffff;
          border-radius:16px;
          padding:20px;
          max-width:980px;
          border:1px solid rgba(0,0,0,0.08);
          box-shadow:0 10px 30px rgba(0,0,0,0.06);
        }

        .inventoryHeader{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:18px;
          gap:12px;
        }

        .inventoryHeader h2{ margin:0; }
        .inventoryHeader span{ opacity:0.65; font-size:14px; }

        .inventoryHeaderRight{
          display:flex;
          gap:10px;
          align-items:center;
        }

        .filterSelect{
          padding:8px 10px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.10);
          background:#fff;
          color:#111;
          cursor:pointer;
        }

        .newItemBtn{
          padding:8px 14px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.08);
          background:#111;
          color:#fff;
          cursor:pointer;
          font-weight:700;
        }

        /* ✅ FIX: columns are stable + price never overlaps */
        .inventoryRow{
          display:grid;
          grid-template-columns:70px minmax(220px, 1fr) 120px 130px minmax(320px, 1fr);
          align-items:center;
          gap:14px;
          padding:12px 0;
          border-top:1px solid rgba(0,0,0,0.08);
          font-size:14px;
        }

        .itemImage{
          width:60px;
          height:60px;
          object-fit:cover;
          border-radius:10px;
          background:#eee;
          border:1px solid rgba(0,0,0,0.08);
        }

        .itemName{
          min-width:0;
        }

        .itemTitle{
          font-weight:800;
          line-height:1.15;
          overflow-wrap:anywhere;
        }

        .itemMeta{
          margin-top:6px;
        }

        .itemCategory{
          font-size:12px;
          opacity:0.65;
          font-weight:600;
        }

        .itemPrice{
          font-weight:800;
          white-space:nowrap;
          text-align:left;
        }

        .itemStatus{
          opacity:0.8;
          font-weight:700;
          white-space:nowrap;
        }

        .itemActions{
          display:flex;
          gap:8px;
          justify-content:flex-end;
          flex-wrap:wrap;
          min-width:0;
        }

        .reorderBox{
          display:flex;
          gap:6px;
          align-items:center;
        }

        .reorderBtn{
          width:34px;
          height:34px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.10);
          background:#fff;
          cursor:pointer;
          font-weight:900;
          line-height:1;
        }

        .editBtn{
          padding:6px 10px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.12);
          background:#f4f4f5;
          color:#111;
          font-size:13px;
          cursor:pointer;
          font-weight:700;
          white-space:nowrap;
        }

        .toggleBtn{
          padding:6px 10px;
          border-radius:10px;
          border:1px solid rgba(22,163,74,0.25);
          background:#16a34a;
          color:white;
          font-size:13px;
          cursor:pointer;
          font-weight:800;
          white-space:nowrap;
        }

        .deleteBtn{
          padding:6px 10px;
          border-radius:10px;
          border:1px solid rgba(180,35,24,0.35);
          background:#fff;
          color:#b42318;
          font-size:13px;
          cursor:pointer;
          font-weight:800;
          white-space:nowrap;
        }

        .emptyState{
          padding:14px 0 2px;
          color:#444;
          font-size:14px;
        }

        .modalOverlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.35);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:16px;
          z-index:50;
        }

        .modal{
          width:520px;
          max-width:100%;
          background:#fff;
          border-radius:16px;
          padding:22px;
          border:1px solid rgba(0,0,0,0.10);
          box-shadow:0 20px 60px rgba(0,0,0,0.20);
        }

        .modalHeader{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          margin-bottom:16px;
        }

        .modalHeader h3{
          margin:0;
          font-size:22px;
        }

        .closeBtn{
          padding:8px 12px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.10);
          background:#f4f4f5;
          color:#111;
          cursor:pointer;
          font-weight:700;
        }

        .modalBody{
          display:grid;
          gap:10px;
        }

        .field{
          width:100%;
          box-sizing:border-box;
          padding:10px 12px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.14);
          background:#fff;
          color:#111;
          outline:none;
        }

        .field:focus{ border-color:#111; }
        .field.textarea{ resize:vertical; }
        .field.file{ padding:10px; }

        .previewImg{
          width:100%;
          height:160px;
          object-fit:cover;
          border-radius:12px;
          border:1px solid rgba(0,0,0,0.10);
        }

        .checkboxRow{
          display:flex;
          gap:8px;
          align-items:center;
          font-weight:700;
        }

        .createBtn{
          margin-top:8px;
          padding:11px 12px;
          border-radius:10px;
          border:none;
          background:#111;
          color:white;
          cursor:pointer;
          font-weight:800;
        }

        @media (max-width: 980px){
          .mainContent{ padding:28px 18px; }
          .dashboardWrapper{ flex-direction:column; }
          .sidebar{ width:auto; }

          .inventoryRow{
            grid-template-columns:70px 1fr auto;
            grid-template-areas:
              "img name price"
              "img status actions";
            align-items:start;
          }

          .itemImage{ grid-area: img; }
          .itemName{ grid-area: name; }
          .itemPrice{
            grid-area: price;
            justify-self:end;
            align-self:start;
            white-space:nowrap;
          }
          .itemStatus{ grid-area: status; }
          .itemActions{
            grid-area: actions;
            justify-content:flex-start;
          }
        }
      `}</style>
    </div>
  );
}
