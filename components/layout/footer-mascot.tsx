"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import styles from "./footer-mascot.module.css";

const poses = [
  [0, 0, 0, 0],
  [1, 0, 4, 0],
  [2, 0, 8, 0],
  [0, 1, 0, 8],
  [1, 1, 4, 8],
  [2, 1, 8, 8],
];
const wave = [
  [1, 150],
  [2, 200],
  [3, 150],
  [2, 200],
  [1, 150],
  [0, 100],
];
const size = 96;
const margin = 24;
const positionKey = "qhapaqdata-condor-position";
const hiddenKey = "qhapaqdata-condor-hidden";
type Position = { x: number; y: number };
function clamp(position: Position): Position {
  return {
    x: Math.max(
      margin,
      Math.min(
        position.x,
        document.documentElement.clientWidth - size - margin,
      ),
    ),
    y: Math.max(100, Math.min(position.y, innerHeight - size - margin)),
  };
}

export function FloatingMascot() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const current = useRef<Position | null>(null);
  const custom = useRef(false);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    origin: Position;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const animate = useRef<() => void>(() => {});
  const stopAnimation = useRef<() => void>(() => {});

  useEffect(() => {
    const desktop = matchMedia(
      "(min-width: 1536px) and (min-height: 500px) and (hover: hover) and (pointer: fine)",
    );
    function update() {
      const main = document.querySelector("main")?.getBoundingClientRect();
      const room = main ? document.documentElement.clientWidth - main.right : 0;
      setVisible(desktop.matches && room >= size + margin + 8);
      const next = clamp(
        custom.current && current.current
          ? current.current
          : {
              x: document.documentElement.clientWidth - size - margin,
              y: innerHeight - size - margin,
            },
      );
      current.current = next;
      setPosition(next);
    }
    const initial = requestAnimationFrame(() => {
      try {
        setDismissed(sessionStorage.getItem(hiddenKey) === "true");
        const saved: unknown = JSON.parse(
          sessionStorage.getItem(positionKey) ?? "null",
        );
        if (
          saved &&
          typeof saved === "object" &&
          "x" in saved &&
          "y" in saved &&
          typeof saved.x === "number" &&
          typeof saved.y === "number" &&
          Number.isFinite(saved.x) &&
          Number.isFinite(saved.y)
        ) {
          current.current = { x: saved.x, y: saved.y };
          custom.current = true;
        }
      } catch {
        /* Storage can be unavailable; the default position still works. */
      }
      update();
    });
    desktop.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(initial);
      desktop.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let playing = false;
    const allowed = () =>
      ready &&
      visible &&
      !dismissed &&
      !failed &&
      !document.hidden &&
      !preference.matches;
    function stop() {
      clearTimeout(timer);
      playing = false;
      setFrame(0);
    }
    animate.current = () => {
      if (!allowed() || playing) return;
      playing = true;
      let index = 0;
      function step() {
        if (!allowed()) {
          stop();
          return;
        }
        if (index === wave.length) {
          playing = false;
          return;
        }
        const [pose, duration] = wave[index++];
        setFrame(pose);
        timer = setTimeout(step, duration);
      }
      step();
    };
    stopAnimation.current = stop;
    document.addEventListener("visibilitychange", stop);
    preference.addEventListener("change", stop);
    // Hidden/reopened widgets always return to rest, with no autonomous timers.
    const reset = requestAnimationFrame(stop);
    return () => {
      cancelAnimationFrame(reset);
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", stop);
      preference.removeEventListener("change", stop);
      animate.current = () => {};
      stopAnimation.current = () => {};
    };
  }, [ready, visible, dismissed, failed]);

  function move(next: Position) {
    const bounded = clamp(next);
    custom.current = true;
    current.current = bounded;
    setPosition(bounded);
  }
  function save() {
    try {
      if (current.current)
        sessionStorage.setItem(positionKey, JSON.stringify(current.current));
    } catch {}
  }
  function hide() {
    stopAnimation.current();
    setDismissed(true);
    try {
      sessionStorage.setItem(hiddenKey, "true");
    } catch {}
  }
  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !current.current) return;
    stopAnimation.current();
    suppressClick.current = false;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      origin: current.current,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    const dx = event.clientX - active.x,
      dy = event.clientY - active.y;
    if (!active.moved && Math.hypot(dx, dy) < 6) return;
    active.moved = true;
    setDragging(true);
    suppressClick.current = true;
    move({ x: active.origin.x + dx, y: active.origin.y + dy });
  }
  function pointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (drag.current?.id !== event.pointerId) return;
    if (drag.current.moved) save();
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const pos = current.current;
    if (!pos) return;
    const directions: Record<string, Position> = {
      ArrowLeft: { x: -20, y: 0 },
      ArrowRight: { x: 20, y: 0 },
      ArrowUp: { x: 0, y: -20 },
      ArrowDown: { x: 0, y: 20 },
    };
    if (directions[event.key]) {
      event.preventDefault();
      stopAnimation.current();
      move({
        x: pos.x + directions[event.key].x,
        y: pos.y + directions[event.key].y,
      });
      save();
    } else if (event.key === "Home") {
      event.preventDefault();
      custom.current = false;
      const next = clamp({
        x: document.documentElement.clientWidth - size - margin,
        y: innerHeight - size - margin,
      });
      current.current = next;
      setPosition(next);
      try {
        sessionStorage.removeItem(positionKey);
      } catch {}
    } else if (event.key === "Escape") {
      event.preventDefault();
      hide();
    } else if (event.key === "Enter" || event.key === " ")
      suppressClick.current = false;
  }
  const [column, row, dx, dy] = poses[frame];
  if (!visible || dismissed || failed || !position) return null;
  return (
    <div
      className={styles.mascot}
      style={{ left: position.x, top: position.y }}
      data-testid="floating-mascot"
      data-frame={frame}
      data-dragging={dragging}
    >
      <button
        type="button"
        className={styles.character}
        aria-label="Make the QhapaqData condor wave"
        aria-describedby="condor-instructions"
        onPointerEnter={() => {
          if (!drag.current) animate.current();
        }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onLostPointerCapture={() => {
          drag.current = null;
          setDragging(false);
        }}
        onKeyDown={keyboard}
        onClick={() => {
          if (!suppressClick.current) animate.current();
          suppressClick.current = false;
        }}
      >
        <span className={styles.viewport} aria-hidden="true">
          <span
            className={styles.frame}
            style={{
              transform: `translate(${(dx / 512) * 100}%, ${(dy / 512) * 100}%)`,
            }}
          >
            <Image
              src="/condor-sprite.png"
              alt=""
              width={1536}
              height={1024}
              sizes="288px"
              draggable={false}
              className={styles.sheet}
              style={{ left: `${-column * 100}%`, top: `${-row * 100}%` }}
              onLoad={() => setReady(true)}
              onError={() => setFailed(true)}
            />
          </span>
        </span>
      </button>
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Hide condor for this session"
        title="Hide condor"
        onClick={hide}
      >
        ×
      </button>
      <span id="condor-instructions" className={styles.instructions}>
        Hover or press Enter to wave. Drag or use arrow keys to move. Home
        resets the position. Escape hides the mascot for this session.
      </span>
    </div>
  );
}
