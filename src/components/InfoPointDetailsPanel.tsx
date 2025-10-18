import { useState, useEffect } from "react";
import { InfoPointData } from "../utils/types";
import { resolvePublicUrl } from "../utils/paths";

type Props = {
  infoPoint: InfoPointData;
  editMode: boolean;
  onRequestEditMode: () => void;
  onSave: (updated: InfoPointData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  getCurrentCameraPosition: () => [number, number, number];
  focusCameraOn: (
    cameraPos: [number, number, number],
    targetPos: [number, number, number]
  ) => void;
  onRequestSetPosition?: (cb: (pos: [number, number, number]) => void) => void;
};

export default function InfoPointDetailsPanel({
  infoPoint,
  editMode,
  onRequestEditMode,
  onSave,
  onDelete,
  onClose,
  getCurrentCameraPosition,
  focusCameraOn,
  onRequestSetPosition,
}: Props) {
  const [label, setLabel] = useState(infoPoint.label);
  const [icon, setIcon] = useState(infoPoint.icon);
  const [content, setContent] = useState(infoPoint.content);
  const [position, setPosition] = useState<[number, number, number]>([
    ...infoPoint.position,
  ]);
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number] | undefined
  >(infoPoint.cameraPosition ? [...infoPoint.cameraPosition] : undefined);

  // obrazek
  const [imageUrl, setImageUrl] = useState<string>(infoPoint.imageUrl || "");
  const [imageAlt, setImageAlt] = useState<string>(infoPoint.imageAlt || "");

  useEffect(() => {
    setLabel(infoPoint.label);
    setIcon(infoPoint.icon);
    setContent(infoPoint.content);
    setPosition([...infoPoint.position]);
    setCameraPosition(
      infoPoint.cameraPosition ? [...infoPoint.cameraPosition] : undefined
    );
    setImageUrl(infoPoint.imageUrl || "");
    setImageAlt(infoPoint.imageAlt || "");
  }, [infoPoint, editMode]);

  useEffect(() => {
    if (editMode) {
      focusCameraOn(
        cameraPosition
          ? cameraPosition
          : ([...position] as [number, number, number]),
        [...position] as [number, number, number]
      );
    }
    // eslint-disable-next-line
  }, [position, cameraPosition, editMode]);

  const roundArray = (arr?: [number, number, number]) =>
    arr ? arr.map((v) => Number(v.toFixed(1))) : undefined;

  const handleSetCameraPosition = () => {
    const pos = getCurrentCameraPosition();
    setCameraPosition([pos[0], pos[1], pos[2]]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !icon || !content) return;

    // normalizacja: usuwamy wiodące "/" żeby ścieżka była względna do public/
    const normalizedImage = imageUrl.trim().replace(/^\/+/, "");

    const updated: InfoPointData = {
      ...infoPoint,
      label,
      icon,
      content,
      position,
      cameraPosition,
      imageUrl: normalizedImage || undefined,
      imageAlt: imageAlt.trim() || undefined,
    };
    onSave(updated);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        background: "#fff",
        borderRadius: "18px 0 0 18px",
        boxShadow: "0 4px 24px #0002",
        padding: "28px 22px 28px 18px",
        minWidth: 310,
        maxWidth: 355,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <button
        onClick={onClose}
        style={{
          alignSelf: "flex-end",
          border: "none",
          background: "none",
          fontSize: 19,
          color: "#b2b2b2",
          cursor: "pointer",
          marginBottom: -12,
        }}
        title="Zamknij"
      >
        ✖
      </button>

      {/* GÓRA: Tryb edycji */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {!editMode ? (
          <button
            onClick={onRequestEditMode}
            style={{
              background: "#e5f2fd",
              color: "#228be6",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              padding: "6px 18px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Tryb edycji
          </button>
        ) : (
          <span
            style={{
              color: "#228be6",
              fontWeight: 600,
              fontSize: 14,
              marginRight: 4,
            }}
          >
            Tryb edycji
          </span>
        )}
      </div>

      {/* PODGLĄD (gdy nie edycja) */}
      {!editMode ? (
        <>
          <div style={{ fontSize: 35, textAlign: "center", marginBottom: -6 }}>
            {infoPoint.icon}
          </div>
          <div style={{ fontWeight: 700, fontSize: 19, color: "#1971c2" }}>
            {infoPoint.label}
          </div>

          {infoPoint.imageUrl && (
            <img
              src={resolvePublicUrl(infoPoint.imageUrl)}
              alt={infoPoint.imageAlt || infoPoint.label}
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).style.display = "none")
              }
              loading="lazy"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                margin: "8px 0 6px",
              }}
            />
          )}

          <div
            style={{ color: "#34495e", fontSize: 15, whiteSpace: "pre-line" }}
          >
            {infoPoint.content}
          </div>
          <div style={{ color: "#adb5bd", fontSize: 13 }}>
            Pozycja: <b>{roundArray(infoPoint.position)?.join(", ")}</b>
          </div>
          {infoPoint.cameraPosition && (
            <div style={{ color: "#adb5bd", fontSize: 13 }}>
              Pozycja kamery:{" "}
              <b>{roundArray(infoPoint.cameraPosition)?.join(", ")}</b>
            </div>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSave}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 11,
            alignItems: "stretch",
          }}
        >
          <input
            type="text"
            placeholder="Tytuł / label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{
              fontSize: 15,
              borderRadius: 7,
              padding: "7px 10px",
              border: "1px solid #ccc",
              marginBottom: 1,
            }}
            required
          />
          <input
            type="text"
            placeholder="Emoji / Ikona (np. 🚧)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            style={{
              fontSize: 15,
              borderRadius: 7,
              padding: "7px 10px",
              border: "1px solid #ccc",
              marginBottom: 1,
            }}
            required
          />

          {/* Pola obrazu */}
          <input
            type="url"
            placeholder="Adres URL zdjęcia (opcjonalnie)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{
              fontSize: 14,
              borderRadius: 7,
              padding: "7px 10px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Opis ALT zdjęcia (opcjonalnie)"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            style={{
              fontSize: 14,
              borderRadius: 7,
              padding: "7px 10px",
              border: "1px solid #ccc",
            }}
          />

          <textarea
            placeholder="Treść info (opis, wskazówki)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              fontSize: 14,
              borderRadius: 7,
              padding: "7px 10px",
              border: "1px solid #ccc",
            }}
            required
          />

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#2261c5" }}>XYZ:</span>
            {[0, 1, 2].map((ax) => (
              <input
                key={ax}
                type="number"
                step={0.1}
                value={position[ax]}
                style={{ width: 46, fontSize: 13 }}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setPosition(
                    (pos) =>
                      pos.map((v, i) => (i === ax ? val : v)) as [
                        number,
                        number,
                        number
                      ]
                  );
                }}
                title={["X", "Y", "Z"][ax]}
                required
              />
            ))}
            <button
              type="button"
              style={{
                background: "#13b493",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "5px 9px",
                fontWeight: 600,
                marginLeft: 4,
                cursor: "pointer",
                fontSize: 13,
                letterSpacing: 0.3,
              }}
              title="Wskaż miejsce na scenie"
              onClick={() => {
                if (typeof onRequestSetPosition === "function") {
                  onRequestSetPosition((newPos) => setPosition(newPos));
                }
              }}
            >
              🎯 Wskaż na scenie
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#2261c5" }}>
              Pozycja kamery:
            </span>
            {[0, 1, 2].map((ax) => (
              <input
                key={ax}
                type="number"
                step={0.1}
                value={cameraPosition ? cameraPosition[ax] : ""}
                style={{ width: 46, fontSize: 13 }}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCameraPosition(
                    (cam) =>
                      (cam
                        ? cam.map((v, i) => (i === ax ? val : v))
                        : [0, 0, 0].map((v, i) => (i === ax ? val : v))) as [
                        number,
                        number,
                        number
                      ]
                  );
                }}
                title={["X", "Y", "Z"][ax]}
              />
            ))}
            <button
              type="button"
              onClick={handleSetCameraPosition}
              style={{
                fontSize: 12,
                marginLeft: 5,
                background: "#e7f2fd",
                color: "#2261c5",
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
              }}
              tabIndex={-1}
            >
              Ustaw z kamery
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button
              type="submit"
              style={{
                background: "#2190e3",
                color: "white",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 8,
                border: "none",
                padding: "7px 15px",
                cursor: "pointer",
              }}
            >
              Zapisz
            </button>
            <button
              type="button"
              onClick={() => onDelete(infoPoint.id)}
              style={{
                background: "#ffebeb",
                color: "#d81818",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 8,
                border: "none",
                padding: "7px 13px",
                cursor: "pointer",
                marginLeft: 2,
              }}
            >
              Usuń punkt
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#f2f4f7",
                color: "#333",
                fontSize: 14,
                borderRadius: 7,
                border: "none",
                padding: "7px 13px",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Zamknij
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
