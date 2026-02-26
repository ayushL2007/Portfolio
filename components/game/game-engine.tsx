"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// --- CONSTANTS ---
const TILE = 32;
const COLS = 30;
const ROWS = 20;
const CANVAS_W = COLS * TILE;
const CANVAS_H = ROWS * TILE;

// Player sprite frames (simple 2-frame walk)
const DIRECTIONS = { down: 0, left: 1, right: 2, up: 3 };

// Building definitions
export interface Building {
  id: string;
  label: string;
  col: number;
  row: number;
  w: number;
  h: number;
  color: string;
  roofColor: string;
  doorCol: number;
  doorRow: number;
  icon: string;
}

export const BUILDINGS: Building[] = [
  {
    id: "about",
    label: "PROF. OAK'S LAB",
    col: 3,
    row: 3,
    w: 5,
    h: 4,
    color: "#8b6f47",
    roofColor: "#e8433f",
    doorCol: 5,
    doorRow: 7,
    icon: "A",
  },
  {
    id: "projects",
    label: "POKE GYM",
    col: 12,
    row: 2,
    w: 6,
    h: 4,
    color: "#6b5b3a",
    roofColor: "#f7d51d",
    doorCol: 15,
    doorRow: 6,
    icon: "P",
  },
  {
    id: "experience",
    label: "POKE CENTER",
    col: 22,
    row: 3,
    w: 5,
    h: 4,
    color: "#8b6f47",
    roofColor: "#e8433f",
    doorCol: 24,
    doorRow: 7,
    icon: "E",
  },
  {
    id: "education",
    label: "TRAINER SCHOOL",
    col: 5,
    row: 12,
    w: 5,
    h: 4,
    color: "#7a6840",
    roofColor: "#5b6ee1",
    doorCol: 7,
    doorRow: 16,
    icon: "S",
  },
  {
    id: "contact",
    label: "POST OFFICE",
    col: 18,
    row: 12,
    w: 5,
    h: 4,
    color: "#6b5b3a",
    roofColor: "#3e8948",
    doorCol: 20,
    doorRow: 16,
    icon: "C",
  },
];

// Collision map
function buildCollisionMap(): boolean[][] {
  const map: boolean[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  );

  // Border walls
  for (let c = 0; c < COLS; c++) {
    map[0][c] = true;
    map[ROWS - 1][c] = true;
  }
  for (let r = 0; r < ROWS; r++) {
    map[r][0] = true;
    map[r][COLS - 1] = true;
  }

  // Building bodies (but not doors)
  for (const b of BUILDINGS) {
    for (let r = b.row; r < b.row + b.h; r++) {
      for (let c = b.col; c < b.col + b.w; c++) {
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          map[r][c] = true;
        }
      }
    }
    // Door is walkable
    if (
      b.doorRow >= 0 &&
      b.doorRow < ROWS &&
      b.doorCol >= 0 &&
      b.doorCol < COLS
    ) {
      map[b.doorRow][b.doorCol] = false;
    }
  }

  // Trees / decorations around edges
  const treePositions = [
    [1, 1],
    [1, 10],
    [1, 20],
    [1, 28],
    [10, 1],
    [10, 28],
    [18, 1],
    [18, 14],
    [18, 28],
    [9, 10],
    [9, 20],
    [18, 10],
  ];
  for (const [r, c] of treePositions) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      map[r][c] = true;
    }
  }

  return map;
}

// Draw a pixel-art tree
function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Trunk
  ctx.fillStyle = "#5c3a1e";
  ctx.fillRect(x + 12, y + 18, 8, 14);
  // Leaves
  ctx.fillStyle = "#3e8948";
  ctx.fillRect(x + 4, y + 2, 24, 18);
  ctx.fillStyle = "#265c42";
  ctx.fillRect(x + 8, y + 6, 16, 10);
  // Highlight
  ctx.fillStyle = "#4aba5a";
  ctx.fillRect(x + 6, y + 4, 6, 6);
}

