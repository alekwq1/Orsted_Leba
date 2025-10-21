import React, { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  src: string;
  alt?: string;
  caption?: string;
};

type Props = {
  images: GalleryImage[];
  index: number;
  // <-- ważne: to jest dokładny typ z useState
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
};

const clampIndex = (i: number, len: number) => (len ? (i + len) % len : 0);
const ZOOM_SCALE = 1.8;

const GalleryModal: React.FC<Props> = ({
  images,
  index,
  setIndex,
  onClose,
}) => {
  const len = images.length;
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const [hovering, setHovering] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // stan dragowania
  const dragRef = useRef<{
    active: boolean;
    sx: number;
    sy: number;
    startTx: number;
    startTy: number;
    pointerId?: number;
  }>({ active: false, sx: 0, sy: 0, startTx: 0, startTy: 0 });

  const prev = useCallback(() => {
    // funkcjonalny updater + jawny typ 'i: number' żeby uciszyć TS7006
    setIndex((i: number) => clampIndex(i - 1, len));
  }, [len, setIndex]);

  const next = useCallback(() => {
    setIndex((i: number) => clampIndex(i + 1, len));
  }, [len, setIndex]);

  // Keyboard: Esc/←/→
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // oblicz maksymalny pan (w px) względem rozmiaru ramki
  const getMaxPan = useCallback(() => {
    const el = frameRef.current;
    if (!el) return { maxX: 0, maxY: 0 };
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    return {
      maxX: ((ZOOM_SCALE - 1) * w) / 2,
      maxY: ((ZOOM_SCALE - 1) * h) / 2,
    };
  }, []);

  const clampPan = useCallback(
    (nx: number, ny: number) => {
      const { maxX, maxY } = getMaxPan();
      return {
        x: Math.max(-maxX, Math.min(maxX, nx)),
        y: Math.max(-maxY, Math.min(maxY, ny)),
      };
    },
    [getMaxPan]
  );

  // klik w obraz (włącz/wyłącz zoom) z centrowaniem klikniętego punktu
  const handleImageClick = (e: React.MouseEvent) => {
    const el = frameRef.current;
    if (!el) return;

    if (!zoomed) {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const dx = mx - cx;
      const dy = my - cy;
      const wantTx = -(ZOOM_SCALE - 1) * dx;
      const wantTy = -(ZOOM_SCALE - 1) * dy;

      const { x, y } = clampPan(wantTx, wantTy);
      setTx(x);
      setTy(y);
      setZoomed(true);
    } else {
      setZoomed(false);
      setTx(0);
      setTy(0);
    }
  };

  // Pointer Events – stabilny drag z capture
  const onPointerDown = (e: React.PointerEvent) => {
    if (!zoomed) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      active: true,
      sx: e.clientX,
      sy: e.clientY,
      startTx: tx,
      startTy: ty,
      pointerId: e.pointerId,
    };
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    const { x, y } = clampPan(
      dragRef.current.startTx + dx,
      dragRef.current.startTy + dy
    );
    setTx(x);
    setTy(y);
  };

  const endDrag = () => {
    dragRef.current.active = false;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    endDrag();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 10020,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#0b1117",
          borderRadius: 12,
          padding: 12,
          maxWidth: "92vw",
          maxHeight: "88vh",
          boxShadow: "0 10px 40px #0008",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* górny pasek */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span style={{ color: "#e9ecef", fontWeight: 600 }}>
            {index + 1} / {len}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "#e9ecef",
              color: "#111",
              border: "none",
              borderRadius: 8,
              padding: "6px 10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* obraz + strzałki */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <button
            onClick={prev}
            style={{
              background: "#ffffff22",
              color: "#fff",
              border: "1px solid #ffffff55",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 18,
              cursor: "pointer",
            }}
            title="Prev"
          >
            ◀
          </button>

          {/* RAMKA */}
          <div
            ref={frameRef}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => {
              setHovering(false);
              endDrag();
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={handleImageClick}
            style={{
              position: "relative",
              maxWidth: "80vw",
              maxHeight: "70vh",
              width: "80vw",
              height: "70vh",
              overflow: "hidden",
              borderRadius: 8,
              background: "#0e141b",
              userSelect: "none",
              cursor: zoomed
                ? dragRef.current.active
                  ? "grabbing"
                  : "zoom-out"
                : "zoom-in",
              touchAction: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={
              zoomed
                ? "Przeciągaj, by przesuwać. Kliknij, by oddalić."
                : "Kliknij, by przybliżyć w miejscu kursora"
            }
          >
            {/* wrapper transformowany */}
            <div
              style={{
                transform: zoomed
                  ? `translate(${tx}px, ${ty}px) scale(${ZOOM_SCALE})`
                  : `translate(0px, 0px) scale(1)`,
                transformOrigin: "center center",
                transition: dragRef.current.active
                  ? "none"
                  : "transform 150ms ease",
                willChange: "transform",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={images[index]?.src}
                alt={images[index]?.alt ?? ""}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                  userSelect: "none",
                  display: "block",
                }}
                draggable={false}
              />
            </div>

            {/* LUPA – tylko na hover i gdy nie ma zoomu */}
            {!zoomed && hovering && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    borderRadius: "9999px",
                    padding: 10,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
                  }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <line
                      x1="16.65"
                      y1="16.65"
                      x2="21"
                      y2="21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={next}
            style={{
              background: "#ffffff22",
              color: "#fff",
              border: "1px solid #ffffff55",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 18,
              cursor: "pointer",
            }}
            title="Next"
          >
            ▶
          </button>
        </div>

        {(images[index]?.alt || images[index]?.caption) && (
          <div
            style={{
              color: "#cbd5e1",
              fontSize: 13,
              textAlign: "center",
              paddingTop: 4,
              maxWidth: "80vw",
            }}
          >
            {images[index]?.caption ?? images[index]?.alt}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryModal;
