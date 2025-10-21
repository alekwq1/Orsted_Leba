import React, { useEffect, useState } from "react";

type Props = {
  userGlbUrl: string | null;
  showUserGlb: boolean;
  setShowUserGlb: React.Dispatch<React.SetStateAction<boolean>>;
  setUserGlbUrl: React.Dispatch<React.SetStateAction<string | null>>;
  userGlbPos: [number, number, number];
  setUserGlbPos: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  /** W APLIKACJI trzymamy STOPNIE */
  userGlbRot: [number, number, number]; // degrees
  setUserGlbRot: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  userGlbScale: [number, number, number];
  setUserGlbScale: React.Dispatch<
    React.SetStateAction<[number, number, number]>
  >;
  isMobile: boolean;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const UserGlbUploadPanel: React.FC<Props> = ({
  userGlbUrl,
  showUserGlb,
  setShowUserGlb,
  setUserGlbUrl,
  userGlbPos,
  setUserGlbPos,
  userGlbRot, // <-- DEGREES
  setUserGlbRot, // <-- DEGREES
  userGlbScale,
  setUserGlbScale,
  isMobile,
}) => {
  // Lokalne inputy rotacji (string), żeby nie tracić kursora podczas wpisywania
  const [degInputs, setDegInputs] = useState<[string, string, string]>([
    "0",
    "0",
    "0",
  ]);
  const [editingAxis, setEditingAxis] = useState<null | 0 | 1 | 2>(null);

  // KROK rotacji (domyślnie 1°, możesz wpisać np. 2.2)
  const [rotStep, setRotStep] = useState<number>(1);

  // Sync z rodzica tylko gdy NIE edytujemy
  useEffect(() => {
    if (editingAxis !== null) return;
    setDegInputs([
      String(userGlbRot[0]),
      String(userGlbRot[1]),
      String(userGlbRot[2]),
    ]);
  }, [userGlbRot, editingAxis]);

  const handleDegChange = (ax: 0 | 1 | 2, newStr: string) => {
    setDegInputs((prev) => {
      const copy = [...prev] as [string, string, string];
      copy[ax] = newStr;
      return copy;
    });

    const parsed = Number(newStr.replace(",", "."));
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      const c = clamp(parsed, -360, 360);
      setUserGlbRot((prev) => {
        const next = [...prev] as [number, number, number];
        next[ax] = c; // <-- STOPNIE do stanu rodzica
        return next;
      });
    }
  };

  const handleDegBlur = (ax: 0 | 1 | 2) => {
    setEditingAxis(null);
    const val = degInputs[ax].trim();
    const parsed = Number(val.replace(",", "."));
    if (val === "" || Number.isNaN(parsed)) {
      // wróć do wartości z propsów (stopnie)
      setDegInputs((prev) => {
        const copy = [...prev] as [string, string, string];
        copy[ax] = String(userGlbRot[ax]);
        return copy;
      });
      return;
    }
    const c = clamp(parsed, -360, 360);
    // ujednolicenie UI do "czystej" liczby (bez wymuszonego zaokrąglania)
    setDegInputs((prev) => {
      const copy = [...prev] as [string, string, string];
      copy[ax] = String(c);
      return copy;
    });
    // dopnij stan rodzica (gdy ktoś wpisał poza zakresem)
    setUserGlbRot((prev) => {
      const next = [...prev] as [number, number, number];
      next[ax] = c;
      return next;
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        left: isMobile ? 8 : 24,
        top: isMobile ? 70 : 90,
        zIndex: 92,
        background: "#f5faff",
        borderRadius: 10,
        padding: "14px 22px",
        boxShadow: "0 2px 12px #bbb7",
        display: "flex",
        flexDirection: "column",
        gap: 9,
        minWidth: 260,
      }}
    >
      <input
        type="file"
        accept=".glb"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUserGlbUrl(URL.createObjectURL(file));
          setShowUserGlb(true);
          setUserGlbPos([0, 0, 0]);
          setUserGlbRot([0, 0, 0]); // stopnie
          setUserGlbScale([1, 1, 1]);
          setDegInputs(["0", "0", "0"]);
        }}
        style={{
          width: 200,
          background: "#fff",
          border: "1px solid #bbb",
          borderRadius: 8,
          fontSize: 15,
          marginBottom: 2,
        }}
      />

      {userGlbUrl && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setShowUserGlb((v) => !v)}
              style={{
                background: showUserGlb ? "#16a34a" : "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "4px 14px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {showUserGlb ? "Hide" : "Show"}
            </button>
          </div>

          {/* POSITION */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 13, color: "#2261c5" }}>XYZ:</span>
            {[0, 1, 2].map((ax) => (
              <input
                key={ax}
                type="number"
                value={userGlbPos[ax]}
                step={0.1}
                style={{ width: 70, marginLeft: 2 }}
                onChange={(e) =>
                  setUserGlbPos(
                    userGlbPos.map((v, i) =>
                      i === ax ? parseFloat(e.target.value) : v
                    ) as [number, number, number]
                  )
                }
                title={`Position ${["X", "Y", "Z"][ax]}`}
              />
            ))}
          </div>

          {/* ROTATION – STOPNIE, krok konfigurowalny */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 13, color: "#2261c5" }}>Rot (°):</span>
            {(["X", "Y", "Z"] as const).map((label, idx) => (
              <input
                key={label}
                type="number"
                inputMode="decimal"
                value={degInputs[idx as 0 | 1 | 2]}
                onChange={(e) =>
                  handleDegChange(idx as 0 | 1 | 2, e.target.value)
                }
                onFocus={() => setEditingAxis(idx as 0 | 1 | 2)}
                onBlur={() => handleDegBlur(idx as 0 | 1 | 2)}
                step={rotStep} // <-- tutaj ustawiamy krok (np. 2.2)
                min={-360}
                max={360}
                style={{ width: 70, marginLeft: 2 }}
                title={`Rotation ${label} (degrees)`}
              />
            ))}
          </div>

          {/* Ustawienie kroku (np. 2.2) */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#555" }}>Step (°):</span>
            <input
              type="number"
              inputMode="decimal"
              value={rotStep}
              step={0.1}
              min={0.1}
              max={360}
              onChange={(e) => {
                const v = Number(e.target.value.replace(",", "."));
                if (!Number.isNaN(v) && v > 0) setRotStep(v);
              }}
              style={{ width: 70 }}
              title="Rotation step in degrees"
            />
          </div>

          {/* SCALE */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 13, color: "#2261c5" }}>Scale:</span>
            {[0, 1, 2].map((ax) => (
              <input
                key={ax}
                type="number"
                value={userGlbScale[ax]}
                step={0.01}
                min={0.01}
                max={99}
                style={{ width: 70, marginLeft: 2 }}
                onChange={(e) =>
                  setUserGlbScale(
                    userGlbScale.map((v, i) =>
                      i === ax ? parseFloat(e.target.value) : v
                    ) as [number, number, number]
                  )
                }
                title={`Scale ${["X", "Y", "Z"][ax]}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserGlbUploadPanel;
