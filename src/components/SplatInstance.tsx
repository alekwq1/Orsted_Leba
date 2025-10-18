import { Suspense, useEffect, useRef, useState } from "react";
import { Splat } from "../splat-object";

/** -----------------------------
 *  Globalny cache splatów (URL → objectUrl)
 *  -----------------------------
 */
type CacheEntry = {
  status: "idle" | "loading" | "ready" | "error";
  objectUrl?: string;
  error?: unknown;
  refCount: number;
  promise?: Promise<string>;
};

const SPLAT_CACHE = new Map<string, CacheEntry>();

async function fetchAsObjectURL(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

function loadSplat(url: string): Promise<string> {
  const existing = SPLAT_CACHE.get(url);
  if (existing?.status === "ready" && existing.objectUrl) {
    return Promise.resolve(existing.objectUrl);
  }
  if (existing?.status === "loading" && existing.promise) {
    return existing.promise;
  }

  const entry: CacheEntry = existing ?? { status: "idle", refCount: 0 };
  entry.status = "loading";
  entry.promise = fetchAsObjectURL(url)
    .then((objUrl) => {
      entry.status = "ready";
      entry.objectUrl = objUrl;
      entry.promise = undefined;
      return objUrl;
    })
    .catch((err) => {
      entry.status = "error";
      entry.error = err;
      entry.promise = undefined;
      throw err;
    });

  SPLAT_CACHE.set(url, entry);
  return entry.promise!;
}

function incRef(url: string) {
  const e = SPLAT_CACHE.get(url);
  if (e) e.refCount += 1;
  else SPLAT_CACHE.set(url, { status: "idle", refCount: 1 });
}

function decRef(url: string) {
  const e = SPLAT_CACHE.get(url);
  if (!e) return;
  e.refCount = Math.max(0, e.refCount - 1);
  // Świadomie NIE robimy revoke tutaj, żeby przełączanie było instant.
  // Możesz dodać TTL i sprzątanie po czasie bez refów.
}

export const SplatCacheUtils = {
  isReady: (url: string) => {
    const e = SPLAT_CACHE.get(url);
    return !!(e && e.status === "ready" && e.objectUrl);
  },
  preload: (url: string) => loadSplat(url).then(() => void 0),
};

export type SplatInstanceProps = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; // radians
  scale?: [number, number, number];
  maxSplats?: number;
  /** callback tylko przy PIERWSZYM powodzeniu ładowania danego URL */
  onFirstLoaded?: (url: string) => void;

  /** sposób pojawienia: "progressive" łagodnie podnosi maxSplats */
  appearance?: "instant" | "progressive";
  /** czas pojawiania przy "progressive" */
  fadeMs?: number;
};

export default function SplatInstance({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  maxSplats = 10_000_000,
  onFirstLoaded,
  appearance = "progressive",
  fadeMs = 450,
}: SplatInstanceProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(() => {
    const e = SPLAT_CACHE.get(url);
    return e?.status === "ready" && e.objectUrl ? e.objectUrl : null;
  });

  // progressive reveal: aktualna wartość maxSplats przekazywana do <Splat />
  const [displayMax, setDisplayMax] = useState<number>(
    appearance === "progressive" ? 0 : maxSplats
  );
  const firstReportedRef = useRef<boolean>(false);

  // ładowanie + cache
  useEffect(() => {
    incRef(url);
    let cancelled = false;

    const ready = SPLAT_CACHE.get(url);
    if (ready?.status === "ready" && ready.objectUrl) {
      setObjectUrl(ready.objectUrl);
      if (!firstReportedRef.current) {
        onFirstLoaded?.(url);
        firstReportedRef.current = true;
      }
    } else {
      loadSplat(url)
        .then((objUrl) => {
          if (cancelled) return;
          setObjectUrl(objUrl);
          if (!firstReportedRef.current) {
            onFirstLoaded?.(url);
            firstReportedRef.current = true;
          }
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Splat load error:", err);
        });
    }

    return () => {
      cancelled = true;
      decRef(url);
    };
  }, [url, onFirstLoaded]);

  // animacja wejścia (tylko gdy pojawił się objectUrl)
  useEffect(() => {
    if (!objectUrl) return;

    if (appearance === "instant") {
      setDisplayMax(maxSplats);
      return;
    }

    let raf = 0;
    const t0 = performance.now();

    const step = () => {
      const t = (performance.now() - t0) / fadeMs; // 0..1
      const k = t >= 1 ? 1 : t;
      const val = Math.max(1, Math.floor(maxSplats * k));
      setDisplayMax(val);
      if (k < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [objectUrl, appearance, fadeMs, maxSplats]);

  if (!objectUrl) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Suspense fallback={null}>
        <Splat url={objectUrl} maxSplats={displayMax} />
      </Suspense>
    </group>
  );
}
