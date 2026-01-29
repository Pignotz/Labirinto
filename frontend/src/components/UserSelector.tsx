import React, { useState, useEffect } from "react";
import { Card, Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { User } from "../models/User";
import { fetchUserList, createUser } from "../api/userApi";

type Props = {
    onUserSelected: (user: User) => void;
    selectedUser: User | null;
};

export default function UserSelector({ onUserSelected, selectedUser }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userList = await fetchUserList();
                setUsers(userList);
            } catch (error) {
                console.error("Error loading users:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleCreateUser = async () => {
        if (!newUsername.trim()) return;
        if (users.length >= 3) return;

        try {
            setIsCreating(true);
            const newUser = await createUser(newUsername);
            setUsers([...users, newUser]);
            setNewUsername("");
            setShowCreateForm(false);
            onUserSelected(newUser);
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSelectUser = (userId: string) => {
        const user = users.find(u => u.id === parseInt(userId));
        if (user) {
            onUserSelected(user);
        }
    };

    if (loading) {
        return (
            <Card className="flex flex-col glass p-4 justify-center items-center">
                <Spinner label="Caricamento utenti..." />
            </Card>
        );
    }

    return (
        <Card className="flex flex-col glass p-4 gap-4">
            <div>
                <h3 className="text-lg font-bold mb-2">Scegli Giocatore</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Max 3 giocatori
                    {users.length > 0 && ` (${users.length}/3)`}
                </p>
            </div>

            {users.length > 0 && (
                <div className="flex flex-col gap-2">
                    {users.map((user) => (
                        <Button
                            key={user.id}
                            className={`w-full ${
                                selectedUser?.id === user.id
                                    ? "bg-purple-600"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                            onPress={() => handleSelectUser(user.id.toString())}
                        >
                            {user.username}
                        </Button>
                    ))}
                </div>
            )}

            {users.length < 3 && (
                <div>
                    {!showCreateForm ? (
                        <Button
                            color="secondary"
                            className="w-full"
                            onPress={() => setShowCreateForm(true)}
                        >
                            + Nuovo Giocatore
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Input
                                placeholder="Nome giocatore"
                                value={newUsername}
                                onValueChange={setNewUsername}
                                size="sm"
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    color="success"
                                    className="flex-1"
                                    isLoading={isCreating}
                                    onPress={handleCreateUser}
                                >
                                    Crea
                                </Button>
                                <Button
                                    size="sm"
                                    color="default"
                                    className="flex-1"
                                    onPress={() => {
                                        setShowCreateForm(false);
                                        setNewUsername("");
                                    }}
                                >
                                    Annulla
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedUser && (
                <div className="mt-4 p-3 bg-purple-900 rounded-lg">
                    <p className="text-sm">
                        <span className="font-bold">Giocatore attivo:</span> {selectedUser.username}
                    </p>
                </div>
            )}
        </Card>
    );
}
