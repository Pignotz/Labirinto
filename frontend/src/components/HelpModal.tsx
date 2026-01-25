import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="bg-white rounded-md p-4 z-10 w-full max-w-md shadow">
                <h3 className="text-lg font-semibold mb-2">Guida al Labirinto</h3>

                <div className="text-sm text-neutral-800">
                    <h4 className="font-semibold">Obiettivo</h4>
                    <p>Muoviti attraverso il labirinto fino al cuore al centro. Usa le frecce o WASD per spostarti.</p>

                    <h4 className="font-semibold mt-3">Celle speciali</h4>
                    <p>Alcune celle contengono sorprese: quando le visiti appare un'immagine o un oggetto da collezione.</p>

                    <h4 className="font-semibold mt-3">Suggerimenti</h4>
                    <ul className="list-disc pl-5">
                        <li>Premi il pulsante <strong>?</strong> per aprire questa guida.</li>
                        <li>All'inizio hai visione completa; successivamente vedrai solo le celle vicine.</li>
                        <li>Esplora con calma e raccogli gli oggetti speciali.</li>
                    </ul>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>Chiudi</button>
                </div>
            </div>
        </div>
    );
}
