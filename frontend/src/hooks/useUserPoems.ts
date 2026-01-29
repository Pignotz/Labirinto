import { useEffect, useState } from "react";
import { fetchUserPoemList } from "../api/userPoemApi";
import { UserPoem } from "../models/UserPoem";

export function useUserPoems() {
    const [userPoems, setUserPoems] = useState<UserPoem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserPoemList()
            .then(setUserPoems)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { userPoems, loading, error };
}
