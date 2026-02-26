"use client";

import { useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface MobileControlsProps {
  onAction: () => void;
}

export default function MobileControls({ onAction }: MobileControlsProps) {
  const simulateKey = useCallback((key: string, type: "keydown" | "keyup") => {
    window.dispatchEvent(
      new KeyboardEvent(type, { key, bubbles: true })
    );
  }, []);

  const handlePointerDown = useCallback(
    (key: string) => {
      simulateKey(key, "keydown");
    },
    [simulateKey]
  );

  const handlePointerUp = useCallback(
    (key: string) => {
      simulateKey(key, "keyup");
    },
    [simulateKey]
  );

  const btnClass =
    "flex items-center justify-center w-12 h-12 bg-card border-2 border-border text-foreground active:bg-muted active:scale-95 transition-all select-none touch-none";

  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto mt-3 px-4 md:hidden">
      {/* D-Pad */}
      <div className="grid grid-cols-3 grid-rows-3 gap-0.5">
        <div />
        <button
          className={btnClass}
          onPointerDown={() => handlePointerDown("ArrowUp")}
          onPointerUp={() => handlePointerUp("ArrowUp")}
          onPointerLeave={() => handlePointerUp("ArrowUp")}
          aria-label="Move up"
        >
          <ChevronUp size={20} />
        </button>
        <div />
        <button
          className={btnClass}
          onPointerDown={() => handlePointerDown("ArrowLeft")}
          onPointerUp={() => handlePointerUp("ArrowLeft")}
          onPointerLeave={() => handlePointerUp("ArrowLeft")}
          aria-label="Move left"
        >
          <ChevronLeft size={20} />
        </button>
        <div />
        <button
          className={btnClass}
          onPointerDown={() => handlePointerDown("ArrowRight")}
          onPointerUp={() => handlePointerUp("ArrowRight")}
          onPointerLeave={() => handlePointerUp("ArrowRight")}
          aria-label="Move right"
        >
          <ChevronRight size={20} />
        </button>
        <div />
        <button
          className={btnClass}
          onPointerDown={() => handlePointerDown("ArrowDown")}
          onPointerUp={() => handlePointerUp("ArrowDown")}
          onPointerLeave={() => handlePointerUp("ArrowDown")}
          aria-label="Move down"
        >
          <ChevronDown size={20} />
        </button>
        <div />
      </div>

      {/* Action button */}
      <button
        className="w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-primary/50 text-[10px] font-bold active:scale-95 transition-transform select-none touch-none"
        onPointerDown={onAction}
        aria-label="Enter building"
      >
        {"A"}
      </button>
    </div>
  );
}
