// src/components/OrgChartModal.tsx
import React, { useEffect, useRef, useState } from "react";

export type OrgHotspot = {
  /** x,y,width,height w pikselach względem bazowego rozmiaru obrazka */
  rect: { x: number; y: number; w: number; h: number };
  video: string; // mp4/webm
  poster?: string; // jpg/png (miniatura)
  alt?: string;
};

function HoverVideoInstant({
  rect,
  video,
  poster,
  alt,
  scaleX,
  scaleY,
}: OrgHotspot & { scaleX: number; scaleY: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);

  // styl hotspotu skaluje się do rozmiaru obrazka
  const style: React.CSSProperties = {
    position: "absolute",
    left: rect.x * scaleX,
    top: rect.y * scaleY,
    width: rect.w * scaleX,
    height: rect.h * scaleY,
    overflow: "hidden",
    borderRadius: 8,
    cursor: "pointer",
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    v.addEventListener("canplay", onCanPlay);
    try {
      // zainicjuj buforowanie
      v.load();
    } catch (e) {
      /* ignore */
    }
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [video]);

  const showVideo = hover && ready;

  return (
    <div
      style={style}
      onMouseEnter={() => {
        setHover(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHover(false);
        videoRef.current?.pause();
      }}
      title={alt || ""}
    >
      {/* video cały czas w DOM => natychmiastowe odtwarzanie */}
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: showVideo ? 1 : 0,
          transition: "opacity 50ms linear",
        }}
        aria-label={alt || "video"}
      />
      <img
        src={poster || "/media/placeholder.jpg"}
        alt={alt || "photo"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: showVideo ? 0 : 1,
          transition: "opacity 50ms linear",
        }}
      />
    </div>
  );
}

export default function OrgChartModal({
  onClose,
  imageUrl,
  hotspots,
  baseWidth,
  baseHeight,
}: {
  onClose: () => void;
  imageUrl: string; // np. "/media/orgchart.png"
  hotspots: OrgHotspot[]; // współrzędne zdjęć na obrazku
  baseWidth: number; // szerokość obrazka źródłowego w px
  baseHeight: number; // wysokość obrazka źródłowego w px
}) {
  // dopasowanie rozmiaru modal do okna
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 1500,
    h: 560,
  });

  useEffect(() => {
    const handler = () => {
      const maxW = Math.min(window.innerWidth - 80, baseWidth);
      const scale = maxW / baseWidth;
      setSize({ w: maxW, h: Math.round(baseHeight * scale) });
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [baseWidth, baseHeight]);

  const scaleX = size.w / baseWidth;
  const scaleY = size.h / baseHeight;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: size.w,
          height: size.h,
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 40px #0005",
        }}
      >
        <img
          src={imageUrl}
          alt="Organisation chart"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        {hotspots.map((h, i) => (
          <HoverVideoInstant key={i} {...h} scaleX={scaleX} scaleY={scaleY} />
        ))}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
          }}
          aria-label="close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
