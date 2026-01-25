import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default function HelpPage(): JSX.Element {
    return (
        <div className="p-4">
            <Card>
                <CardHeader className="text-lg font-bold">Guida al Labirinto</CardHeader>
                <CardBody>
                    <h3 className="font-semibold">Obiettivo</h3>
                    <p>
                        Muoviti attraverso il labirinto fino al cuore al centro. Usa le frecce o WASD
                        per spostarti.
                    </p>

                    <h3 className="font-semibold mt-3">Celle speciali</h3>
                    <p>
                        Alcune celle contengono sorprese: quando le visiti appare un'immagine o un
                        oggetto da collezione.
                    </p>

                    <h3 className="font-semibold mt-3">Suggerimenti</h3>
                    <ul className="list-disc pl-5">
                        <li>
                            Premi il pulsante <strong>?</strong> per aprire questa guida.
                        </li>
                        <li>All'inizio hai visione completa; successivamente vedrai solo le celle vicine.</li>
                        <li>Esplora con calma e raccogli gli oggetti speciali.</li>
                    </ul>
                </CardBody>
            </Card>
        </div>
    );
}
