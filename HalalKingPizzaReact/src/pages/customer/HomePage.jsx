// // src/pages/customer/HomePage.jsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import { fetchFoodItems } from "../../services/food-items";

// // ✅ Hero banner image
// import bannerImg from "../../assets/cover photo.png";

// // ✅ Add more hero images here if you want
// const heroImages = [
//   bannerImg,
//   // hero2,
//   // hero3,
// ];

// export default function HomePage() {
//   const [items, setItems] = useState([]);
//   const [err, setErr] = useState("");

//   // Featured carousel
//   const rowRef = useRef(null);
//   const autoTimerRef = useRef(null);

//   // Hero carousel
//   const [heroIndex, setHeroIndex] = useState(0);
//   const heroTimerRef = useRef(null);

//   // FAQ open row
//   const [openFaq, setOpenFaq] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         setErr("");
//         const data = await fetchFoodItems();
//         setItems(data ?? []);
//       } catch (e) {
//         setErr(e?.message || "Failed to load featured items");
//       }
//     })();
//   }, []);

//   const featured = useMemo(() => {
//     const available = (items ?? []).filter((i) => i?.is_available !== false);

//     const popular = available.filter(
//       (i) =>
//         (i.category || 'Pizza by Pie Personal (10")') ===
//         'Pizza by Pie Personal (10")'
//     );

//     const rest = available.filter(
//       (i) => (i.category || 'Medium Pizza (14")') !== 'Medium Pizza (14")'
//     );

//     return [...popular, ...rest].slice(0, 12);
//   }, [items]);

//   // ✅ Auto-scrolling FEATURED row
//   useEffect(() => {
//     const el = rowRef.current;
//     if (!el || !featured.length) return;

//     if (autoTimerRef.current) clearInterval(autoTimerRef.current);

//     autoTimerRef.current = setInterval(() => {
//       const maxScroll = el.scrollWidth - el.clientWidth;

//       if (el.scrollLeft >= maxScroll - 20) {
//         el.scrollTo({ left: 0, behavior: "smooth" });
//       } else {
//         el.scrollBy({ left: 260, behavior: "smooth" });
//       }
//     }, 2200);

//     return () => {
//       if (autoTimerRef.current) clearInterval(autoTimerRef.current);
//     };
//   }, [featured]);

//   function scrollLeft() {
//     rowRef.current?.scrollBy({ left: -260, behavior: "smooth" });
//   }
//   function scrollRight() {
//     rowRef.current?.scrollBy({ left: 260, behavior: "smooth" });
//   }

//   // ✅ Auto-rotate HERO images
//   useEffect(() => {
//     if (!heroImages.length) return;

//     if (heroTimerRef.current) clearInterval(heroTimerRef.current);

//     heroTimerRef.current = setInterval(() => {
//       setHeroIndex((prev) => (prev + 1) % heroImages.length);
//     }, 4000);

//     return () => {
//       if (heroTimerRef.current) clearInterval(heroTimerRef.current);
//     };
//   }, []);

//   function heroPrev() {
//     setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
//   }
//   function heroNext() {
//     setHeroIndex((prev) => (prev + 1) % heroImages.length);
//   }

//   const testimonials = [
//     {
//       name: "Angelo K.",
//       text: "One of the best pizza places in town. We tried the pepperoni and chicken barbecue pizzas. Good...",
//       stars: 5,
//       avatarBg: "#111",
//     },
//     {
//       name: "Gordy V.",
//       text: "Came from out of town and was pleasantly surprised with the quality and taste of this pizza. Also my first tim...",
//       stars: 5,
//       avatarBg: "#111",
//     },
//     {
//       name: "Mike V.",
//       text: "I LOVE PIZZ'A CHICAGO, always have, and in all my many years of going to PIZZA CHICAGO, I have...",
//       stars: 5,
//       avatarBg: "#111",
//     },
//     {
//       name: "Teri W.",
//       text: "Best deep dish pizza that you can get around here. We had Sears tower pizza replacing onions within...",
//       stars: 5,
//       avatarBg: "#111",
//     },
//     {
//       name: "Tony B.",
//       text: "Had the untouchables pizza, was DELICIOUS! I live in Stockton and come out this way every couple months...",
//       stars: 5,
//       avatarBg: "#111",
//     },
//     {
//       name: "Jessica A.",
//       text: "Been going here regularly for years. We also have had a few family gatherings in the back room for special...",
//       stars: 5,
//       avatarBg: "#111",
//     },
//   ];

