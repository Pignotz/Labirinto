import { Button, Card, Input, Spinner } from "@heroui/react";
import { User } from "../models/User";
import { useEffect, useState } from "react";
import { createUser, fetchUserList } from "../api/userApi";
import GlassCard from "../components/GlassCard";
import MyButton from "../components/MyButton";
type Props = {
    onUserSelected: (u: User) => void;
};

export default function UserSelectionPage({ onUserSelected }: Props) {
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
            <GlassCard  className="flex flex-col p-4 justify-center items-center">
                <Spinner label="Caricamento utenti..." />
            </GlassCard>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen background">
            <GlassCard className="p-6 w-100">
                <h2 className="text-xl font-bold mb-4">Scegli il tuo salvataggio</h2>
                {users.length > 0 && (
                <div className="flex flex-col gap-2">
                    {users.map((user) => (
                        <MyButton
                            className="bg-pink-300 text-rose-900 hover:bg-pink-400"                            
                            key={user.id}
                            onPress={() => handleSelectUser(user.id.toString())}
                        >
                            {user.username}
                        </MyButton>
                    ))}
                </div>
            )}

            {(
                <div>
                    {!showCreateForm ? (
                        <MyButton
                            onPress={() => setShowCreateForm(true)}
                            className="w-full"
                        >
                            + Nuovo Giocatore
                        </MyButton>
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
            </GlassCard>
        </div>
    );
}
