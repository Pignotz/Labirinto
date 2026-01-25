import React, { useState } from "react";
import Navbar from "../components/Navbar";
import LabyrinthPage from "../pages/LabyrinthPage";
import HelpModal from "../components/HelpModal";
import { Card } from "@heroui/react";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import PendingNav from "../components/PendingNav";

type PendingNavType =
    | { kind: "switch"; key: string }
    | { kind: "help" }
    | null;

export default function AppLayout() {
    const [showHelp, setShowHelp] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState<string>("play");
    const [pendingNav, setPendingNav] = useState<PendingNavType>(null);

    const attemptSetActiveKey = (key: string) => {
        if (activeKey === "play" && !showHelp && key !== "play") {
            setPendingNav({ kind: "switch", key });
            return;
        }
        setActiveKey(key);
    };

    function handleConfirmPending(): void {
        if (pendingNav?.kind === "switch") {
            setActiveKey(pendingNav.key);
        } else if (pendingNav?.kind === "help") {
            setShowHelp(true);
        }
        setPendingNav(null);
    };

    function attemptToggleHelp(): void {
        setShowHelp((s) => !s);
    }

    return (
        <div className="flex flex-col h-auto background overflow-hidden">
            <Navbar onHelpToggle={attemptToggleHelp} />
            {showHelp && (
                        <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
                    )}
            <div className="grid grid-cols-[200px_1fr_200px] w-full h-100vh">
                <LeftSideBar activeKey={activeKey} setActiveKey={attemptSetActiveKey} />

                <Card className="flex-1 glass p-4 overflow-auto">
                    {activeKey === "play" && <LabyrinthPage />}
                    

                    {activeKey === "collectibles" && (
                        <div className="h-full">
                            <h2 className="text-xl font-bold mb-2">Collezionabili</h2>
                            <p className="text-neutral-600">
                                Oggetti, immagini e ricordi trovati esplorando il labirinto.
                            </p>
                        </div>
                    )}

                    {activeKey === "achievements" && (
                        <>
                            <h2 className="text-xl font-bold mb-2">Achievements</h2>
                            <ul className="list-disc pl-5 text-neutral-700">
                                <li>🏁 Primo labirinto completato</li>
                                <li>🔍 Tutte le celle speciali trovate</li>
                                <li>⏱ Completato sotto i 2 minuti</li>
                            </ul>
                        </>
                    )}
                </Card>
                <RightSideBar className="" />
            </div>

            <PendingNav
                pendingNav={pendingNav}
                onCancel={() => setPendingNav(null)}
                onConfirm={handleConfirmPending}
            />
        </div>
    );
}