// Draw a building
function drawBuilding(ctx: CanvasRenderingContext2D, b: Building) {
  const x = b.col * TILE;
  const y = b.row * TILE;
  const w = b.w * TILE;
  const h = b.h * TILE;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(x + 4, y + 4, w, h);

  // Main body
  ctx.fillStyle = b.color;
  ctx.fillRect(x, y, w, h);

  // Roof (triangle-like pixel roof)
  ctx.fillStyle = b.roofColor;
  ctx.fillRect(x - 4, y - 8, w + 8, 12);
  ctx.fillRect(x + 4, y - 14, w - 8, 8);
  ctx.fillRect(x + 12, y - 18, w - 24, 6);

  // Windows
  ctx.fillStyle = "#639bff";
  const winSize = 10;
  // Left window
  ctx.fillRect(x + 12, y + 14, winSize, winSize);
  ctx.fillRect(x + 12, y + 14, winSize / 2, winSize / 2);
  // Right window
  ctx.fillRect(x + w - 22, y + 14, winSize, winSize);
  ctx.fillRect(x + w - 22, y + 14, winSize / 2, winSize / 2);

  // Window cross
  ctx.fillStyle = b.color;
  ctx.fillRect(x + 16, y + 14, 2, winSize);
  ctx.fillRect(x + 12, y + 18, winSize, 2);
  ctx.fillRect(x + w - 18, y + 14, 2, winSize);
  ctx.fillRect(x + w - 22, y + 18, winSize, 2);

  // Door
  const doorX = b.doorCol * TILE;
  const doorY = (b.row + b.h - 1) * TILE;
  ctx.fillStyle = "#4a2810";
  ctx.fillRect(doorX + 8, doorY - 4, 16, 20);
  ctx.fillStyle = "#f7d51d";
  ctx.fillRect(doorX + 18, doorY + 4, 4, 4);

  // Sign below building
  ctx.fillStyle = "#1a1c2c";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText(b.label, x + w / 2, y + h + 10);
}

// Draw player character (pixel art trainer)
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: number,
  frame: number
) {
  const px = x * TILE;
  const py = y * TILE;

  // Body offset for walking
  const bobble = frame % 2 === 0 ? 0 : -1;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(px + 6, py + 26, 20, 6);

  // Shoes
  ctx.fillStyle = "#e8433f";
  if (frame % 2 === 0) {
    ctx.fillRect(px + 8, py + 24, 6, 4);
    ctx.fillRect(px + 18, py + 24, 6, 4);
  } else {
    ctx.fillRect(px + 6, py + 24, 6, 4);
    ctx.fillRect(px + 20, py + 24, 6, 4);
  }

  // Legs
  ctx.fillStyle = "#5b6ee1";
  ctx.fillRect(px + 10, py + 18 + bobble, 4, 6);
  ctx.fillRect(px + 18, py + 18 + bobble, 4, 6);

  // Body
  ctx.fillStyle = "#e8433f";
  ctx.fillRect(px + 8, py + 8 + bobble, 16, 12);

  // Arms
  ctx.fillStyle = "#e8433f";
  if (dir === DIRECTIONS.left) {
    ctx.fillRect(px + 4, py + 10 + bobble, 4, 8);
    ctx.fillRect(px + 24, py + 12 + bobble, 4, 6);
  } else if (dir === DIRECTIONS.right) {
    ctx.fillRect(px + 24, py + 10 + bobble, 4, 8);
    ctx.fillRect(px + 4, py + 12 + bobble, 4, 6);
  } else {
    ctx.fillRect(px + 4, py + 10 + bobble, 4, 8);
    ctx.fillRect(px + 24, py + 10 + bobble, 4, 8);
  }

  // Skin (hands/neck)
  ctx.fillStyle = "#f5c6a5";
  ctx.fillRect(px + 4, py + 16 + bobble, 4, 3);
  ctx.fillRect(px + 24, py + 16 + bobble, 4, 3);

  // Head
  ctx.fillStyle = "#f5c6a5";
  ctx.fillRect(px + 8, py + bobble, 16, 10);

  // Hair
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 6, py - 2 + bobble, 20, 5);
  if (dir === DIRECTIONS.left || dir === DIRECTIONS.down) {
    ctx.fillRect(px + 6, py + bobble, 4, 7);
  }
  if (dir === DIRECTIONS.right || dir === DIRECTIONS.down) {
    ctx.fillRect(px + 22, py + bobble, 4, 7);
  }

  // Eyes
  ctx.fillStyle = "#1a1c2c";
  if (dir === DIRECTIONS.up) {
    // back of head
  } else {
    ctx.fillRect(px + 11, py + 4 + bobble, 3, 3);
    ctx.fillRect(px + 18, py + 4 + bobble, 3, 3);
    // Eye whites
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 12, py + 4 + bobble, 1, 2);
    ctx.fillRect(px + 19, py + 4 + bobble, 1, 2);
  }

  // Hat
  ctx.fillStyle = "#e8433f";
  ctx.fillRect(px + 6, py - 4 + bobble, 20, 4);
  ctx.fillRect(px + 4, py - 2 + bobble, 24, 2);
  // Hat logo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(px + 14, py - 3 + bobble, 4, 2);
}

