import React from "react";
import { User } from "../models/User";
import GlassCard from "./GlassCard";
import { getUserPhotos } from "../api/userPhotoApi";
import { Photo } from "../models/Photo";
import { UserPhoto } from "../models/UserPhoto";
import { useState, useEffect } from "react";

type Props = {
    className?: string;
    selectedUser?: User | null;
};


export default function RightSideBar({ className, selectedUser }: Props) {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedUser) {
            setPhotos([]);
            return;
        }
        setLoading(true);
        getUserPhotos(selectedUser.id)
            .then(setPhotos)
            .finally(() => setLoading(false));
    }, [selectedUser]);


    return (
        <GlassCard className={`flex flex-col overflow-auto ${className}`}>
            {!selectedUser && (
                <p className="text-gray-500">No user selected</p>
            )}

            {selectedUser && (
                <>
                    <h2 className="text-lg font-bold mb-4">Your Photos</h2>
                    {loading && <p className="text-gray-400">Loading...</p>}
                    {!loading &&
                        photos.map(photo => (
                            <img
                                key={photo.id.photoId}
                                src={`/api/photo/${photo.id.photoId}/image`}
                                alt={"User Photo"}
                                className="w-full h-40 object-cover rounded-lg mb-2"
                            />
                        ))}
                </>
            )}
        </GlassCard>
    );
}
