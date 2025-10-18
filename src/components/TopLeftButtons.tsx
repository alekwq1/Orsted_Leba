import React from "react";
import type { GLBModelSettings } from "../App"; // <- ścieżka do pliku z typem

type Props = {
  showIFC: boolean;
  setShowIFC: React.Dispatch<React.SetStateAction<boolean>>;
  glbModels: GLBModelSettings[];
  setGlbModels: React.Dispatch<React.SetStateAction<GLBModelSettings[]>>;
  setUserGlbParamsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

export default function TopLeftButtons({
  showIFC,
  setShowIFC,
  glbModels,
  setGlbModels,
  setUserGlbParamsOpen,
  isMobile,
}: Props) {
  // Czy chociaż jeden model jest widoczny?
  const anyGlbVisible = glbModels.some((m) => m.visible);

  return (
    <div
      style={{
        position: "fixed",
        left: isMobile ? 8 : 24,
        top: isMobile ? 8 : 24,
        zIndex: 91,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* IFC toggle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          title={showIFC ? "Hide IFC model" : "Show IFC model"}
          style={{
            background: showIFC ? "#0ea5e9" : "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 45,
            height: 45,
            fontSize: 27,
            boxShadow: "0 2px 8px rgba(33,140,227,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => setShowIFC((v) => !v)}
        >
          🏗️
        </button>
        <span
          style={{
            fontSize: 13,
            color: "#1d3a55",
            marginTop: 4,
            fontWeight: 500,
            letterSpacing: 0.3,
            userSelect: "none",
          }}
        >
          IFC
        </span>
      </div>

      {/* GLB –jednym przyciskiem pokazujesz/ukrywasz wszystkie glbModels */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          title={anyGlbVisible ? "Hide all GLB" : "Show all GLB"}
          style={{
            background: anyGlbVisible ? "#16a34a" : "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 45,
            height: 45,
            fontSize: 27,
            boxShadow: "0 2px 8px rgba(33,140,227,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => {
            setGlbModels((models) =>
              models.map((m) => ({ ...m, visible: !anyGlbVisible }))
            );
          }}
        >
          🏢
        </button>
        <span
          style={{
            fontSize: 13,
            color: "#1d3a55",
            marginTop: 4,
            fontWeight: 500,
            letterSpacing: 0.3,
            userSelect: "none",
          }}
        >
          GLB
        </span>
      </div>

      {/* User GLB upload */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          title="Upload GLB"
          style={{
            background: "#2190e3",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 45,
            height: 45,
            fontSize: 27,
            boxShadow: "0 2px 8px rgba(33,140,227,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => setUserGlbParamsOpen((o) => !o)}
        >
          📦
        </button>
        <span
          style={{
            fontSize: 13,
            color: "#1d3a55",
            marginTop: 4,
            fontWeight: 500,
            letterSpacing: 0.3,
            userSelect: "none",
          }}
        >
          Upload
        </span>
      </div>
    </div>
  );
}
