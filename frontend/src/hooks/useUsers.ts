import { useEffect, useState } from "react";
import { fetchUserList } from "../api/userApi";
import { User } from "../models/User";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserList()
            .then(setUsers)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { users, loading, error };
}
