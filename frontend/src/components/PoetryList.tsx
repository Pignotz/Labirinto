import React from "react";
import { Poem } from "../models/Poem";

type Props = { items: Poem[] };

export default function PoetryList({ items }: Props) {
    return (
        <ul className="space-y-2">
            {items.map((poem) => (
                <li key={poem.id} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-semibold">{poem.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{poem.text}</p>
                </li>
            ))}
        </ul>
    );
}
