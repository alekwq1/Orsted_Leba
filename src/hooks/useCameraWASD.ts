import { useEffect, useRef } from "react";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  // input/textarea/contenteditable lub role="textbox"
  if (
    target.closest(
      "input, textarea, [contenteditable='true'], [contenteditable=''], [role='textbox']"
    )
  ) {
    return true;
  }
  const tn = target.tagName;
  return tn === "INPUT" || tn === "TEXTAREA";
}

export function useCameraWASD(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cameraControls: any,
  isFullscreen: boolean,
  resetCamera: () => void,
  toggleFullscreen: () => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActiveInfoPoint: (v: any) => void
) {
  const MOVE_STEP = 0.7;
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // pomocnicze czyszczenie stanów ruchu
  const clearMoveState = () => {
    const st = moveState.current;
    st.forward = st.backward = st.left = st.right = st.up = st.down = false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Jeśli piszemy w polu tekstowym — zignoruj skrót i wyczyść ewentualny ruch
      if (isTypingTarget(e.target)) {
        clearMoveState();
        return;
      }

      if (typeof e.key !== "string") return;

      switch (e.key.toLowerCase()) {
        case "w":
          e.preventDefault();
          moveState.current.forward = true;
          break;
        case "s":
          e.preventDefault();
          moveState.current.backward = true;
          break;
        case "a":
          e.preventDefault();
          moveState.current.left = true;
          break;
        case "d":
          e.preventDefault();
          moveState.current.right = true;
          break;
        case "q":
          e.preventDefault();
          moveState.current.up = true;
          break;
        case "e":
          e.preventDefault();
          moveState.current.down = true;
          break;
        case "r":
          e.preventDefault();
          resetCamera();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "escape":
          e.preventDefault();
          if (isFullscreen) toggleFullscreen();
          setActiveInfoPoint(null);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (typeof e.key !== "string") return;

      switch (e.key.toLowerCase()) {
        case "w":
          moveState.current.forward = false;
          break;
        case "s":
          moveState.current.backward = false;
          break;
        case "a":
          moveState.current.left = false;
          break;
        case "d":
          moveState.current.right = false;
          break;
        case "q":
          moveState.current.up = false;
          break;
        case "e":
          moveState.current.down = false;
          break;
        default:
          break;
      }
    };

    // Gdy fokus wejdzie do pola edycyjnego — natychmiast zatrzymaj ruch
    const handleFocusIn = (e: FocusEvent) => {
      if (isTypingTarget(e.target)) clearMoveState();
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: true });
    window.addEventListener("focusin", handleFocusIn, { passive: true });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("keydown", handleKeyDown as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("keyup", handleKeyUp as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("focusin", handleFocusIn as any);
    };
  }, [isFullscreen, resetCamera, toggleFullscreen, setActiveInfoPoint]);

  useEffect(() => {
    let animationFrameId: number;

    const animateMove = () => {
      const controls = cameraControls.current;
      if (controls) {
        const st = moveState.current;
        if (st.forward) controls.forward(MOVE_STEP, false);
        if (st.backward) controls.forward(-MOVE_STEP, false);
        if (st.left) controls.truck(-MOVE_STEP, 0, false);
        if (st.right) controls.truck(MOVE_STEP, 0, false);
        if (st.up) controls.truck(0, MOVE_STEP, false);
        if (st.down) controls.truck(0, -MOVE_STEP, false);
      }
      animationFrameId = requestAnimationFrame(animateMove);
    };

    animationFrameId = requestAnimationFrame(animateMove);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraControls]);
}