interface GameEngineProps {
  onBuildingEnter: (buildingId: string) => void;
  modalOpen: boolean;
}

export default function GameEngine({
  onBuildingEnter,
  modalOpen,
}: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({ x: 15, y: 10, dir: DIRECTIONS.down, frame: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const collisionMap = useRef(buildCollisionMap());
  const nearBuildingRef = useRef<string | null>(null);
  const [nearBuilding, setNearBuilding] = useState<string | null>(null);
  const moveTimerRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  // Ground pattern
  const drawGround = useCallback((ctx: CanvasRenderingContext2D) => {
    // Base grass
    ctx.fillStyle = "#4a7a2e";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grass texture
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * TILE;
        const y = r * TILE;
        // Checkerboard grass variation
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = "#508a32";
          ctx.fillRect(x, y, TILE, TILE);
        }
        // Random grass detail
        const seed = (r * 31 + c * 17) % 7;
        if (seed === 0) {
          ctx.fillStyle = "#3e8948";
          ctx.fillRect(x + 4, y + 12, 2, 6);
          ctx.fillRect(x + 8, y + 10, 2, 8);
        }
        if (seed === 3) {
          ctx.fillStyle = "#5aad5e";
          ctx.fillRect(x + 14, y + 8, 3, 3);
        }
      }
    }

    // Paths (lighter dirt)
    ctx.fillStyle = "#c4a66a";
    // Horizontal main road
    for (let c = 1; c < COLS - 1; c++) {
      ctx.fillRect(c * TILE, 9 * TILE, TILE, TILE * 2);
    }
    // Vertical paths to buildings
    // To about lab door
    for (let r = 7; r <= 9; r++)
      ctx.fillRect(5 * TILE, r * TILE, TILE, TILE);
    // To gym door
    for (let r = 6; r <= 9; r++)
      ctx.fillRect(15 * TILE, r * TILE, TILE, TILE);
    // To poke center door
    for (let r = 7; r <= 9; r++)
      ctx.fillRect(24 * TILE, r * TILE, TILE, TILE);
    // To school door
    for (let r = 10; r <= 16; r++)
      ctx.fillRect(7 * TILE, r * TILE, TILE, TILE);
    // To post office door
    for (let r = 10; r <= 16; r++)
      ctx.fillRect(20 * TILE, r * TILE, TILE, TILE);

    // Path edges
    ctx.fillStyle = "#b09050";
    for (let c = 1; c < COLS - 1; c++) {
      ctx.fillRect(c * TILE, 9 * TILE, TILE, 2);
      ctx.fillRect(c * TILE, 11 * TILE - 2, TILE, 2);
    }

    // Fence along border
    ctx.fillStyle = "#5c3a1e";
    for (let c = 0; c < COLS; c++) {
      // Top
      ctx.fillRect(c * TILE + 2, 2, TILE - 4, 4);
      ctx.fillRect(c * TILE + 14, 0, 4, 8);
      // Bottom
      ctx.fillRect(c * TILE + 2, CANVAS_H - 6, TILE - 4, 4);
      ctx.fillRect(c * TILE + 14, CANVAS_H - 8, 4, 8);
    }
    for (let r = 0; r < ROWS; r++) {
      // Left
      ctx.fillRect(2, r * TILE + 2, 4, TILE - 4);
      ctx.fillRect(0, r * TILE + 14, 8, 4);
      // Right
      ctx.fillRect(CANVAS_W - 6, r * TILE + 2, 4, TILE - 4);
      ctx.fillRect(CANVAS_W - 8, r * TILE + 14, 8, 4);
    }
  }, []);

  // Check proximity to buildings
  const checkProximity = useCallback(() => {
    const p = playerRef.current;
    let found: string | null = null;
    for (const b of BUILDINGS) {
      if (p.x === b.doorCol && p.y === b.doorRow) {
        found = b.id;
        break;
      }
      // Also check one tile in front of door
      if (p.x === b.doorCol && p.y === b.doorRow + 1) {
        found = b.id;
        break;
      }
    }
    nearBuildingRef.current = found;
    setNearBuilding(found);
  }, []);

  // Game loop
  const gameLoop = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const now = performance.now();
      const p = playerRef.current;
      const keys = keysRef.current;

      // Movement (throttled)
      if (!modalOpen && now - moveTimerRef.current > 120) {
        let nx = p.x;
        let ny = p.y;
        let moved = false;

        if (keys.has("ArrowUp") || keys.has("w")) {
          ny--;
          p.dir = DIRECTIONS.up;
          moved = true;
        } else if (keys.has("ArrowDown") || keys.has("s")) {
          ny++;
          p.dir = DIRECTIONS.down;
          moved = true;
        } else if (keys.has("ArrowLeft") || keys.has("a")) {
          nx--;
          p.dir = DIRECTIONS.left;
          moved = true;
        } else if (keys.has("ArrowRight") || keys.has("d")) {
          nx++;
          p.dir = DIRECTIONS.right;
          moved = true;
        }

        if (
          moved &&
          nx >= 0 &&
          nx < COLS &&
          ny >= 0 &&
          ny < ROWS &&
          !collisionMap.current[ny][nx]
        ) {
          p.x = nx;
          p.y = ny;
          p.frame++;
          moveTimerRef.current = now;
          checkProximity();
        }
      }

      // Draw
      drawGround(ctx);

      // Trees
      const treePositions = [
        [1, 1],
        [1, 10],
        [1, 20],
        [1, 28],
        [10, 1],
        [10, 28],
        [18, 1],
        [18, 14],
        [18, 28],
        [9, 10],
        [9, 20],
        [18, 10],
      ];
      for (const [r, c] of treePositions) {
        drawTree(ctx, c * TILE, r * TILE);
      }

      // Draw buildings (behind player if player below)
      const buildingsBehind = BUILDINGS.filter(
        (b) => b.row + b.h <= p.y
      );
      const buildingsFront = BUILDINGS.filter(
        (b) => b.row + b.h > p.y
      );

      for (const b of buildingsBehind) drawBuilding(ctx, b);
      drawPlayer(ctx, p.x, p.y, p.dir, p.frame);
      for (const b of buildingsFront) drawBuilding(ctx, b);

      // Interaction prompt
      if (nearBuildingRef.current && !modalOpen) {
        const b = BUILDINGS.find((b) => b.id === nearBuildingRef.current);
        if (b) {
          const promptX = b.doorCol * TILE + TILE / 2;
          const promptY = (b.doorRow + 1) * TILE + TILE + 4;

          // Speech bubble
          ctx.fillStyle = "#1a1c2c";
          ctx.strokeStyle = "#f4f4f5";
          ctx.lineWidth = 2;

          const text = "ENTER";
          ctx.font = "bold 8px monospace";
          const tw = ctx.measureText(text).width;
          const bw = tw + 16;
          const bh = 18;
          const bx = promptX - bw / 2;
          const by = promptY - 2;

          ctx.fillRect(bx, by, bw, bh);
          ctx.strokeRect(bx, by, bw, bh);

          // Triangle
          ctx.fillStyle = "#1a1c2c";
          ctx.beginPath();
          ctx.moveTo(promptX - 4, by);
          ctx.lineTo(promptX + 4, by);
          ctx.lineTo(promptX, by - 6);
          ctx.fill();

          ctx.fillStyle = "#f7d51d";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(text, promptX, by + bh / 2);
        }
      }

      animFrameRef.current = requestAnimationFrame(() => gameLoop(ctx));
    },
    [modalOpen, drawGround, checkProximity]
  );

  // Initialize canvas + input
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());

      if (
        (e.key === "Enter" || e.key === " ") &&
        nearBuildingRef.current &&
        !modalOpen
      ) {
        e.preventDefault();
        onBuildingEnter(nearBuildingRef.current);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    checkProximity();
    animFrameRef.current = requestAnimationFrame(() => gameLoop(ctx));

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameLoop, onBuildingEnter, modalOpen, checkProximity]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block border-4 border-border"
        style={{
          width: "100%",
          maxWidth: `${CANVAS_W}px`,
          imageRendering: "pixelated",
        }}
      />
      {nearBuilding && !modalOpen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 border border-border px-4 py-2 text-[10px] text-accent animate-pulse">
          {"Press ENTER or SPACE to go inside"}
        </div>
      )}
    </div>
  );
}
