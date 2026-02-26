"use client";

import { BUILDINGS } from "./game-engine";

interface GameHUDProps {
  onBuildingClick: (id: string) => void;
}

export default function GameHUD({ onBuildingClick }: GameHUDProps) {
  const buildingLabels: Record<string, string> = {
    about: "About Me",
    projects: "Projects",
    experience: "Experience",
    education: "Education",
    contact: "Contact",
  };

  const buildingColors: Record<string, string> = {
    about: "bg-primary",
    projects: "bg-accent text-accent-foreground",
    experience: "bg-primary",
    education: "bg-chart-4",
    contact: "bg-secondary",
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
      {BUILDINGS.map((b) => (
        <button
          key={b.id}
          onClick={() => onBuildingClick(b.id)}
          className={`text-[8px] px-2.5 py-1.5 ${buildingColors[b.id] || "bg-muted text-muted-foreground"} hover:opacity-80 transition-opacity border border-border`}
        >
          {buildingLabels[b.id] || b.label}
        </button>
      ))}
    </div>
  );
}
