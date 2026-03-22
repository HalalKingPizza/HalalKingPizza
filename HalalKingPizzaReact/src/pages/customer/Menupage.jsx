import { useEffect, useMemo, useRef, useState } from "react";
import { fetchFoodItems } from "../../services/food-items";

const CATEGORY_ORDER = [
  "Happy Tizers",
  "Oven Baked Sub",
  "Stramboli",
  "Calzones",
  'Pizza by Pie Personal (10")',
  'Medium Pizza (14")',
  'Large Pizza (16")',
  'Pizza By Slice',
  "Halal King Combo Special",
  "Halal King and Gyro Special",
  "Dessert",
  "Drinks",
];

const fallbackImg =
  "https://images.unsplash.com/photo-1601924579440-6f98f261d5ff?auto=format&fit=crop&w=900&q=60";

function cssSafeId(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ✅ Mobile detection
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);
  const [error, setError] = useState("");

  // modal
  const [selectedItem, setSelectedItem] = useState(null);

  // ✅ Mobile UI (NO horizontal scrolling)
  const isMobile = useMediaQuery("(max-width: 860px)");

  // scrollspy refs
  const sectionRefs = useRef({});
  const clickScrollLockRef = useRef(false);
  const clickScrollTimerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await fetchFoodItems();
        setItems(data ?? []);
      } catch (e) {
        setError(e?.message || "Failed to load menu");
      }
    })();
  }, []);

  // Normalize rows from Supabase (category, description, order)
  const normalized = useMemo(() => {
    return (items ?? []).map((i) => {
      const rawCat = (i.category || i.food_category || "").trim();
      const safeCat = rawCat ? rawCat : CATEGORY_ORDER[0];

      const desc = (i.description || i.food_description || "").trim();

      const order =
        i.sort_order ??
        i.display_order ??
        i.position ??
        Number.MAX_SAFE_INTEGER;

      return {
        ...i,
        _category: safeCat,
        _desc: desc,
        _order: Number.isFinite(Number(order))
          ? Number(order)
          : Number.MAX_SAFE_INTEGER,
      };
    });
  }, [items]);

  // Better search: matches name + description + category (token based)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;

    const tokens = q.split(/\s+/).filter(Boolean);

    return normalized.filter((i) => {
      const name = String(i.food_name || "").toLowerCase();
      const desc = String(i._desc || "").toLowerCase();
      const cat = String(i._category || "").toLowerCase();
      const haystack = `${name} ${desc} ${cat}`;
      return tokens.every((t) => haystack.includes(t));
    });
  }, [normalized, query]);

  // Group + sort inside each category
  const grouped = useMemo(() => {
    const map = new Map();
    for (const c of CATEGORY_ORDER) map.set(c, []);

    for (const item of filtered) {
      const c = map.has(item._category) ? item._category : CATEGORY_ORDER[0];
      map.get(c).push(item);
    }

    for (const c of CATEGORY_ORDER) {
      const list = map.get(c) || [];
      list.sort((a, b) => {
        if (a._order !== b._order) return a._order - b._order;
        return String(a.food_name || "").localeCompare(String(b.food_name || ""));
      });
    }

    return map;
  }, [filtered]);

  // When searching: only show categories that have matches
  const categoriesToRender = useMemo(() => {
    const isSearching = query.trim().length > 0;
    if (!isSearching) return CATEGORY_ORDER;
    return CATEGORY_ORDER.filter((c) => (grouped.get(c)?.length ?? 0) > 0);
  }, [grouped, query]);

  // keep activeCategory valid when searching
  useEffect(() => {
    if (!categoriesToRender.length) return;
    if (!categoriesToRender.includes(activeCategory)) {
      setActiveCategory(categoriesToRender[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesToRender.join("|")]);

  function scrollToCategory(cat) {
    setActiveCategory(cat);

    // lock scrollspy briefly so it doesn't fight the smooth scroll
    clickScrollLockRef.current = true;
    if (clickScrollTimerRef.current) clearTimeout(clickScrollTimerRef.current);
    clickScrollTimerRef.current = setTimeout(() => {
      clickScrollLockRef.current = false;
    }, 700);

    const el = sectionRefs.current?.[cat];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ✅ Scrollspy (reliable): based on scroll position + section refs
  useEffect(() => {
    const list = categoriesToRender;
    if (!list.length) return;

    function onScroll() {
      if (clickScrollLockRef.current) return;

      // throttle with rAF
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        // ✅ bigger offset on mobile because of sticky top bar
        const offset = isMobile ? 210 : 120;
        const y = window.scrollY + offset;

        let current = list[0];
        let bestTop = -Infinity;

        for (const cat of list) {
          const el = sectionRefs.current?.[cat];
          if (!el) continue;

          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= y && top > bestTop) {
            bestTop = top;
            current = cat;
          }
        }

        if (current && current !== activeCategory) {
          setActiveCategory(current);
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(onScroll, 50);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesToRender.join("|"), activeCategory, isMobile]);

  const isSearching = query.trim().length > 0;
  const anyResults = categoriesToRender.length > 0;

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={isMobile ? styles.shellMobile : styles.shell}>
        {/* ✅ MOBILE TOP (NO horizontal scrolling) */}
        {isMobile ? (
          <div style={styles.mobileTopWrap}>
            <div style={styles.mobileSearchRow}>
              <span style={styles.searchIcon}>⌕</span>
              <input
                style={styles.mobileSearchInput}
                placeholder="Search menu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div style={styles.mobileCategoryRow}>
              <label style={styles.mobileCategoryLabel}>Category</label>
              <select
                className="mobileCategorySelect" // ✅ IMPORTANT: class for CSS fix
                style={styles.mobileCategorySelect}
                value={activeCategory}
                onChange={(e) => scrollToCategory(e.target.value)}
              >
                {categoriesToRender.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {/* LEFT SIDEBAR (DESKTOP ONLY) */}
        {!isMobile ? (
          <aside style={styles.sidebar}>
            <div style={styles.searchWrap}>
              <div style={styles.searchRow}>
                <span style={styles.searchIcon}>⌕</span>
                <input
                  style={styles.searchInput}
                  placeholder="Search menu"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <nav style={styles.nav}>
              {categoriesToRender.map((cat) => {
                const isActive = cat === activeCategory;
                const count = grouped.get(cat)?.length ?? 0;

                return (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`sideBtn ${isActive ? "sideBtnActive" : ""}`}
                    style={styles.navItem}
                  >
                    <span className="sideBtnRow">
                      <span className="sideBtnLabel">{cat}</span>
                      <span className="sideBtnCount">{count}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        ) : null}

        {/* MAIN CONTENT */}
        <main style={styles.main}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>Halal King Pizza Menu</h1>
              <div style={styles.subline}>
                <span style={styles.dot}>●</span>
                <span style={styles.openNow}>Open now</span>
              </div>
            </div>
          </header>

          {error ? <p style={styles.error}>{error}</p> : null}

          {isSearching && !anyResults ? (
            <div style={styles.emptySearch}>
              No results for <strong>{query.trim()}</strong>.
            </div>
          ) : null}

          {/* Render categories */}
          {categoriesToRender.map((cat) => {
            const list = grouped.get(cat) || [];
            if (!list.length) return null;

            return (
              <section
                key={cat}
                id={`cat-${cssSafeId(cat)}`}
                ref={(el) => {
                  if (el) sectionRefs.current[cat] = el;
                }}
                style={styles.section}
              >
                <h2 style={styles.sectionTitle}>{cat}</h2>

                <div style={isMobile ? styles.gridMobile : styles.grid}>
                  {list.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onOpen={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* DETAILS MODAL */}
      {selectedItem ? (
        <div className="modalOverlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="modalTitleWrap">
                <div className="modalTitle">{selectedItem.food_name}</div>
                <div className="modalSubtitle">
                  {selectedItem._category || "Popular"}
                </div>
              </div>

              <button className="modalClose" onClick={() => setSelectedItem(null)}>
                Close
              </button>
            </div>

            <div className="modalBody">
              <div className="modalImageWrap">
                <img
                  className="modalImg"
                  src={selectedItem.food_photos || fallbackImg}
                  alt={selectedItem.food_name}
                />
              </div>

              <div className="modalInfo">
                <div className="modalRow">
                  <div className="modalPrice">
                    $
                    {selectedItem.price != null
                      ? Number(selectedItem.price).toFixed(2)
                      : "0.00"}
                  </div>

                  <span
                    className={`modalBadge ${
                      selectedItem.is_available !== false ? "badgeOn" : "badgeOff"
                    }`}
                  >
                    {selectedItem.is_available !== false
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                {selectedItem._desc ? (
                  <div className="modalDesc">{selectedItem._desc}</div>
                ) : (
                  <div className="modalDesc muted">No description.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Card ---------- */

function MenuCard({ item, onOpen }) {
  const available = item.is_available !== false;
  const desc = item._desc || "";

  return (
    <button
      type="button"
      className="menuCard"
      onClick={onOpen}
      style={styles.card}
      aria-label={`Open ${item.food_name}`}
    >
      <div className="cardLeft" style={styles.cardLeft}>
        <div className="thumbWrap" style={styles.thumbWrap}>
          <img
            className="thumbImg"
            src={item.food_photos || fallbackImg}
            alt={item.food_name}
            style={styles.thumb}
          />
          <div className={`tinyBadge ${available ? "tinyOn" : "tinyOff"}`}>
            {available ? "Available" : "Unavailable"}
          </div>
        </div>
      </div>

      <div className="cardBody" style={styles.cardBody}>
        <div style={styles.nameRow}>
          <div className="cardName" style={styles.cardName}>
            {item.food_name}
          </div>
          <div className="cardPrice" style={styles.cardPrice}>
            ${item.price != null ? Number(item.price).toFixed(2) : "0.00"}
          </div>
        </div>

        {desc ? (
          <div className="cardDesc" style={styles.cardDesc}>
            {desc}
          </div>
        ) : (
          <div className="cardDesc" style={styles.cardDesc} />
        )}
      </div>
    </button>
  );
}

/* ---------- Styles ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#111",
  },

  shell: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 18px",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 28,
  },

  shellMobile: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 14px 22px",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
  },

  /* ✅ Mobile sticky top */
  mobileTopWrap: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "10px 0 12px",
  },

  mobileSearchRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#fff",
  },
  mobileSearchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
  },

  mobileCategoryRow: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "90px 1fr",
    alignItems: "center",
    gap: 10,
  },
  mobileCategoryLabel: {
    fontSize: 13,
    color: "#444",
    fontWeight: 800,
  },
  mobileCategorySelect: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    background: "#fff",
    outline: "none",
  },

  sidebar: {
    position: "sticky",
    top: 18,
    alignSelf: "start",
    height: "calc(100vh - 36px)",
    overflow: "auto",
    paddingRight: 6,
  },

  searchWrap: { marginBottom: 14 },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#fff",
  },
  searchIcon: { opacity: 0.6, fontSize: 16 },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
  },

  nav: { display: "grid", gap: 8 },
  navItem: {
    textAlign: "left",
    border: "1px solid transparent",
    background: "transparent",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 14,
  },

  main: { minWidth: 0 },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: { fontSize: 22, margin: 0, fontWeight: 800 },
  subline: {
    marginTop: 6,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#666",
    fontSize: 13,
  },
  dot: { fontSize: 10, color: "#16a34a" },
  openNow: { color: "#16a34a", fontWeight: 700 },

  error: { color: "crimson" },

  emptySearch: {
    marginTop: 18,
    border: "1px dashed #ddd",
    borderRadius: 14,
    padding: 14,
    color: "#444",
    fontSize: 14,
    background: "#fafafa",
  },

  section: { marginTop: 18 },
  sectionTitle: { margin: "0 0 10px 0", fontSize: 17, fontWeight: 800 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },
  gridMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },

  card: {
    border: "1px solid #eee",
    borderRadius: 14,
    background: "#fff",
    padding: 12,
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 12,
    minWidth: 0,
    textAlign: "left",
    width: "100%",
  },

  cardLeft: {},

  thumbWrap: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 14,
    overflow: "hidden",
    background: "#fafafa",
    border: "1px solid #eee",
  },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  cardBody: { minWidth: 0 },

  nameRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  cardName: {
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: 0,
  },
  cardPrice: {
    fontWeight: 800,
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  cardDesc: {
    marginTop: 8,
    fontSize: 15,
    color: "#666",
    minHeight: 14,
    lineHeight: "24px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
};

const css = `
  /* Sidebar buttons */
  .sideBtn{
    border: 1px solid transparent;
    background: transparent;
    transition: background 140ms ease, color 140ms ease, border-color 140ms ease;
  }
  .sideBtn:hover{
    background: #f6f6f6;
    border-color: #efefef;
  }
  .sideBtnActive{
    background: #111 !important;
    color: #fff !important;
  }
  .sideBtnActive:hover{
    background: #111 !important;
    border-color: #111 !important;
  }
  .sideBtnRow{
    display:flex;
    justify-content:space-between;
    gap:10px;
  }
  .sideBtnLabel{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .sideBtnCount{
    opacity:0.6;
    font-weight:800;
  }
  .sideBtnActive .sideBtnCount{
    opacity:0.9;
  }

  /* Card hover */
  .menuCard{
    cursor:pointer;
    transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
    border-color: #eee;
  }
  .menuCard:hover{
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    border-color: #e6e6e6;
  }

  /* ✅ MOBILE: make cards SMALL and fit the screen (NO horizontal scroll) */
  @media (max-width: 860px){
    .menuCard{
      padding: 10px !important;
      border-radius: 12px !important;
      display: grid !important;
      grid-template-columns: 74px 1fr !important;
      gap: 10px !important;
      width: 100% !important;
      transform: none !important;
    }

    .menuCard:hover{
      transform: none !important;
      box-shadow: 0 8px 22px rgba(0,0,0,0.06);
    }

    .menuCard .thumbWrap{
      width: 74px !important;
      height: 74px !important;
      border-radius: 12px !important;
    }

    .menuCard .tinyBadge{
      left: 7px;
      bottom: 7px;
      height: 18px;
      padding: 0 8px;
      font-size: 10px;
    }

    .menuCard .cardName{
      font-size: 13px !important;
    }
    .menuCard .cardPrice{
      font-size: 13px !important;
    }
    .menuCard .cardDesc{
      margin-top: 6px !important;
      font-size: 13px !important;
      line-height: 18px !important;
      -webkit-line-clamp: 2;
    }
  }

  /* Small badge on thumbnail */
  .tinyBadge{
    position:absolute;
    left:10px;
    bottom:10px;
    height:22px;
    padding:0 10px;
    border-radius:999px;
    font-size:12px;
    font-weight:800;
    display:inline-flex;
    align-items:center;
    border:1px solid #ddd;
    background:#fff;
  }
  .tinyOn{
    border-color:#bbf7d0;
    background:#f0fdf4;
    color:#166534;
  }
  .tinyOff{
    border-color:#fecaca;
    background:#fef2f2;
    color:#991b1b;
  }

  /* ✅ FIX: dropdown options text/background (and force LIGHT UI on iOS/Android) */
  .mobileCategorySelect{
    background: #fff !important;
    color: #111 !important;
    border: 1px solid #ddd !important;
    color-scheme: light !important;
  }
  .mobileCategorySelect option{
    background: #fff !important;
    color: #111 !important;
  }

  /* Modal */
  .modalOverlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:16px;
    z-index:9999;
  }
  .modal{
    width: 860px;
    max-width: 100%;
    background:#fff;
    border:1px solid #eee;
    border-radius: 16px;
    overflow:hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.2);
  }
  .modalHeader{
    padding:16px 18px;
    border-bottom:1px solid #eee;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
  }
  .modalTitleWrap{ min-width:0; }
  .modalTitle{
    font-weight:900;
    font-size:18px;
    line-height:22px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .modalSubtitle{
    margin-top:4px;
    font-size:13px;
    color:#666;
  }
  .modalClose{
    border:1px solid #ddd;
    background:#fff;
    border-radius: 10px;
    padding:8px 12px;
    cursor:pointer;
    font-weight:800;
  }
  .modalClose:hover{
    background:#f6f6f6;
  }

  .modalBody{
    display:grid;
    grid-template-columns: 360px 1fr;
    gap:18px;
    padding:18px;
  }
  @media (max-width: 820px){
    .modalBody{ grid-template-columns: 1fr; }
  }

  .modalImageWrap{
    border:1px solid #eee;
    border-radius:14px;
    overflow:hidden;
    background:#fafafa;
    height: 280px;
  }
  .modalImg{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
  }

  .modalInfo{
    min-width:0;
  }
  .modalRow{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    margin-bottom:12px;
  }
  .modalPrice{
    font-size:20px;
    font-weight:900;
  }
  .modalBadge{
    height:28px;
    padding:0 12px;
    border-radius:999px;
    display:inline-flex;
    align-items:center;
    font-size:12px;
    font-weight:900;
    border:1px solid #ddd;
    background:#fff;
  }
  .badgeOn{
    border-color:#bbf7d0;
    background:#f0fdf4;
    color:#166534;
  }
  .badgeOff{
    border-color:#fecaca;
    background:#fef2f2;
    color:#991b1b;
  }
  .modalDesc{
    font-size:16px;
    line-height:26px;
    color:#333;
  }
  .modalDesc.muted{
    color:#888;
  }
`;