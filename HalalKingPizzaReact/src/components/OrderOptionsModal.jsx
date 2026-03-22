import { useEffect } from "react";

export default function OrderOptionsModal({ open, onClose }) {
  const uber = import.meta.env.VITE_UBER_EATS_URL;
  const doorDash = import.meta.env.VITE_DOORDASH_URL;
  const grubhub = import.meta.env.VITE_GRUBHUB_URL;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);

    // lock body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  function openLink(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose?.();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: "100%",
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 18, lineHeight: "22px" }}>
              Order Online
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: "#666" }}>
              Choose a delivery service
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 800,
            }}
            type="button"
          >
            Close
          </button>
        </div>

        <div style={{ padding: 18, display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={() => openLink(uber)}
            disabled={!uber}
            style={btnStyle(!!uber)}
          >
            Uber Eats
          </button>

          <button
            type="button"
            onClick={() => openLink(doorDash)}
            disabled={!doorDash}
            style={btnStyle(!!doorDash)}
          >
            DoorDash
          </button>

          <button
            type="button"
            onClick={() => openLink(grubhub)}
            disabled={!grubhub}
            style={btnStyle(!!grubhub)}
          >
            Grubhub
          </button>

          {!uber || !doorDash || !grubhub ? (
            <div style={{ marginTop: 6, fontSize: 12, color: "#888", lineHeight: "16px" }}>
              One or more links are missing. Add them in your <code>.env</code> and restart the dev
              server.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function btnStyle(enabled) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e7e7e7",
    background: enabled ? "#111" : "#f3f3f3",
    color: enabled ? "#fff" : "#888",
    fontWeight: 900,
    cursor: enabled ? "pointer" : "not-allowed",
    textAlign: "center",
  };
}