//   const faqs = [
//     {
//       q: "What are you known for?",
//       a: "We’re known for fresh, halal-friendly comfort food — especially our pizzas, gyros, and classic favorites.",
//     },
//     {
//       q: "What meals do you serve?",
//       a: "We serve pizza, gyros, sides, desserts, and drinks. Check the Menu page for the full list.",
//     },
//     {
//       q: "Do you offer delivery or takeout?",
//       a: "Yes — we offer takeout, and you can order delivery online using the Order online button.",
//     },
//     {
//       q: "Where are you located?",
//       a: "NYC. (If you want, tell me the exact address and I’ll add it here + in the hero area.)",
//     },
//     {
//       q: "What areas do you serve?",
//       a: "We serve nearby areas for delivery depending on the delivery service coverage.",
//     },
//   ];

//   return (
//     <div style={styles.page}>
//       {/* HERO - FULL WIDTH BREAKOUT */}
//       <section style={styles.hero}>
//         {/* Background images (fade) */}
//         <div style={styles.heroImgLayer}>
//           {heroImages.map((src, i) => {
//             const isActive = i === heroIndex;
//             return (
//               <img
//                 key={src + i}
//                 src={src}
//                 alt="Halal King Pizza banner"
//                 style={{
//                   ...styles.heroImg,
//                   opacity: isActive ? 1 : 0,
//                 }}
//               />
//             );
//           })}
//         </div>

//         <div style={styles.heroShade} />

//         {/* Hero arrows */}
//         {heroImages.length > 1 ? (
//           <>
//             <button
//               style={{ ...styles.heroArrow, left: 14 }}
//               onClick={heroPrev}
//               aria-label="Previous banner"
//               type="button"
//             >
//               ‹
//             </button>
//             <button
//               style={{ ...styles.heroArrow, right: 14 }}
//               onClick={heroNext}
//               aria-label="Next banner"
//               type="button"
//             >
//               ›
//             </button>
//           </>
//         ) : null}

//         <div style={styles.heroInner}>
//           <div style={styles.heroKicker}>Best halal pizza in NYC</div>

//           <h1 style={styles.heroTitle}>Halal King Pizza</h1>

//           <div style={styles.heroHours}>Open Daily · 11:00 AM – 11:45 PM</div>

//           <div style={styles.heroCtas}>
//             <a
//               href={import.meta.env.VITE_UBER_EATS_URL}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ ...styles.cta, ...styles.ctaPrimary }}
//             >
//               Order online ›
//             </a>

//             <a href="/menu" style={{ ...styles.cta, ...styles.ctaGhost }}>
//               View menu
//             </a>
//           </div>

//           {/* Hero dots */}
//           {heroImages.length > 1 ? (
//             <div style={styles.dots}>
//               {heroImages.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setHeroIndex(i)}
//                   style={{
//                     ...styles.dotBtn,
//                     ...(i === heroIndex ? styles.dotBtnActive : null),
//                   }}
//                   aria-label={`Go to banner ${i + 1}`}
//                   type="button"
//                 />
//               ))}
//             </div>
//           ) : null}
//         </div>
//       </section>

//       {/* FEATURED SECTION */}
//       <section style={styles.section}>
//         <div style={styles.sectionTop}>
//           <h2 style={styles.sectionTitle}>Featured</h2>

//           <div style={styles.sectionActions}>
//             <button type="button" onClick={scrollLeft} style={styles.arrowBtn}>
//               ‹
//             </button>
//             <button type="button" onClick={scrollRight} style={styles.arrowBtn}>
//               ›
//             </button>

//             <a href="/menu" style={styles.viewMenuBtn}>
//               View menu ›
//             </a>
//           </div>
//         </div>

//         {err ? <div style={styles.error}>{err}</div> : null}

