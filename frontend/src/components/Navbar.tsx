import React, { useState } from "react";
import { Navbar as HeroNavbar, NavbarBrand } from "@heroui/react";
import LogoMaze from "./LogoMaze";
import GlassCard from "./GlassCard";
type Props = { onHelpToggle: () => void };

export default function Navbar({ onHelpToggle }: Props) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <GlassCard>
        <HeroNavbar className="text-black/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between py-3">
                <NavbarBrand>
                    <div className="flex items-left gap-3">
                        <LogoMaze size={40} />
                    </div>
                </NavbarBrand>

                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold tracking-wide">Labyrinth Quest</div>
                        <div className="text-xs text-black/80">Esplora. Scopri. Colleziona.</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20"
                        onClick={() => {
                            if (onHelpToggle) onHelpToggle();
                        }}
                        aria-label="Guida"
                        title="Guida"
                    >
                        <span className="text-lg">❓</span>
                    </button>

                    <button
                        className="md:hidden p-2 rounded-md bg-white/10"
                        onClick={() => setOpen((s) => !s)}
                        aria-expanded={open}
                        aria-label="Apri menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {open && (
                <div className="md:hidden bg-white/5 border-t border-white/10">
                    <div className="px-4 py-3 space-y-2">
                        <div className="text-sm text-white/80">Labyrinth Quest</div>
                    </div>
                </div>
            )}
        </HeroNavbar>
        </GlassCard>
    );
}
