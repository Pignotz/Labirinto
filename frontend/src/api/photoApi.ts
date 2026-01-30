import { httpGet, httpPost, httpDelete } from "./httpClient";
import { Photo } from "../models/Photo";

// Get all photos
export async function fetchPhotoList() {
    const data = await httpGet("/api/photo/list");
    return Photo.fromJsonArray(data);
}

// Get photo by ID
export async function fetchPhotoById(id: number) {
    const data = await httpGet(`/api/photo/${id}`);
    return Photo.fromJson(data);
}

// Upload new photo
export async function uploadPhoto(imageData: ArrayBuffer | string) {
    const data = await httpPost("/api/photo/add", { image: imageData });
    return Photo.fromJson(data);
}

// Delete photo
export function deletePhoto(id: number) {
    return httpDelete(`/api/photo/${id}`);
}

// Get total photo count
export function getPhotoCount() {
    return httpGet("/api/photo/count");
}

// Get photos by representative color
export async function getPhotosByColor(color: string) {
    const data = await httpGet(`/api/photo/by-color/${color}`);
    return Photo.fromJsonArray(data);
}


/**
 * Get a random photo that the specified user hasn't collected yet.
 * Returns null if all photos have been collected by the user.
 */
export async function getRandomUncollectedPhoto(userId: number, excludedIds: number[]): Promise<Photo | null> {
    try {
        // Costruisco la query string
        const query = excludedIds.length > 0 
            ? "?excludedPhotoIds=" + excludedIds.join("&excludedPhotoIds=")
            : "";

        const data = await httpGet(`/api/photo/random-uncollected-with-exclusion/${userId}${query}`);
        return data ? Photo.fromJson(data) : null;
    } catch (error) {
        console.error("Error fetching uncollected photo:", error);
        return null;
    }
}
