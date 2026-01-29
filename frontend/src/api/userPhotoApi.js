import { httpGet, httpPost, httpDelete } from "./httpClient";
import { UserPhoto } from "../models/UserPhoto";

// Get all user-photo associations
export async function fetchUserPhotoList() {
    const data = await httpGet("/api/user_photo/list");
    return UserPhoto.fromJsonArray(data);
}

// Add photo to user
export async function addPhotoToUser(userId, photoId) {
    const data = await httpPost("/api/user_photo/add", { userId, photoId });
    return UserPhoto.fromJson(data);
}

// Remove photo from user
export function removePhotoFromUser(userId, photoId) {
    return httpDelete(`/api/user_photo/${userId}/${photoId}`);
}

// Get total user-photo associations count
export function getUserPhotoCount() {
    return httpGet("/api/user_photo/count");
}

// Get all photos for a specific user
export async function getUserPhotos(userId) {
    const data = await httpGet(`/api/user_photo/user/${userId}`);
    return UserPhoto.fromJsonArray(data);
}

// Get all users who have a specific photo
export async function getPhotoUsers(photoId) {
    const data = await httpGet(`/api/user_photo/photo/${photoId}`);
    return UserPhoto.fromJsonArray(data);
}
