import {
  Suspense,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, CameraControls } from "@react-three/drei";

import IFCModel, { IFCElementProperties } from "./components/IFCModel";
import HowToUseModal from "./components/HowToUseModal";
import LoadingOverlay from "./components/LoadingOverlay";
import CameraControlsButtons from "./components/CameraControlsButtons";
import AddInfoPointModal from "./components/AddInfoPointModal";
import GLBModel from "./components/GLBModel";
import TopLeftButtons from "./components/TopLeftButtons";
import UserGlbUploadPanel from "./components/UserGlbUploadPanel";
import PasswordScreen from "./components/PasswordScreen";
import BottomLeftPanel from "./components/BottomLeftPanel";
import InfoPointCanvasGroup from "./components/InfoPointCanvasGroup";
import InfoPointDetailsPanel from "./components/InfoPointDetailsPanel";
import IFCPropertiesPanel from "./components/IFCPropertiesPanel";
import PlaneClickCatcher from "./components/PlaneClickCatcher";
import OrgChartModal from "./components/OrgChartModal";
import ModelsDropdown from "./components/ModelsDropdown";

// Dropdowny
import SplatDropdown from "./components/SplatDropdown";
import InfoPointGroupsDropdown from "./components/InfoPointGroupsDropdown";

// Instancja splata z cache
import SplatInstance, { SplatCacheUtils } from "./components/SplatInstance";

import { useInfoPoints } from "./hooks/useInfoPoints";
import { useCameraControls } from "./hooks/useCameraControls";
import { useCameraWASD } from "./hooks/useCameraWASD";
// ⬇ jedno wywołanie useAuth
import { useAuth } from "./hooks/useAuth";
import { InfoPointData } from "./utils/types";
import { isMobile, getInfoPanelStyle } from "./utils/helpers";

export type GLBModelSettings = {
  url: string;
  label: string;
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number]; // radians
  scale?: [number, number, number];
};

// Konfiguracja wielu splatów
export type SplatSettings = {
  url: string;
  label: string;
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number]; // radians
  scale?: [number, number, number];
  maxSplats?: number;
};

// helpers
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const degArrayToRad = ([x, y, z]: [number, number, number]): [
  number,
  number,
  number
] => [degToRad(x), degToRad(y), degToRad(z)];

// NORMALIZACJA importu InfoPointów (wspiera stare JSON-y)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeInfoPoints = (arr: any[]): InfoPointData[] =>
  (Array.isArray(arr) ? arr : []).map((p) => ({
    ...p,
    imageUrl: typeof p.imageUrl === "string" ? p.imageUrl : undefined,
    imageAlt: typeof p.imageAlt === "string" ? p.imageAlt : undefined,
    cameraPosition: Array.isArray(p.cameraPosition)
      ? [
          Number(p.cameraPosition[0] || 0),
          Number(p.cameraPosition[1] || 0),
          Number(p.cameraPosition[2] || 0),
        ]
      : undefined,
    position: Array.isArray(p.position)
      ? [
          Number(p.position[0] || 0),
          Number(p.position[1] || 0),
          Number(p.position[2] || 0),
        ]
      : [0, 0, 0],
    group:
      typeof p.group === "string" && p.group.trim()
        ? p.group.trim()
        : "default",
  })) as InfoPointData[];

