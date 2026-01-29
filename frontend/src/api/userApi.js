import { httpGet, httpPost, httpPut, httpDelete } from "./httpClient";
import { User } from "../models/User";

// Get all users
export async function fetchUserList() {
    const data = await httpGet("/api/user/list");
    return User.fromJsonArray(data);
}

// Get user by ID
export async function fetchUserById(id) {
    const data = await httpGet(`/api/user/${id}`);
    return User.fromJson(data);
}

// Create new user
export async function createUser(username) {
    const data = await httpPost("/api/user/add", { username });
    return User.fromJson(data);
}

// Update user
export async function updateUser(id, username) {
    const data = await httpPut(`/api/user/${id}`, { username });
    return User.fromJson(data);
}

// Delete user
export function deleteUser(id) {
    return httpDelete(`/api/user/${id}`);
}

// Get total user count
export function getUserCount() {
    return httpGet("/api/user/count");
}
