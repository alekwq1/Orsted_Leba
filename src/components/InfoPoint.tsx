import { Html } from "@react-three/drei";
import { useState } from "react";
import { InfoPointData } from "../utils/types";
import { resolvePublicUrl } from "../utils/paths"; // ⬅️ DODAJ

type InfoPointProps = {
  point: InfoPointData;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
};

export function InfoPoint({
  point,
  isActive,
  onClick,
  onClose,
}: InfoPointProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <Html position={point.position} center>
      {/* Marker */}
      <div
        style={{
          background: "rgba(33, 140, 227, 0.9)",
          borderRadius: "50%",
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white",
          fontSize: 24,
          transition: "transform 0.18s cubic-bezier(.33,1.81,.73,.98)",
          transform: isActive ? "scale(1.23)" : "scale(1)",
          boxShadow: isActive
            ? "0 0 0 4px rgba(33,140,227,0.23)"
            : "0 2px 12px rgba(33,140,227,0.1)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        title={point.label}
      >
        {point.icon}
      </div>

      {/* Dymek */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            borderRadius: 14,
            padding: "1.2rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            width: 280,
            zIndex: 10,
            animation: "fadeIn .28s cubic-bezier(.47,2,.41,.92)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <span style={{ fontSize: 22, marginRight: 8 }}>{point.icon}</span>
            <b style={{ fontSize: 16, color: "#2261c5" }}>{point.label}</b>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                marginLeft: "auto",
                fontSize: 22,
                color: "#2261c5",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Zamknij dymek"
              title="Zamknij"
            >
              ×
            </button>
          </div>

          {/* ZDJĘCIE */}
          {point.imageUrl && (
            <img
              src={resolvePublicUrl(point.imageUrl)} // ⬅️ też tutaj
              alt={point.imageAlt || point.label}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              loading="lazy"
              style={{
                width: "300px", // ⬅️ stała szerokość
                height: "auto", // ⬅️ wysokość dopasuje się proporcjonalnie
                objectFit: "cover",
                borderRadius: 10,
                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                marginBottom: 10,
                cursor: "zoom-in",
              }}
              onClick={() => setShowFullImage(true)}
            />
          )}

          {/* Opis */}
          <div style={{ color: "#444", whiteSpace: "pre-line", fontSize: 14 }}>
            {point.content}
          </div>

          {/* Lightbox */}
          {showFullImage && point.imageUrl && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
              onClick={() => setShowFullImage(false)}
            >
              <img
                src={point.imageUrl}
                alt={point.imageAlt || point.label}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}
              />
            </div>
          )}
        </div>
      )}
    </Html>
  );
}
export default InfoPoint;
