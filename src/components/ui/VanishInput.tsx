"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
// import { Button } from "./button";

interface VanishInputProps {
  placeholders: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose?: () => void;
}

export function VanishInput({ placeholders, onChange, onSubmit, onClose }: VanishInputProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  type Particle = { x: number; y: number; r: number; color: string };
  const newDataRef = useRef<Particle[]>([]);

  // --- Rotate placeholders (only when not focused) ---
  useEffect(() => {
    if (!isFocused) {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders, isFocused]);

  // --- Draw text to canvas ---
  const draw = useCallback(() => {
    const input = inputRef.current;
    const canvas = canvasRef.current;
    if (!input || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const styles = getComputedStyle(input);
    const fontSize = parseFloat(styles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${styles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 50);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const newData: Particle[] = [];

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (pixels[i + 3] > 0) {
          newData.push({ x, y, r: 1, color: `rgba(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]},${pixels[i + 3] / 255})` });
        }
      }
    }
    newDataRef.current = newData;
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  // --- Animate vanish ---
  const animate = (start: number) => {
    const frame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, 800, 200);
        const updated: Particle[] = [];
        for (const p of newDataRef.current) {
          if (p.x < pos) continue;
          p.x += Math.random() > 0.5 ? 1 : -1;
          p.y += Math.random() > 0.5 ? 1 : -1;
          p.r -= 0.05;
          if (p.r > 0) updated.push(p);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.r, p.r);
        }
        newDataRef.current = updated;

        if (updated.length > 0) frame(pos - 10);
        else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    frame(start);
  };

  const vanishAndSubmit = (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e?.preventDefault();
    if (!value || animating) return;
    setAnimating(true);
    draw();

    const maxX = newDataRef.current.reduce((max, p) => Math.max(max, p.x), 0);
    animate(maxX);

    onSubmit?.(e as React.FormEvent<HTMLFormElement>);
  };

  return (
    <form
      onSubmit={vanishAndSubmit}
      className="relative w-full mx-auto bg-transparent border-b border-neutral-400 dark:border-zinc-600 focus-within:border-white transition duration-200">
      <canvas
        ref={canvasRef}
        className={cn("absolute pointer-events-none top-1/2 left-0 -translate-y-1/2 scale-50 opacity-0 text-base invert dark:invert-0", animating && "opacity-100")}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder=""
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange?.(e);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") vanishAndSubmit(e);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full bg-transparent border-none outline-none text-base text-black dark:text-white py-2 pr-8 focus:ring-0 placeholder-transparent",
          animating && "text-transparent dark:text-transparent"
        )}
      />

      {/* Animated placeholder */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.span
              key={isFocused ? "focused-placeholder" : `ph-${currentPlaceholder}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.6, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-neutral-500 dark:text-zinc-500">
              {isFocused ? "Write your comment..." : placeholders[currentPlaceholder]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Button container */}
      {/* {value && ( */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* X button to clear */}
        {(value || isFocused) && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setValue("");
              onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
              onClose?.();
            }}
            whileTap={{ scale: 0.9 }}
            className="text-neutral-500 dark:text-zinc-500 hover:text-white dark:hover:text-zinc-200 transition-colors">
            <X />
          </motion.button>
        )}

        {/* Arrow submit button */}
        {value && (
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="text-white dark:text-zinc-200"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 18l6-6-6-6" />
            </svg>
          </motion.button>
        )}
      </div>
      {/* )} */}
    </form>
  );
}
