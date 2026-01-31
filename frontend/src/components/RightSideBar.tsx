import React from "react";
import { Card } from "@heroui/react";
import { User } from "../models/User";
import GlassCard from "./GlassCard";

type Props = { 
    selectedUser?: User | null;
};

export default function RightSideBar({ selectedUser }: Props) {
    return (
        <GlassCard  className="flex flex-col overflow-auto">
            Riempi
        </GlassCard>
    );
}
