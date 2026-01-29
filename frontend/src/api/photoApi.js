import { httpGet, httpPost, httpDelete } from "./httpClient";
import { Photo } from "../models/Photo";

// Get all photos
export async function fetchPhotoList() {
    const data = await httpGet("/api/photo/list");
    return Photo.fromJsonArray(data);
}

// Get photo by ID
export async function fetchPhotoById(id) {
    const data = await httpGet(`/api/photo/${id}`);
    return Photo.fromJson(data);
}

// Upload new photo
export async function uploadPhoto(imageData) {
    const data = await httpPost("/api/photo/add", { image: imageData });
    return Photo.fromJson(data);
}

// Delete photo
export function deletePhoto(id) {
    return httpDelete(`/api/photo/${id}`);
}

// Get total photo count
export function getPhotoCount() {
    return httpGet("/api/photo/count");
}

// Get photos by representative color
export async function getPhotosByColor(color) {
    const data = await httpGet(`/api/photo/by-color/${color}`);
    return Photo.fromJsonArray(data);
}
