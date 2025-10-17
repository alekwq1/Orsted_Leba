import { Suspense, useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, CameraControls } from "@react-three/drei";
import { Splat } from "./splat-object";
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
import { useInfoPoints } from "./hooks/useInfoPoints";
import { useCameraControls } from "./hooks/useCameraControls";
import { useCameraWASD } from "./hooks/useCameraWASD";
import { useSplatLoader } from "./hooks/useSplatLoader";
import { useAuth } from "./hooks/useAuth";
import { InfoPointData } from "./utils/types";
import { isMobile, getInfoPanelStyle } from "./utils/helpers";
import PlaneClickCatcher from "./components/PlaneClickCatcher";
import OrgChartModal from "./components/OrgChartModal";

// --- TABLICA MODELI GLB ---
export type GLBModelSettings = {
  url: string;
  label: string;
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
};

// helpers do konwersji
const degToRad = (deg: number) => (deg * Math.PI) / 180;

const degArrayToRad = ([x, y, z]: [number, number, number]): [
  number,
  number,
  number
] => [degToRad(x), degToRad(y), degToRad(z)];
const splatOption = {
  name: "15.10.2025",
  url: "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Orsted_15102025.splat",

  position: [-1.9, 10, -0.78] as [number, number, number],
  rotation: degArrayToRad([0, 68.9, 0]),
  scale: [20, 20, 20] as [number, number, number],
};

function App() {
  // ---- Obsługa "Wskaż na scenie"
  const [waitingForPosition, setWaitingForPosition] = useState<
    null | ((pos: [number, number, number]) => void)
  >(null);
  const [showOrgChart, setShowOrgChart] = useState(false);

  const [showSplatLoadedOverlay, setShowSplatLoadedOverlay] = useState(false);
  const [glbModels, setGlbModels] = useState<GLBModelSettings[]>([
    {
      url: "/models/building.glb",
      label: "Budynek bazowy",
      visible: false,
      position: [14, 0.6, -23],
      rotation: [0, 160, 0],
      scale: [1, 1, 1],
    },
    {
      url: "/models/building1.glb",
      label: "buda oraz SITEMARKS",
      visible: false,
      position: [79.5, -82.7, -6.2],
      rotation: [0, 90.5, 0],
      scale: [1, 1, 1],
    },
  ]);
  // POBIERZ AKTUALNY, NAJNOWSZY infoPoints!
  const {
    infoPoints,
    addInfoPoint,
    editInfoPoint,
    deleteInfoPoint,
    setInfoPoints,
  } = useInfoPoints();
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

  // --- Poprawiona funkcja resetowania kamery ---
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

  // Autoryzacja
  const {
    password,
    setPassword,
    isAuthenticated,
    showPasswordError,
    handlePasswordSubmit,
  } = useAuth();

  const { objectUrl, progress, showLoading } = useSplatLoader(splatOption.url);
  useEffect(() => {
    if (!showLoading && objectUrl) {
      setShowSplatLoadedOverlay(true);
      // Po 2 sekundach schowaj overlay
      const timeout = setTimeout(() => {
        setShowSplatLoadedOverlay(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showLoading, objectUrl]);
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
          setInfoPoints(data);
          alert("Zaimportowano punkty (z tablicy)!");
        } else if (data.infoPoints && Array.isArray(data.infoPoints)) {
          setInfoPoints(data.infoPoints);
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

  // Logowanie
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
      {(showLoading || showSplatLoadedOverlay) && (
        <LoadingOverlay progress={progress >= 100 ? 100 : progress} />
      )}

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

      {/* PRZYCISK UKRYWANIA UI + Progress Compare */}
      <div
        style={{
          position: "fixed",
          right: 16,
          top: 16,
          zIndex: 10001,
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
          title={
            hideUI ? "Pokaż wszystkie przyciski" : "Ukryj wszystkie przyciski"
          }
        >
          {hideUI ? "🙉" : "🙈"}
        </button>
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
            title="Pokaż schemat organizacyjny"
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
          ↔️ Progress Compare
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
                  outline: "none",
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
                  outline: "none",
                }}
              >
                Wyłącz edycję
              </button>
            )}

            {/* PANEL IMPORT/EKSPORT PUNKTÓW - tuż pod edycją */}
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
                  Dalej
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
                  Anuluj
                </button>
              </form>
            </div>
          )}

          {/* Dolny lewy panel */}
          <BottomLeftPanel
            setShowHowToUse={setShowHowToUse}
            showInfoPoints={showInfoPoints}
            setShowInfoPoints={setShowInfoPoints}
            setShowAddModal={setShowAddModal}
            isMobile={isMobile()}
          />
          {showHowToUse && (
            <HowToUseModal onClose={() => setShowHowToUse(false)} />
          )}
          {showAddModal && (
            <AddInfoPointModal
              onAdd={(point: InfoPointData) => {
                addInfoPoint(point);
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

          {/* Panel szczegółów InfoPointa po prawej (tylko w trybie edycji!) */}
          {editMode && editingPoint && (
            <InfoPointDetailsPanel
              infoPoint={editingPoint}
              editMode={editMode}
              onRequestEditMode={() => setAskPassword(true)}
              onSave={(updated) => {
                editInfoPoint(updated);
              }}
              onDelete={(id) => {
                deleteInfoPoint(id);
                setEditingInfoPointId(null);
              }}
              onClose={() => setEditingInfoPointId(null)}
              getCurrentCameraPosition={getCurrentCameraPosition}
              focusCameraOn={() => {}}
              // TO NAJWAŻNIEJSZE: przekazujesz callback!
              onRequestSetPosition={handleRequestSetPosition}
            />
          )}
        </>
      )}

      {/* CANVAS */}
      {objectUrl && (
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
            /* groundY dopasuj do swojej podłogi: 0 albo -1 */
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

          {/* JEDEN, zewnętrzny Suspense otwarty i ZAMKNIĘTY */}
          <Suspense fallback={null}>
            {/* 1) Splat w swojej grupie – tylko on się przesuwa */}
            <group
              position={splatOption.position}
              rotation={splatOption.rotation} // jeśli podajesz stopnie, skonwertuj do radianów
              scale={splatOption.scale}
            >
              <Splat
                url={objectUrl}
                maxSplats={isMobile() ? 5_000_000 : 10_000_000}
              />
            </group>

            {/* 2) InfoPointy poza grupą splata (world-space) */}
            <InfoPointCanvasGroup
              infoPoints={infoPoints}
              activeInfoPoint={editMode ? null : previewInfoPointId}
              setActiveInfoPoint={handleInfoPointClick}
              showInfoPoints={showInfoPoints}
              infoPanelStyle={getInfoPanelStyle(isMobile())}
              editMode={editMode}
              onClosePreview={() => setPreviewInfoPointId(null)}
            />

            {/* 3) Pozostałe modele/IFC */}
            {glbModels
              .filter((m) => m.visible)
              .map((m, i) => (
                <Suspense fallback={null} key={m.label + i}>
                  <GLBModel
                    url={m.url}
                    position={m.position}
                    rotation={m.rotation}
                    scale={m.scale || [1, 1, 1]}
                    visible={m.visible}
                  />
                </Suspense>
              ))}

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
      )}
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
            // kolejne osoby...
          ]}
        />
      )}
    </div>
  );
}

export default App;
