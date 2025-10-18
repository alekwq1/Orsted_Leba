import { useState } from "react";

export type ModelsDropdownProps = {
  models: { label: string; visible: boolean }[];
  onToggleVisible: (index: number) => void;
  onShowAll: () => void;
  onHideAll: () => void;
};

export default function ModelsDropdown({
  models,
  onToggleVisible,
  onShowAll,
  onHideAll,
}: ModelsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Przycisk otwierający dropdown modeli */}
      <button
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
        title="Zarządzaj widocznością modeli GLB"
      >
        📦 Modele
      </button>

      {/* Menu rozwijane */}
      {isOpen && (
        <div
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
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Akcje zbiorcze */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => {
                onShowAll();
                setIsOpen(false);
              }}
              style={{
                background: "#0ca678",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Pokaż wszystkie modele"
            >
              Pokaż wszystkie
            </button>
            <button
              onClick={() => {
                onHideAll();
                setIsOpen(false);
              }}
              style={{
                background: "#e03131",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Ukryj wszystkie modele"
            >
              Ukryj wszystkie
            </button>
          </div>

          {/* Lista modeli */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {models.map((m, i) => (
              <div
                key={m.label + i}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisible(i);
                  }}
                  title={
                    m.visible ? "Kliknij, aby ukryć" : "Kliknij, aby pokazać"
                  }
                  style={{
                    width: 24,
                    height: 18,
                    borderRadius: 4,
                    border: "1px solid #dee2e6",
                    background: m.visible ? "#2f9e44" : "#e9ecef",
                    boxShadow: m.visible ? "inset 0 0 0 2px #ffffffaa" : "none",
                    cursor: "pointer",
                  }}
                />

                {/* Nazwa modelu (informacyjnie) */}
                <span
                  title={m.visible ? "Model widoczny" : "Model ukryty"}
                  style={{
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#185c92",
                    userSelect: "none",
                  }}
                >
                  {m.label}
                </span>

                {/* Status */}
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: m.visible ? "#d3f9d8" : "#f1f3f5",
                    color: m.visible ? "#2b8a3e" : "#5c677d",
                    border: "1px solid #e9ecef",
                  }}
                >
                  {m.visible ? "widoczny" : "ukryty"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
