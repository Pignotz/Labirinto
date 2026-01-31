// components/GlassCard.tsx
import { Card } from "@heroui/react";

export default function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <Card className={`bg-white/50 backdrop-blur-sm rounded-md m-3 p-4 shadow-md ${className}`}>
            {children}
        </Card>
    );
}