function App() {
  // ---- Obsługa "Wskaż na scenie"
  const [waitingForPosition, setWaitingForPosition] = useState<
    null | ((pos: [number, number, number]) => void)
  >(null);
  const [showOrgChart, setShowOrgChart] = useState(false);

  // GLB
  const [glbModels, setGlbModels] = useState<GLBModelSettings[]>([
    {
      url: "/models/building.glb",
      label: "PZPB",
      visible: false,
      position: [-66, 1.7, 30.35],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      url: "/models/building1.glb",
      label: "PZT",
      visible: false,
      position: [34.05, 0, -8.4],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      url: "/models/building2.glb",
      label: "Wycinka",
      visible: false,
      position: [7, 0, 31.78],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      url: "/models/building3.glb",
      label: "Sieci",
      visible: false,
      position: [7.9, 1.7, 26.4],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      url: "/models/building4.glb",
      label: "Wykop",
      visible: false,
      position: [31.2, 1.2, 6.76],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      url: "/models/building5.glb",
      label: "Całość",
      visible: false,
      position: [7.9, 1.75, 26.4],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ]);

  // SPLATY – lista wielu .splat (możesz dodać kolejne)
  const [splats, setSplats] = useState<SplatSettings[]>([
    {
      label: "15.10.2025",
      url: "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Orsted_15102025.splat",
      visible: true,
      position: [-2.5, 13, -0.78],
      rotation: degArrayToRad([-0.0, 68.8, -0.9]),
      scale: [21.86, 24, 21.86],
      maxSplats: isMobile() ? 5_000_000 : 10_000_000,
    },
    {
      label: "15.10.2025 (changed)",
      url: "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Orsted_15102025_changed.splat",
      visible: false,
      position: [-2.5, 13, -0.78],
      rotation: degArrayToRad([-0.0, 68.8, -0.9]),
      scale: [21.86, 24, 21.86],
      maxSplats: isMobile() ? 5_000_000 : 10_000_000,
    },
  ]);

  // InfoPointy
  const {
    infoPoints,
    addInfoPoint,
    editInfoPoint,
    deleteInfoPoint,
    setInfoPoints,
  } = useInfoPoints();

  // Grupy InfoPointów (mapa widoczności)
  const initialGroups = useMemo(() => {
    const g = new Map<string, boolean>();
    for (const p of infoPoints) {
      const key = p.group?.trim() || "default";
      if (!g.has(key)) g.set(key, true);
    }
    return g;
  }, [infoPoints]);

  const [groupVisibility, setGroupVisibility] =
    useState<Map<string, boolean>>(initialGroups);

  useEffect(() => {
    setGroupVisibility((prev) => {
      const next = new Map(prev);
      for (const p of infoPoints) {
        const key = p.group?.trim() || "default";
        if (!next.has(key)) next.set(key, true);
      }
      return next;
    });
  }, [infoPoints]);

  const visibleInfoPoints = useMemo(() => {
    if (!groupVisibility || groupVisibility.size === 0) return infoPoints;
    return infoPoints.filter((p) => {
      const key = p.group?.trim() || "default";
      return groupVisibility.get(key) !== false;
    });
  }, [infoPoints, groupVisibility]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showIFC, setShowIFC] = useState(false);
  const [ifcProperties, setIfcProperties] =
    useState<IFCElementProperties | null>(null);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfoPoints, setShowInfoPoints] = useState(true);
  const [showPublicGlb] = useState(false);
  const [userGlbUrl, setUserGlbUrl] = useState<string | null>(null);
  const [showUserGlb, setShowUserGlb] = useState(true);
  const [userGlbParamsOpen, setUserGlbParamsOpen] = useState(false);
  const [userGlbPos, setUserGlbPos] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [userGlbRot, setUserGlbRot] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [userGlbScale, setUserGlbScale] = useState<[number, number, number]>([
    1, 1, 1,
  ]);
  const [hideUI, setHideUI] = useState(false);

  // Tryb edycji i hasło
  const [editMode, setEditMode] = useState(false);
  const [askPassword, setAskPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const EDIT_PASSWORD = "2222";

  // InfoPoint do podglądu (dymek)
  const [previewInfoPointId, setPreviewInfoPointId] = useState<string | null>(
    null
  );

  // InfoPoint do edycji (panel po prawej)
  const [editingInfoPointId, setEditingInfoPointId] = useState<string | null>(
    null
  );
  const editingPoint = infoPoints.find((p) => p.id === editingInfoPointId);

  // CameraControls ref
  const cameraControls = useRef<
    import("@react-three/drei").CameraControls | null
  >(null);

  const resetCamera = () => {
    cameraControls.current?.setLookAt(
      isMobile() ? 90 : 20,
      isMobile() ? 110 : 110,
      isMobile() ? 30 : 7.4,
      0,
      0,
      0,
      true
    );
  };

  // ⬇ jedno wywołanie useAuth (żadnych warunkowych wywołań!)
  const {
    password,
    setPassword,
    isAuthenticated,
    showPasswordError,
    handlePasswordSubmit,
  } = useAuth();

  const cameraHooks = useCameraControls(setEditingInfoPointId);

  useCameraWASD(
    cameraControls,
    isFullscreen,
    cameraHooks.resetCamera,
    () => cameraHooks.toggleFullscreen(setIsFullscreen),
    setEditingInfoPointId
  );

  // Kliknięcie w marker/listę
  const handleInfoPointClick = (id: string) => {
    if (editMode) {
      setEditingInfoPointId(id);
    } else {
      setPreviewInfoPointId(id);
      const point = infoPoints.find((p) => p.id === id);
      if (!point || !cameraControls.current) return;
      if (point.cameraPosition) {
        cameraControls.current.setLookAt(
          point.cameraPosition[0],
          point.cameraPosition[1],
          point.cameraPosition[2],
          point.position[0],
          point.position[1],
          point.position[2],
          true
        );
      } else {
        cameraControls.current.setLookAt(
          point.position[0] + 6,
          point.position[1] + 7,
          point.position[2] + 6,
          point.position[0],
          point.position[1],
          point.position[2],
          true
        );
      }
    }
  };

  // Ustaw kamerę (do panelu edycji)
  const getCurrentCameraPosition = (): [number, number, number] => {
    if (cameraControls.current && cameraControls.current.camera) {
      const { x, y, z } = cameraControls.current.camera.position;
      return [x, y, z];
    }
    return [0, 0, 0];
  };

  // --- WSKAZYWANIE NA SCENIE ---
  const handleRequestSetPosition = useCallback(
    (cb: (pos: [number, number, number]) => void) => {
      setWaitingForPosition(() => cb);
    },
    []
  );

  // --- IMPORT / EKSPORT INFOPOINTÓW ---
  const handleExportInfoPoints = () => {
    const dataToExport = { infoPoints: [...infoPoints] };
    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "infoPoints.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportInfoPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!ev.target) return;
      try {
        const data = JSON.parse(ev.target.result as string);
        if (Array.isArray(data)) {
          setInfoPoints(normalizeInfoPoints(data));
          alert("Zaimportowano punkty (z tablicy)!");
        } else if (data.infoPoints && Array.isArray(data.infoPoints)) {
          setInfoPoints(normalizeInfoPoints(data.infoPoints));
          alert("Zaimportowano punkty!");
        } else {
          alert("Nieprawidłowy plik JSON!");
        }
      } catch {
        alert("Błąd podczas wczytywania pliku JSON!");
      }
    };
    reader.readAsText(file);
  };

  // ========= ZARZĄDZANIE WIDOCZNOŚCIĄ GLB =========
  const showAllGlbs = () =>
    setGlbModels((ms) => ms.map((m) => ({ ...m, visible: true })));
  const hideAllGlbs = () =>
    setGlbModels((ms) => ms.map((m) => ({ ...m, visible: false })));
  const toggleModelVisible = (idx: number) =>
    setGlbModels((ms) =>
      ms.map((m, i) => (i === idx ? { ...m, visible: !m.visible } : m))
    );

  // ========= ZARZĄDZANIE WIDOCZNOŚCIĄ SPLATÓW =========
  const showAllSplats = () =>
    setSplats((ss) => ss.map((s) => ({ ...s, visible: true })));
  const hideAllSplats = () =>
    setSplats((ss) => ss.map((s) => ({ ...s, visible: false })));
  const toggleSplatVisible = (idx: number) =>
    setSplats((ss) =>
      ss.map((s, i) => (i === idx ? { ...s, visible: !s.visible } : s))
    );

  // ========= ZARZĄDZANIE WIDOCZNOŚCIĄ GRUP INFOPOINT =========
  const groupList = useMemo(() => {
    const cnt = new Map<string, number>();
    for (const p of infoPoints) {
      const k = p.group?.trim() || "default";
      cnt.set(k, (cnt.get(k) ?? 0) + 1);
    }
    return Array.from(cnt.entries()).map(([label, count]) => ({
      label,
      count,
      visible: groupVisibility.get(label) !== false,
    }));
  }, [infoPoints, groupVisibility]);

  const toggleGroupVisible = (idx: number) => {
    const g = groupList[idx];
    if (!g) return;
    setGroupVisibility((prev) => {
      const next = new Map(prev);
      next.set(g.label, !g.visible);
      return next;
    });
  };

  const showAllGroups = () =>
    setGroupVisibility((prev) => {
      const next = new Map(prev);
      for (const key of next.keys()) next.set(key, true);
      return next;
    });

  const hideAllGroups = () =>
    setGroupVisibility((prev) => {
      const next = new Map(prev);
      for (const key of next.keys()) next.set(key, false);
      return next;
    });

  // -------- OVERLAY ładowania SPLATÓW (bez useSplatLoader) --------
  const [loadedSplatUrls, setLoadedSplatUrls] = useState<Set<string>>(
    () => new Set()
  );

  const markSplatLoaded = useCallback((url: string) => {
    setLoadedSplatUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  const isAnyVisibleSplatUnloaded = useMemo(() => {
    return splats.some(
      (s) =>
        s.visible &&
        !loadedSplatUrls.has(s.url) &&
        !SplatCacheUtils.isReady(s.url)
    );
  }, [splats, loadedSplatUrls]);

  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    if (isAnyVisibleSplatUnloaded) {
      setOverlay(true);
    } else {
      const t = setTimeout(() => setOverlay(false), 200); // anti-flicker
      return () => clearTimeout(t);
    }
  }, [isAnyVisibleSplatUnloaded]);

  // --- Logowanie (ekran hasła) ---
  if (!isAuthenticated) {
    return (
      <PasswordScreen
        password={password}
        setPassword={setPassword}
        showPasswordError={showPasswordError}
        onSubmit={handlePasswordSubmit}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#dce2e8",
        position: "fixed",
        inset: 0,
        zIndex: 0,
      }}
    >
      {overlay && <LoadingOverlay progress={100} />}

      {/* Overlay jeśli w trybie wskazywania */}
      {waitingForPosition && (
        <div
          style={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1971c2",
            color: "#fff",
            fontWeight: 600,
            fontSize: 17,
            borderRadius: 8,
            padding: "8px 32px",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          Kliknij na scenę, aby ustawić pozycję punktu!
        </div>
      )}

      {/* PRAWY GÓRNY RÓG */}
      <div
        style={{
          position: "fixed",
          right: 16,
          top: 16,
          zIndex: showOrgChart ? 1 : 10001,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setHideUI((v) => !v)}
          style={{
            background: hideUI ? "#e9ecef" : "#2190e3",
            color: hideUI ? "#2190e3" : "white",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            fontSize: 23,
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px #2190e322",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={hideUI ? "Show all buttons" : "Hide all buttons"}
        >
          {hideUI ? "🙉" : "🙈"}
        </button>

        {!hideUI && (
          <>
            {/* Dropdown GLB */}
            <ModelsDropdown
              models={glbModels.map(({ label, visible }) => ({
                label,
                visible,
              }))}
              onToggleVisible={toggleModelVisible}
              onShowAll={showAllGlbs}
              onHideAll={hideAllGlbs}
            />

            {/* Dropdown SPLAT */}
            <SplatDropdown
              splats={splats.map(({ label, visible }) => ({
                label,
                visible,
              }))}
              onToggleVisible={toggleSplatVisible}
              onShowAll={showAllSplats}
              onHideAll={hideAllSplats}
            />

            {/* Dropdown GRUP InfoPointów */}
            <InfoPointGroupsDropdown
              groups={groupList}
              onToggleVisible={toggleGroupVisible}
              onShowAll={showAllGroups}
              onHideAll={hideAllGroups}
            />
          </>
        )}

        {!hideUI && (
          <button
            onClick={() => setShowOrgChart(true)}
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
            title="Show organizational chart"
          >
            👤 Org chart
          </button>
        )}

        <a
          href="https://orstedleba.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#2190e3",
            color: "white",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 9,
            padding: "7px 18px",
            textDecoration: "none",
            display: hideUI ? "none" : "block",
          }}
        >
          ↔️ Progress
        </a>
      </div>

      {/* --- RESZTA UI TYLKO JEŚLI !hideUI --- */}
      {!hideUI && (
        <>
          {/* Tryb edycji – przycisk po lewej */}
          <div>
            {!editMode && (
              <button
                onClick={() => setAskPassword(true)}
                style={{
                  position: "fixed",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#1971c2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "60px",
                  boxShadow: "0 4px 16px #1971c223",
                  padding: "14px 28px",
                  fontWeight: 700,
                  fontSize: 17,
                  zIndex: 2222,
                  cursor: "pointer",
                  letterSpacing: 1,
                }}
              >
                Edit mode
              </button>
            )}

            {editMode && (
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditingInfoPointId(null);
                  setPreviewInfoPointId(null);
                }}
                style={{
                  position: "fixed",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#dee2e6",
                  color: "#1971c2",
                  border: "none",
                  borderRadius: "60px",
                  boxShadow: "0 4px 16px #1971c210",
                  padding: "14px 28px",
                  fontWeight: 700,
                  fontSize: 17,
                  zIndex: 2222,
                  cursor: "pointer",
                  letterSpacing: 1,
                }}
              >
                Wyłącz edycję
              </button>
            )}

            {/* PANEL IMPORT/EKSPORT PUNKTÓW */}
            {editMode && (
              <div
                style={{
                  position: "fixed",
                  left: 14,
                  top: "calc(50% + 90px)",
                  zIndex: 2222,
                  background: "#fff",
                  borderRadius: 11,
                  boxShadow: "0 3px 16px #0001",
                  padding: "12px 19px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                <button
                  onClick={handleExportInfoPoints}
                  style={{
                    background: "#228be6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "7px 17px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Eksportuj punkty
                </button>
                <label style={{ cursor: "pointer" }}>
                  <span
                    style={{
                      color: "#228be6",
                      textDecoration: "underline",
                      marginRight: 6,
                    }}
                  >
                    Importuj punkty
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={handleImportInfoPoints}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Modal hasła do trybu edycji */}
          {askPassword && (
            <div
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.19)",
                zIndex: 2022,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setAskPassword(false)}
            >
              <form
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 4px 24px #0003",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                  alignItems: "stretch",
                  minWidth: 240,
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (passwordInput === EDIT_PASSWORD) {
                    setEditMode(true);
                    setAskPassword(false);
                    setPasswordInput("");
                  }
                }}
              >
                <span
                  style={{ fontWeight: 700, fontSize: 19, color: "#185c92" }}
                >
                  Edit mode - enter password
                </span>
                <input
                  type="password"
                  placeholder="Hasło"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{
                    fontSize: 16,
                    padding: "8px 13px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#1d8af2",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 8,
                    border: "none",
                    padding: "9px 20px",
                    cursor: "pointer",
                    marginTop: 3,
                  }}
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setAskPassword(false)}
                  style={{
                    marginTop: 7,
                    background: "#f2f4f7",
                    border: "none",
                    color: "#333",
                    fontSize: 14,
                    borderRadius: 7,
                    padding: "7px 12px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Dolny lewy panel */}
          <BottomLeftPanel
            setShowHowToUse={setShowHowToUse}
            showInfoPoints={showInfoPoints}
            setShowInfoPoints={setShowInfoPoints}
            setShowAddModal={(v) => {
              // dodatkowy guard: poza trybem edycji nie otwieraj modala
              if (editMode) setShowAddModal(v);
            }}
            // ⬇ podaj editMode, żeby ukryć przycisk w samym komponencie
            // (w komponencie dodaj warunek renderowania przycisku)

            editMode={editMode}
            isMobile={isMobile()}
          />
          {showHowToUse && (
            <HowToUseModal onClose={() => setShowHowToUse(false)} />
          )}
          {showAddModal && (
            <AddInfoPointModal
              onAdd={(point: InfoPointData) => {
                const withGroup: InfoPointData = {
                  ...point,
                  group: point.group?.trim() || "default",
                };
                addInfoPoint(withGroup);
                setShowAddModal(false);
              }}
              onClose={() => setShowAddModal(false)}
            />
          )}

          {/* Kamera/fullscreen */}
          <CameraControlsButtons
            resetCamera={resetCamera}
            isFullscreen={isFullscreen}
            toggleFullscreen={() =>
              cameraHooks.toggleFullscreen(setIsFullscreen)
            }
          />

          {/* Przyciski lewy górny róg */}
          <TopLeftButtons
            showIFC={showIFC}
            setShowIFC={setShowIFC}
            glbModels={glbModels}
            setGlbModels={setGlbModels}
            setUserGlbParamsOpen={setUserGlbParamsOpen}
            isMobile={isMobile()}
          />

          {/* Panel uploadu GLB */}
          {userGlbParamsOpen && (
            <UserGlbUploadPanel
              userGlbUrl={userGlbUrl}
              showUserGlb={showUserGlb}
              setShowUserGlb={setShowUserGlb}
              setUserGlbUrl={setUserGlbUrl}
              userGlbPos={userGlbPos}
              setUserGlbPos={setUserGlbPos}
              userGlbRot={userGlbRot}
              setUserGlbRot={setUserGlbRot}
              userGlbScale={userGlbScale}
              setUserGlbScale={setUserGlbScale}
              isMobile={isMobile()}
            />
          )}

          {/* IFC PROPERTIES */}
          {showIFC && ifcProperties && (
            <IFCPropertiesPanel
              properties={ifcProperties}
              onClose={() => setIfcProperties(null)}
            />
          )}

          {/* Panel szczegółów InfoPointa po prawej */}
          {editMode && editingPoint && (
            <InfoPointDetailsPanel
              infoPoint={editingPoint}
              editMode={editMode}
              onRequestEditMode={() => setAskPassword(true)}
              onSave={(updated) => {
                editInfoPoint({
                  ...updated,
                  group: updated.group?.trim() || "default",
                });
              }}
              onDelete={(id) => {
                deleteInfoPoint(id);
                setEditingInfoPointId(null);
              }}
              onClose={() => setEditingInfoPointId(null)}
              getCurrentCameraPosition={getCurrentCameraPosition}
              focusCameraOn={() => {}}
              onRequestSetPosition={handleRequestSetPosition}
            />
          )}
        </>
      )}

      {/* CANVAS */}
      <Canvas
        className="h-full w-full touch-action-none"
        gl={{ antialias: false }}
        dpr={isMobile() ? 2 : Math.min(window.devicePixelRatio, 2)}
        camera={{
          position: isMobile() ? [90, 110, 30] : [20, 110, 7.4],
          fov: isMobile() ? 36 : 60,
          near: 0.01,
          far: 500000,
        }}
        style={{
          width: "100vw",
          height: "100vh",
          background: "transparent",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2,
          touchAction: "none",
        }}
      >
        <ambientLight intensity={0.8} />

        {/* picking do world-space */}
        <PlaneClickCatcher
          enabled={!!waitingForPosition}
          groundY={2}
          onPick={(pos: [number, number, number]) => {
            if (waitingForPosition) {
              waitingForPosition(pos);
              setWaitingForPosition(null);
            }
          }}
        />

        <CameraControls
          ref={cameraControls}
          makeDefault
          azimuthRotateSpeed={isMobile() ? 0.45 : 1}
          polarRotateSpeed={isMobile() ? 0.5 : 1}
          truckSpeed={isMobile() ? 0.4 : 1}
          minDistance={8}
          maxDistance={900}
          verticalDragToForward={false}
        />

        {/* Jeden Suspense wokół zawartości */}
        <Suspense fallback={null}>
          {/* SPLATY (cache’owane) */}
          {splats.map((s, i) =>
            s.visible ? (
              <SplatInstance
                key={s.label + i}
                url={s.url}
                position={s.position}
                rotation={s.rotation}
                scale={s.scale || [1, 1, 1]}
                maxSplats={s.maxSplats ?? (isMobile() ? 5_000_000 : 10_000_000)}
                onFirstLoaded={markSplatLoaded}
              />
            ) : null
          )}

          {/* InfoPointy po przefiltrowaniu wg grup */}
          <InfoPointCanvasGroup
            infoPoints={showInfoPoints ? visibleInfoPoints : []}
            activeInfoPoint={editMode ? null : previewInfoPointId}
            setActiveInfoPoint={handleInfoPointClick}
            showInfoPoints={showInfoPoints}
            infoPanelStyle={getInfoPanelStyle(isMobile())}
            editMode={editMode}
            onClosePreview={() => setPreviewInfoPointId(null)}
          />

          {/* Pozostałe modele / IFC */}
          {glbModels.map((m, i) =>
            m.visible ? (
              <Suspense fallback={null} key={m.label + i}>
                <GLBModel
                  url={m.url}
                  position={m.position}
                  rotation={m.rotation}
                  scale={m.scale || [1, 1, 1]}
                  visible={m.visible}
                />
              </Suspense>
            ) : null
          )}

          {showIFC && (
            <IFCModel
              onPropertiesSelected={setIfcProperties}
              rotationY={95}
              visible={showIFC}
            />
          )}

          {showPublicGlb && (
            <Suspense fallback={null}>
              <GLBModel
                url={userGlbUrl ?? "/models/building.glb"}
                position={userGlbPos}
                rotation={userGlbRot}
                scale={userGlbScale}
                visible={showPublicGlb}
              />
            </Suspense>
          )}

          {showUserGlb && userGlbUrl && (
            <Suspense fallback={null}>
              <GLBModel
                url={userGlbUrl}
                position={userGlbPos}
                rotation={userGlbRot}
                scale={userGlbScale}
                visible={showUserGlb}
              />
            </Suspense>
          )}

          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {showOrgChart && (
        <OrgChartModal
          onClose={() => setShowOrgChart(false)}
          imageUrl="/media/orgchart.png"
          baseWidth={1284}
          baseHeight={720}
          hotspots={[
            {
              rect: { x: 200, y: 60, w: 100, h: 100 },
              video: "/media/mirek.mp4",
              poster: "/media/mirek.jpg",
              alt: "Andrzej Kryciński",
            },
          ]}
        />
      )}
    </div>
  );
}

export default App;
