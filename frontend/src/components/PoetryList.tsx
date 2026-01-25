import React from "react";

type Item = { id: string | number; title: string };
type Props = { items: Item[] };

export default function PoetryList({ items }: Props): JSX.Element {
    return (
        <ul className="space-y-2">
            {items.map((p) => (
                <li key={p.id} className="p-2 border rounded hover:bg-gray-50">
                    {p.title}
                </li>
            ))}
        </ul>
    );
}