//         <div ref={rowRef} style={styles.featureRow}>
//           {featured.length ? (
//             featured.map((item) => <FeaturedCard key={item.id} item={item} />)
//           ) : (
//             <div style={styles.emptyState}>No featured items yet.</div>
//           )}
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section style={styles.testimonialsWrap}>
//         <div style={styles.testimonialsCard}>
//           <h3 style={styles.testimonialsTitle}>What our guests are saying</h3>

//           <div style={styles.testimonialsGrid}>
//             {testimonials.map((t, idx) => (
//               <div key={idx} style={styles.reviewCard}>
//                 <div style={styles.starsRow}>
//                   <span style={styles.starIcon}>★</span>
//                   <span style={styles.starIcon}>★</span>
//                   <span style={styles.starIcon}>★</span>
//                   <span style={styles.starIcon}>★</span>
//                   <span style={styles.starIcon}>★</span>
//                 </div>

//                 <div style={styles.reviewText}>{t.text}</div>

//                 <div style={styles.reviewMore}>View more</div>

//                 <div style={styles.reviewerRow}>
//                   <div style={styles.reviewerAvatar}>{t.name.charAt(0)}</div>
//                   <div style={styles.reviewerName}>{t.name}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section style={styles.faqWrap}>
//         <div style={styles.faqInner}>
//           <h3 style={styles.faqTitle}>Frequently Asked Questions</h3>

//           <div style={styles.faqList}>
//             {faqs.map((f, idx) => {
//               const isOpen = openFaq === idx;
//               return (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => setOpenFaq(isOpen ? null : idx)}
//                   style={styles.faqRow}
//                 >
//                   <div style={styles.faqRowTop}>
//                     <div style={styles.faqQ}>{f.q}</div>
//                     <div style={styles.faqChevron}>{isOpen ? "▴" : "▾"}</div>
//                   </div>

//                   {isOpen ? <div style={styles.faqA}>{f.a}</div> : null}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ---------- Featured Card ---------- */

// function FeaturedCard({ item }) {
//   const img = item.food_photos || fallbackImg;
//   const price = item.price != null ? Number(item.price).toFixed(2) : "0.00";

//   return (
//     <div style={styles.card}>
//       <div style={styles.cardImgWrap}>
//         <img src={img} alt={item.food_name} style={styles.cardImg} />
//         <button style={styles.plusBtn} type="button">
//           +
//         </button>
//       </div>

//       <div style={styles.cardBody}>
//         <div style={styles.cardName}>{item.food_name}</div>
//         <div style={styles.cardPrice}>${price}</div>
//       </div>
//     </div>
//   );
// }

// /* ---------- Fallback Image ---------- */

// const fallbackImg =
//   "https://images.unsplash.com/photo-1601924579440-6f98f261d5ff?auto=format&fit=crop&w=900&q=60";

// /* ---------- Styles ---------- */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#fff",
//     color: "#111",
//     fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
//   },

//   /* HERO FULL WIDTH BREAKOUT */
//   hero: {
//     position: "relative",
//     width: "100vw",
//     left: "50%",
//     right: "50%",
//     marginLeft: "-50vw",
//     marginRight: "-50vw",
//     height: "72vh",
//     minHeight: 520,
//     overflow: "hidden",
//   },
//   heroImgLayer: {
//     position: "absolute",
//     inset: 0,
//   },
//   heroImg: {
//     position: "absolute",
//     inset: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "contain",
//     backgroundColor: "#000",
//     transition: "opacity 600ms ease",
//   },
//   heroShade: {
//     position: "absolute",
//     inset: 0,
//     background:
//       "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)",
//   },
//   heroInner: {
//     position: "relative",
//     zIndex: 2,
//     maxWidth: 1200,
//     margin: "0 auto",
//     padding: "80px 20px",
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     color: "#fff",
//   },
//   heroKicker: {
//     fontSize: 16,
//     fontWeight: 800,
//     marginBottom: 10,
//   },
//   heroTitle: {
//     margin: 0,
//     maxWidth: 900,
//     fontSize: 56,
//     lineHeight: "60px",
//     fontWeight: 900,
//   },
//   heroHours: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: 800,
//     opacity: 0.95,
//   },
//   heroCtas: {
//     marginTop: 20,
//     display: "flex",
//     gap: 14,
//     flexWrap: "wrap",
//   },
//   cta: {
//     textDecoration: "none",
//     fontWeight: 900,
//     padding: "12px 16px",
//     borderRadius: 12,
//     border: "1px solid transparent",
//     display: "inline-flex",
//     alignItems: "center",
//   },
//   ctaPrimary: {
//     background: "#d20b0b",
//     borderColor: "#d20b0b",
//     color: "#fff",
//   },
//   ctaGhost: {
//     background: "rgba(255,255,255,0.2)",
//     borderColor: "rgba(255,255,255,0.3)",
//     color: "#fff",
//   },

