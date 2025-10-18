import { useState, useRef, useEffect, useCallback, useId } from "react";

export type InfoPointGroupsDropdownProps = {
  groups: { label: string; visible: boolean; count?: number }[];
  onToggleVisible: (index: number) => void;
  onShowAll: () => void;
  onHideAll: () => void;
};

export default function InfoPointGroupsDropdown({
  groups,
  onToggleVisible,
  onShowAll,
  onHideAll,
}: InfoPointGroupsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const close = useCallback(() => {
    setIsOpen(false);
    btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        style={{
          background: "#1971c2",
          color: "#fff",
          fontWeight: 700,
          border: "none",
          borderRadius: 9,
          padding: "7px 14px",
          cursor: "pointer",
          boxShadow: "0 2px 8px #0002",
        }}
        title="Manage the visibility of InfoPoint groups"
      >
        🏷️ Groups
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="InfoPoint groups management"
          style={{
            position: "absolute",
            right: 0,
            top: "120%",
            zIndex: 10002,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 30px #0003",
            padding: 10,
            minWidth: 260,
            border: "1px solid #e9ecef",
          }}
        >
          {/* Akcje zbiorcze */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button
              role="menuitem"
              onClick={onShowAll}
              style={{
                background: "#0ca678",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Show all groups"
            >
              Show all
            </button>
            <button
              role="menuitem"
              onClick={onHideAll}
              style={{
                background: "#e03131",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Hide all groups"
            >
              Hide all
            </button>
          </div>

          {/* Lista grup */}
          <div
            role="group"
            aria-label="Lista grup"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {groups.map((g, i) => (
              <div
                key={g.label + i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "1px solid #f1f3f5",
                  background: "#fff",
                }}
              >
                {/* Przełącznik widoczności */}
                <button
                  role="menuitemcheckbox"
                  aria-checked={g.visible}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisible(i);
                  }}
                  title={g.visible ? "Hide group" : "Show group"}
                  style={{
                    width: 24,
                    height: 18,
                    borderRadius: 4,
                    border: "1px solid #dee2e6",
                    background: g.visible ? "#2f9e44" : "#e9ecef",
                    boxShadow: g.visible ? "inset 0 0 0 2px #ffffffaa" : "none",
                    cursor: "pointer",
                  }}
                />

                {/* Nazwa grupy */}
                <span
                  title={g.visible ? "Grupa widoczna" : "Grupa ukryta"}
                  style={{
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#185c92",
                    userSelect: "none",
                  }}
                >
                  {g.label}
                </span>

                {/* Liczba elementów w grupie */}
                <span
                  aria-live="polite"
                  style={{
                    fontSize: 12,
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: g.visible ? "#d3f9d8" : "#f1f3f5",
                    color: g.visible ? "#2b8a3e" : "#5c677d",
                    border: "1px solid #e9ecef",
                    whiteSpace: "nowrap",
                  }}
                >
                  {typeof g.count === "number" ? `${g.count}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
