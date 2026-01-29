import { useEffect, useState } from "react";
import { fetchUserPhotoList } from "../api/userPhotoApi";
import { UserPhoto } from "../models/UserPhoto";

export function useUserPhotos() {
    const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserPhotoList()
            .then(setUserPhotos)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { userPhotos, loading, error };
}