//   heroArrow: {
//     position: "absolute",
//     top: "50%",
//     transform: "translateY(-50%)",
//     zIndex: 3,
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.35)",
//     background: "rgba(0,0,0,0.25)",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: 28,
//     fontWeight: 900,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backdropFilter: "blur(6px)",
//   },

//   dots: {
//     marginTop: 18,
//     display: "flex",
//     gap: 8,
//   },
//   dotBtn: {
//     width: 10,
//     height: 10,
//     borderRadius: 999,
//     border: "1px solid rgba(255,255,255,0.65)",
//     background: "rgba(255,255,255,0.25)",
//     cursor: "pointer",
//   },
//   dotBtnActive: {
//     background: "#fff",
//   },

//   /* FEATURED */
//   section: {
//     maxWidth: 1200,
//     margin: "0 auto",
//     padding: "40px 20px",
//   },
//   sectionTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 900,
//     margin: 0,
//   },
//   sectionActions: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     flexWrap: "wrap",
//     justifyContent: "flex-end",
//   },
//   arrowBtn: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     border: "1px solid #e7e7e7",
//     background: "#fff",
//     cursor: "pointer",
//     fontWeight: 900,
//   },
//   viewMenuBtn: {
//     textDecoration: "none",
//     fontWeight: 800,
//     border: "1px solid #e7e7e7",
//     padding: "8px 12px",
//     borderRadius: 12,
//     color: "#111",
//   },

//   featureRow: {
//     display: "flex",
//     gap: 16,
//     overflowX: "auto",
//     scrollBehavior: "smooth",
//     paddingBottom: 6,
//   },

//   card: {
//     minWidth: 220,
//   },
//   cardImgWrap: {
//     position: "relative",
//     height: 160,
//     borderRadius: 16,
//     overflow: "hidden",
//     border: "1px solid #eee",
//     background: "#fafafa",
//   },
//   cardImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     display: "block",
//   },
//   plusBtn: {
//     position: "absolute",
//     right: 10,
//     bottom: 10,
//     width: 34,
//     height: 34,
//     borderRadius: 12,
//     border: "1px solid #ddd",
//     background: "#fff",
//     fontWeight: 900,
//     cursor: "pointer",
//   },
//   cardBody: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: 8,
//     gap: 10,
//   },
//   cardName: {
//     fontWeight: 900,
//     fontSize: 14,
//     maxWidth: 150,
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
//   cardPrice: {
//     fontWeight: 900,
//   },
//   error: { color: "crimson" },
//   emptyState: {
//     padding: 16,
//     border: "1px dashed #ddd",
//     borderRadius: 12,
//   },

//   /* TESTIMONIALS */
//   testimonialsWrap: {
//     maxWidth: 1200,
//     margin: "0 auto",
//     padding: "10px 20px 40px",
//   },
//   testimonialsCard: {
//     background: "#f3f3f3",
//     borderRadius: 18,
//     padding: "26px 22px",
//   },
//   testimonialsTitle: {
//     margin: 0,
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: 900,
//   },
//   testimonialsGrid: {
//     marginTop: 18,
//     display: "grid",
//     gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
//     gap: 14,
//   },
//   reviewCard: {
//     background: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     border: "1px solid #eee",
//     minHeight: 150,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   starsRow: {
//     display: "flex",
//     gap: 2,
//     marginBottom: 8,
//   },
//   starIcon: {
//     fontSize: 12,
//   },
//   reviewText: {
//     fontSize: 12,
//     lineHeight: "16px",
//     color: "#111",
//     opacity: 0.9,
//     marginBottom: 10,
//   },
//   reviewMore: {
//     fontSize: 12,
//     textDecoration: "underline",
//     opacity: 0.75,
//     marginBottom: 10,
//     alignSelf: "flex-start",
//   },
//   reviewerRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 6,
//   },
//   reviewerAvatar: {
//     width: 22,
//     height: 22,
//     borderRadius: 999,
//     background: "#111",
//     color: "#fff",
//     fontSize: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 900,
//   },
//   reviewerName: {
//     fontSize: 12,
//     fontWeight: 800,
//     opacity: 0.85,
//   },

