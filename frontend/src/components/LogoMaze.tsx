import React from "react";

type Props = { size?: number; className?: string };

export default function LogoMaze({ size = 36, className = "" }: Props): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 64 64"
            className={className}
            fill="none"
        >
            <rect width="64" height="64" rx="8" fill="#FFFFFF" fillOpacity="0.03" />
            <path
                d="M8 32h8v8h8v8h16V16H8v16z"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24 24h8v8h-8z"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <g transform="translate(32 32)">
                <path
                    d="M0 -6c2.2-4 8-4 10 0 2.3-4 8.1-4 10 0 1.9 4-2 9.4-10 14-8-4.6-11.9-10-10-14z"
                    fill="#FF6B6B"
                    transform="translate(-10 -6) scale(0.6)"
                />
            </g>
        </svg>
    );
}
