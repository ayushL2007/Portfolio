"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import PortfolioModal from "@/components/game/portfolio-modal";
import MobileControls from "@/components/game/mobile-controls";
import GameHUD from "@/components/game/game-hud";

const GameEngine = dynamic(() => import("@/components/game/game-engine"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full aspect-[30/20] max-w-[960px] bg-card border-4 border-border">
      <div className="text-[10px] text-muted-foreground animate-pulse">
        {"Loading world..."}
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBuildingEnter = useCallback((buildingId: string) => {
    setActiveSection(buildingId);
  }, []);

  const handleClose = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleMobileAction = useCallback(() => {
    // Simulate Enter key
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );
    setTimeout(() => {
      window.dispatchEvent(
        new KeyboardEvent("keyup", { key: "Enter", bubbles: true })
      );
    }, 50);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      {/* Title Banner */}
      <header className="text-center space-y-2">
        <h1 className="text-[14px] md:text-[18px] text-foreground tracking-wider leading-relaxed">
          {"AYUSH LAHIRI"}
        </h1>
        <p className="text-[8px] text-muted-foreground leading-relaxed">
          {"~ Walk around the town. Enter buildings to explore. ~"}
        </p>
      </header>

      {/* Controls hint (desktop) */}
      <div className="hidden md:flex items-center gap-4 text-[8px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="bg-muted px-1.5 py-0.5 border border-border text-[7px]">{"WASD"}</kbd>
          {" / "}
          <kbd className="bg-muted px-1.5 py-0.5 border border-border text-[7px]">{"Arrows"}</kbd>
          {" Move"}
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-muted px-1.5 py-0.5 border border-border text-[7px]">{"Enter"}</kbd>
          {" Interact"}
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-muted px-1.5 py-0.5 border border-border text-[7px]">{"Esc"}</kbd>
          {" Close"}
        </span>
      </div>

      {/* Game Canvas */}
      <div className="w-full flex justify-center">
        <GameEngine
          onBuildingEnter={handleBuildingEnter}
          modalOpen={activeSection !== null}
        />
      </div>

      {/* Mobile Controls */}
      <MobileControls onAction={handleMobileAction} />

      {/* Quick-nav buttons */}
      <GameHUD onBuildingClick={handleBuildingEnter} />

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[7px] text-muted-foreground mt-1">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-primary inline-block" /> {"Prof. Oak's Lab (About)"}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-accent inline-block" /> {"Poke Gym (Projects)"}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-primary inline-block" /> {"Poke Center (Experience)"}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-chart-4 inline-block" /> {"Trainer School (Education)"}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-secondary inline-block" /> {"Post Office (Contact)"}
        </span>
      </div>

      {/* Section Modal */}
      <PortfolioModal section={activeSection} onClose={handleClose} />
    </main>
  );
}
