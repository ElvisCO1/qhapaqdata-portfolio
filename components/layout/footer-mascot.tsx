"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./footer-mascot.module.css";

// The original sheet has three columns and two rows of 512px cells.
// Small offsets align the feet without modifying the source artwork.
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
const blink = [
  [4, 70],
  [5, 100],
  [4, 70],
  [0, 0],
];

export function FooterMascot() {
  const container = useRef<HTMLDivElement>(null);
  const activate = useRef<() => void>(() => {});
  const greeted = useRef(false);
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let playing = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const canAnimate = () =>
      ready && !paused && visible && !document.hidden && !preference.matches;
    function stop() {
      clearTimeout(timer);
      playing = false;
      setFrame(0);
    }
    function scheduleBlink() {
      if (!canAnimate()) return;
      timer = setTimeout(() => play(blink), 5000 + Math.random() * 4000);
    }
    function play(sequence: number[][]) {
      if (!canAnimate() || playing) return;
      clearTimeout(timer);
      playing = true;
      let index = 0;
      function step() {
        if (!canAnimate()) {
          stop();
          return;
        }
        if (index === sequence.length) {
          playing = false;
          scheduleBlink();
          return;
        }
        const [pose, duration] = sequence[index++];
        setFrame(pose);
        timer = setTimeout(step, duration);
      }
      step();
    }
    function refresh() {
      setReduced(preference.matches);
      stop();
      if (!canAnimate()) return;
      if (!greeted.current) {
        greeted.current = true;
        play(wave);
      } else scheduleBlink();
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        refresh();
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(element);
    activate.current = () => play(wave);
    preference.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      preference.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      activate.current = () => {};
    };
  }, [ready, paused, failed]);

  const [column, row, dx, dy] = poses[frame];
  if (failed) return null;
  return (
    <div
      ref={container}
      className={styles.mascot}
      data-testid="footer-mascot"
      data-frame={frame}
    >
      <button
        type="button"
        className={styles.character}
        aria-label={
          reduced || paused
            ? "QhapaqData condor mascot, animation paused"
            : "Make the QhapaqData condor wave"
        }
        disabled={!ready || reduced || paused}
        onClick={() => activate.current()}
        title={reduced || paused ? "Animation paused" : "Say hello"}
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
              sizes="336px"
              className={styles.sheet}
              style={{
                left: `${-column * 100}%`,
                top: `${-row * 100}%`,
              }}
              onLoad={() => setReady(true)}
              onError={() => setFailed(true)}
            />
          </span>
        </span>
      </button>
      {!reduced && (
        <button
          type="button"
          className={styles.control}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Resume animation" : "Pause animation"}
        </button>
      )}
    </div>
  );
}