//   /* FAQ */
//   faqWrap: {
//     maxWidth: 1200,
//     margin: "0 auto",
//     padding: "20px 20px 70px",
//   },
//   faqInner: {
//     maxWidth: 900,
//     margin: "0 auto",
//   },
//   faqTitle: {
//     margin: "0 0 14px 0",
//     fontSize: 16,
//     fontWeight: 900,
//   },
//   faqList: {
//     display: "grid",
//     gap: 10,
//   },
//   faqRow: {
//     width: "100%",
//     textAlign: "left",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     padding: "10px 0",
//     borderBottom: "1px solid #e9e9e9",
//   },
//   faqRowTop: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   faqQ: {
//     fontSize: 13,
//     fontWeight: 700,
//     color: "#111",
//   },
//   faqChevron: {
//     fontSize: 14,
//     opacity: 0.7,
//   },
//   faqA: {
//     marginTop: 10,
//     fontSize: 13,
//     lineHeight: "18px",
//     color: "#444",
//     maxWidth: 820,
//   },
// };


// src/pages/customer/HomePage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchFoodItems } from "../../services/food-items";

// ✅ Hero banner image
import bannerImg from "../../assets/cover photo.png";

// ✅ Add more hero images here if you want
const heroImages = [
  bannerImg,
  // hero2,
  // hero3,
];

