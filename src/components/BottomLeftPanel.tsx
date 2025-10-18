import React from "react";

type Props = {
  setShowHowToUse: (v: boolean) => void;
  showInfoPoints: boolean;
  setShowInfoPoints: (v: boolean | ((v: boolean) => boolean)) => void;
  setShowAddModal: (v: boolean) => void;
  isMobile: boolean;
  /** NEW: pokazuje „Add InfoPoint” tylko w trybie edycji */
  editMode: boolean;
};

const BottomLeftPanel: React.FC<Props> = ({
  setShowHowToUse,
  showInfoPoints,
  setShowInfoPoints,
  setShowAddModal,
  isMobile,
  editMode,
}) => (
  <div
    style={{
      position: "fixed",
      left: 16,
      bottom: 16,
      zIndex: 90,
      display: "flex",
      gap: 8,
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
    }}
  >
    <button
      style={{
        background: "#2190e3",
        borderRadius: 10,
        color: "white",
        fontWeight: 600,
        fontSize: 13,
        padding: "8px 22px",
        border: "none",
        cursor: "pointer",
        letterSpacing: "0.2px",
      }}
      onClick={() => setShowHowToUse(true)}
    >
      ℹ️ How to use?
    </button>

    <button
      style={{
        background: showInfoPoints ? "#2190e3" : "#bbb",
        borderRadius: 10,
        color: "white",
        fontWeight: 600,
        fontSize: 13,
        padding: "8px 18px",
        border: "none",
        cursor: "pointer",
        letterSpacing: "0.2px",
      }}
      onClick={() =>
        setShowInfoPoints((v) => (typeof v === "boolean" ? !v : false))
      }
    >
      {showInfoPoints ? "❌ Hide info points" : "👁️‍🗨️ Show info points"}
    </button>

    {/* NEW: ten przycisk jest widoczny wyłącznie w trybie edycji */}
    {editMode && (
      <button
        style={{
          background: "#1d8af2",
          borderRadius: 10,
          color: "white",
          fontWeight: 600,
          fontSize: 13,
          padding: "8px 22px",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.2px",
        }}
        onClick={() => setShowAddModal(true)}
      >
        ➕ Add InfoPoint
      </button>
    )}
  </div>
);

export default BottomLeftPanel;
