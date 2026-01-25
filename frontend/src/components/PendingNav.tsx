import React from "react";

type PendingNav = { kind: "switch"; key: string } | { kind: "help" } | null;

interface Props {
    pendingNav: PendingNav;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function PendingNav({ pendingNav, onCancel, onConfirm }: Props) {
    if (!pendingNav) return null;

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

            <div className="bg-white rounded-md p-4 z-10 w-full max-w-sm shadow">
                <h3 className="text-lg font-semibold mb-2">Confermi l'uscita?</h3>
                <p className="text-sm text-neutral-700 mb-4">Sei sicuro di voler lasciare il labirinto? Lo stato corrente verrà perso.</p>

                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 rounded bg-gray-200" onClick={onCancel}>
                        Annulla
                    </button>
                    <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={onConfirm}>
                        Procedi
                    </button>
                </div>
            </div>
        </div>
    );
}
