import { useEffect, useState } from "react";
import { fetchPhotoList } from "../api/photoApi";
import { Photo } from "../models/Photo";

export function usePhotos() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPhotoList()
            .then(setPhotos)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { photos, loading, error };
}