// ✅ Google “View more” link (env optional)
const GOOGLE_REVIEWS_URL =
  import.meta.env.VITE_GOOGLE_REVIEWS_URL ||
  "https://www.google.com/search?q=halal+king+pizza&oq=halal+king+pizza&gs_lcrp=EgZjaHJvbWUqDAgAECMYJxiABBiKBTIMCAAQIxgnGIAEGIoFMg0IARAuGK8BGMcBGIAEMgwIAhAjGCcYgAQYigUyBwgDEAAYgAQyCAgEEAAYFhgeMgYIBRBFGDwyBggGEEUYPDIGCAcQRRg90gEIMzQwNGowajSoAgCwAgE&sourceid=chrome&ie=UTF-8&zx=1771740257816&no_sw_cr=1&lqi=ChBoYWxhbCBraW5nIHBpenphSOD49pLEvoCACFooEAAQARACGAAYARgCIhBoYWxhbCBraW5nIHBpenphKggIAhAAEAEQApIBEHBpenphX3Jlc3RhdXJhbnSaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnhvVldSSVVrSk5NMUpGVmtac1ExTlZXa2hSYldneFYwVTFlRmd4UlJBQuABAPoBBAgWEDw#lkt=LocalPoiReviews&rlimm=12420366772652954828";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  // Featured carousel
  const rowRef = useRef(null);
  const autoTimerRef = useRef(null);

  // Hero carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef(null);

  // FAQ open row
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const data = await fetchFoodItems();
        setItems(data ?? []);
      } catch (e) {
        setErr(e?.message || "Failed to load featured items");
      }
    })();
  }, []);

  const featured = useMemo(() => {
    const available = (items ?? []).filter((i) => i?.is_available !== false);

    const popular = available.filter(
      (i) =>
        (i.category || 'Pizza by Pie Personal (10")') ===
        'Pizza by Pie Personal (10")'
    );

    const rest = available.filter(
      (i) => (i.category || 'Medium Pizza (14")') !== 'Medium Pizza (14")'
    );

    return [...popular, ...rest].slice(0, 12);
  }, [items]);

  // ✅ Auto-scrolling FEATURED row
  useEffect(() => {
    const el = rowRef.current;
    if (!el || !featured.length) return;

    if (autoTimerRef.current) clearInterval(autoTimerRef.current);

    autoTimerRef.current = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 2200);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [featured]);

  function scrollLeft() {
    rowRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  }
  function scrollRight() {
    rowRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  }

  // ✅ Auto-rotate HERO images
  useEffect(() => {
    if (!heroImages.length) return;

    if (heroTimerRef.current) clearInterval(heroTimerRef.current);

    heroTimerRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, []);

  function heroPrev() {
    setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }
  function heroNext() {
    setHeroIndex((prev) => (prev + 1) % heroImages.length);
  }

  // ✅ REAL REVIEWS (from your screenshots)
  const testimonials = [
    {
      name: "Abdullah Khan",
      text:
        "Food and service here was awesome, amazing staff and customer service. Clean environment and overall great energy. Definitely recommend the buffalo chicken pizza.",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "tasnim chowdhury",
      text:
        "Very good food and service. Best place to eat in Grand concourse.",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "Sadia Chowdhury",
      text:
        "I ordered a whole pie half buffalo chicken and half plain cheese. It was amazing 10/10. Everything is halal!! I would highly recommend.",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "Sumaiya Hussain",
      text:
        "Tasty pizza for a decent price, super quick service, large range of toppings and friendly staff.",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "Marie Rios",
      text:
        "I’ve always wanted a halal option, and for the first time this place has amazed me. Very great customer service, and it’s very nice in there super clean. Great tasty food.",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "Sheikh Jahan",
      text:
        "I really enjoyed having pizza from this store. We ordered the buffalo chicken pizza pie and the pepperoni pizza pie. Both were delicious!!! We will be coming back for these halal pizza!!!",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "Muhammad Rahman",
      text:
        "A great pizza spot, I loved their pizza’s definitely worth the price for quantity and quality of the food. Recommended!!",
      stars: 5,
      avatarBg: "#111",
    },
    {
      name: "Carl Beasley",
      text:
        "Food is really amazing, great customer service everything is the bomb Diggity.",
      stars: 5,
      avatarBg: "#111",
    },
  ];

  const faqs = [
    {
      q: "What are you known for?",
      a: "We’re known for fresh, halal-friendly comfort food — especially our pizzas, gyros, and classic favorites.",
    },
    {
      q: "What meals do you serve?",
      a: "We serve pizza, gyros, sides, desserts, and drinks. Check the Menu page for the full list.",
    },
    {
      q: "Do you offer delivery or takeout?",
      a: "Yes — we offer takeout, and you can order delivery online using the Order online button.",
    },
    {
      q: "Where are you located?",
      a: "Halal King Pizza (2197 Grand Concourse)",
    },
    {
      q: "What areas do you serve?",
      a: "We serve nearby areas for delivery depending on the delivery service coverage.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* HERO - FULL WIDTH BREAKOUT */}
      <section style={styles.hero}>
        {/* Background images (fade) */}
        <div style={styles.heroImgLayer}>
          {heroImages.map((src, i) => {
            const isActive = i === heroIndex;
            return (
              <img
                key={src + i}
                src={src}
                alt="Halal King Pizza banner"
                style={{
                  ...styles.heroImg,
                  opacity: isActive ? 1 : 0,
                }}
              />
            );
          })}
        </div>

        <div style={styles.heroShade} />

        {/* Hero arrows */}
        {heroImages.length > 1 ? (
          <>
            <button
              style={{ ...styles.heroArrow, left: 14 }}
              onClick={heroPrev}
              aria-label="Previous banner"
              type="button"
            >
              ‹
            </button>
            <button
              style={{ ...styles.heroArrow, right: 14 }}
              onClick={heroNext}
              aria-label="Next banner"
              type="button"
            >
              ›
            </button>
          </>
        ) : null}

        <div className="hk-heroInner" style={styles.heroInner}>
          <div style={styles.heroKicker}>Best halal pizza in NYC</div>

          <h1 style={styles.heroTitle}>Halal King Pizza</h1>

          <div style={styles.heroHours}>Open Daily · 11:00 AM – 11:45 PM</div>

          <div style={styles.heroCtas}>
            <a
              href={import.meta.env.VITE_UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.cta, ...styles.ctaPrimary }}
            >
              Order online ›
            </a>

            <a href="/menu" style={{ ...styles.cta, ...styles.ctaGhost }}>
              View menu
            </a>
          </div>

          {/* Hero dots */}
          {heroImages.length > 1 ? (
            <div style={styles.dots}>
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  style={{
                    ...styles.dotBtn,
                    ...(i === heroIndex ? styles.dotBtnActive : null),
                  }}
                  aria-label={`Go to banner ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionTop}>
          <h2 style={styles.sectionTitle}>Featured</h2>

          <div style={styles.sectionActions}>
            <button type="button" onClick={scrollLeft} style={styles.arrowBtn}>
              ‹
            </button>
            <button type="button" onClick={scrollRight} style={styles.arrowBtn}>
              ›
            </button>

            <a href="/menu" style={styles.viewMenuBtn}>
              View menu ›
            </a>
          </div>
        </div>

        {err ? <div style={styles.error}>{err}</div> : null}

        <div ref={rowRef} style={styles.featureRow}>
          {featured.length ? (
            featured.map((item) => <FeaturedCard key={item.id} item={item} />)
          ) : (
            <div style={styles.emptyState}>No featured items yet.</div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.testimonialsWrap}>
        <div style={styles.testimonialsCard}>
          <h3 style={styles.testimonialsTitle}>What our guests are saying</h3>

          <div className="hk-testimonialsGrid" style={styles.testimonialsGrid}>
            {testimonials.map((t, idx) => (
              <div key={idx} style={styles.reviewCard}>
                <div style={styles.starsRow}>
                  <span style={styles.starIcon}>★</span>
                  <span style={styles.starIcon}>★</span>
                  <span style={styles.starIcon}>★</span>
                  <span style={styles.starIcon}>★</span>
                  <span style={styles.starIcon}>★</span>
                </div>

                <div style={styles.reviewText}>{t.text}</div>

                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.reviewMore}
                >
                  View more
                </a>

                <div style={styles.reviewerRow}>
                  <div style={styles.reviewerAvatar}>{t.name.charAt(0)}</div>
                  <div style={styles.reviewerName}>{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.faqWrap}>
        <div style={styles.faqInner}>
          <h3 style={styles.faqTitle}>Frequently Asked Questions</h3>

          <div style={styles.faqList}>
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={styles.faqRow}
                >
                  <div style={styles.faqRowTop}>
                    <div style={styles.faqQ}>{f.q}</div>
                    <div style={styles.faqChevron}>{isOpen ? "▴" : "▾"}</div>
                  </div>

                  {isOpen ? <div style={styles.faqA}>{f.a}</div> : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

       {/* MOBILE & GRID FIXES */}
      <style>{`
        /* Desktop grid */
        .hk-testimonialsGrid{
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 14px !important;
        }

        @media (max-width: 900px){
          .hk-testimonialsGrid{
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        /* Mobile testimonial swipe */
        @media (max-width: 560px){
          .hk-testimonialsGrid{
            display: flex !important;
            gap: 12px !important;
            overflow-x: auto !important;
            padding-bottom: 10px !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }

          .hk-testimonialsGrid > div{
            flex: 0 0 82% !important;
            max-width: 360px !important;
            scroll-snap-align: start;
          }
        }

        /* ✅ HERO LEFT SIDE MIDDLE ON MOBILE */
        @media (max-width: 768px) {
          .hk-heroInner {
            padding: 20px 20px !important;
            justify-content: center !important; 
            align-items: flex-start !important; 
            text-align: left !important;
          }
        
    
`}</style>
    </div>
  );
}

/* ---------- Featured Card ---------- */

function FeaturedCard({ item }) {
  const img = item.food_photos || fallbackImg;
  const price = item.price != null ? Number(item.price).toFixed(2) : "0.00";

  return (
    <div style={styles.card}>
      <div style={styles.cardImgWrap}>
        <img src={img} alt={item.food_name} style={styles.cardImg} />
        <button style={styles.plusBtn} type="button">
          +
        </button>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardName}>{item.food_name}</div>
        <div style={styles.cardPrice}>${price}</div>
      </div>
    </div>
  );
}

/* ---------- Fallback Image ---------- */

const fallbackImg =
  "https://images.unsplash.com/photo-1601924579440-6f98f261d5ff?auto=format&fit=crop&w=900&q=60";

/* ---------- Styles ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    color: "#111",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },

  /* HERO FULL WIDTH BREAKOUT */
  hero: {
    position: "relative",
    width: "100vw",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    height: "72vh",
    minHeight: 520,
    overflow: "hidden",
  },
  heroImgLayer: {
    position: "absolute",
    inset: 0,
  },
  heroImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    backgroundColor: "#000",
    transition: "opacity 600ms ease",
  },
  heroShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)",
  },
heroInner: {
  position: "relative",
  zIndex: 2,
  maxWidth: 1200,
  margin: "0 auto",
  padding: "80px 20px 20px 20px", // ✅ desktop padding
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",  // ✅ top
  alignItems: "flex-start",      // ✅ left
  color: "#fff",
},
  heroKicker: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 10,
  },
  heroTitle: {
    margin: 0,
    maxWidth: 900,
    fontSize: 56,
    lineHeight: "60px",
    fontWeight: 900,
  },
  heroHours: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 800,
    opacity: 0.95,
  },
  heroCtas: {
    marginTop: 20,
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
  },
  cta: {
    textDecoration: "none",
    fontWeight: 900,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
  },
  ctaPrimary: {
    background: "#d20b0b",
    borderColor: "#d20b0b",
    color: "#fff",
  },
  ctaGhost: {
    background: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.3)",
    color: "#fff",
  },

  heroArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 28,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(6px)",
  },

  dots: {
    marginTop: 18,
    display: "flex",
    gap: 8,
  },
  dotBtn: {
    width: 10,
    height: 10,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.65)",
    background: "rgba(255,255,255,0.25)",
    cursor: "pointer",
  },
  dotBtnActive: {
    background: "#fff",
  },

  /* FEATURED */
  section: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 20px",
  },
  sectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 900,
    margin: 0,
  },
  sectionActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid #e7e7e7",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  },
  viewMenuBtn: {
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid #e7e7e7",
    padding: "8px 12px",
    borderRadius: 12,
    color: "#111",
  },

  featureRow: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    scrollBehavior: "smooth",
    paddingBottom: 6,
  },

  card: {
    minWidth: 220,
  },
  cardImgWrap: {
    position: "relative",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #eee",
    background: "#fafafa",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  plusBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  cardBody: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },
  cardName: {
    fontWeight: 900,
    fontSize: 14,
    maxWidth: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardPrice: {
    fontWeight: 900,
  },
  error: { color: "crimson" },
  emptyState: {
    padding: 16,
    border: "1px dashed #ddd",
    borderRadius: 12,
  },

  /* TESTIMONIALS */
  testimonialsWrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "10px 20px 40px",
  },
  testimonialsCard: {
    background: "#f3f3f3",
    borderRadius: 18,
    padding: "26px 22px",
  },
  testimonialsTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 900,
  },
  testimonialsGrid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },
  reviewCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 14,
    border: "1px solid #eee",
    minHeight: 150,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  starsRow: {
    display: "flex",
    gap: 2,
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 12,
    lineHeight: "16px",
    color: "#111",
    opacity: 0.9,
    marginBottom: 10,
  },
  reviewMore: {
    fontSize: 12,
    textDecoration: "underline",
    opacity: 0.75,
    marginBottom: 10,
    alignSelf: "flex-start",
    color: "#111",
  },
  reviewerRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  reviewerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "#111",
    color: "#fff",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.85,
  },

  /* FAQ */
  faqWrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px 20px 70px",
  },
  faqInner: {
    maxWidth: 900,
    margin: "0 auto",
  },
  faqTitle: {
    margin: "0 0 14px 0",
    fontSize: 16,
    fontWeight: 900,
  },
  faqList: {
    display: "grid",
    gap: 10,
  },
  faqRow: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "10px 0",
    borderBottom: "1px solid #e9e9e9",
  },
  faqRowTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  faqQ: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111",
  },
  faqChevron: {
    fontSize: 14,
    opacity: 0.7,
  },
  faqA: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: "18px",
    color: "#444",
    maxWidth: 820,
  },
};
