import React from "react";
import { Card } from "@heroui/react";
import { User } from "../models/User";
import UserSelector from "./UserSelector";

type Props = { 
    className?: string;
    onUserSelected?: (user: User) => void;
    selectedUser?: User | null;
};

export default function RightSideBar({ className = "", onUserSelected, selectedUser }: Props): JSX.Element {
    return (
        <Card className={`flex flex-col glass ${className} overflow-auto`}>
            {onUserSelected && (
                <UserSelector onUserSelected={onUserSelected} selectedUser={selectedUser || null} />
            )}
        </Card>
    );
}
