import { httpGet, httpPost, httpDelete } from "./httpClient";
import { UserPoem } from "../models/UserPoem";

// Get all user-poem associations
export async function fetchUserPoemList() {
    const data = await httpGet("/api/user_poem/list");
    return UserPoem.fromJsonArray(data);
}

// Add poem to user
export async function addPoemToUser(userId: number, poemId: number) {
    const data = await httpPost("/api/user_poem/add", { userId, poemId });
    return UserPoem.fromJson(data);
}

// Remove poem from user
export function removePoemFromUser(userId: number, poemId: number) {
    return httpDelete(`/api/user_poem/${userId}/${poemId}`);
}

// Get total user-poem associations count
export function getUserPoemCount() {
    return httpGet("/api/user_poem/count");
}

// Get all poems for a specific user
export async function getUserPoems(userId: number) {
    const data = await httpGet(`/api/user_poem/user/${userId}`);
    return UserPoem.fromJsonArray(data);
}

// Get all users who have a specific poem
export async function getPoemUsers(poemId: number) {
    const data = await httpGet(`/api/user_poem/poem/${poemId}`);
    return UserPoem.fromJsonArray(data);
}
