import { httpGet, httpPost, httpPut, httpDelete } from "./httpClient";
import { Poem } from "../models/Poem";

// Get all poems
export async function fetchPoemList() {
    const data = await httpGet("/api/poem/list");
    return Poem.fromJsonArray(data);
}

// Get poem by ID
export async function fetchPoemById(id) {
    const data = await httpGet(`/api/poem/${id}`);
    return Poem.fromJson(data);
}

// Create new poem
export async function createPoem(title, text) {
    const data = await httpPost("/api/poem/add", { title, text });
    return Poem.fromJson(data);
}

// Update poem
export async function updatePoem(id, title, text) {
    const data = await httpPut(`/api/poem/${id}`, { title, text });
    return Poem.fromJson(data);
}

// Delete poem
export function deletePoem(id) {
    return httpDelete(`/api/poem/${id}`);
}

// Get total poem count
export function getPoemCount() {
    return httpGet("/api/poem/count");
}

// Search poems by title
export async function searchPoemsByTitle(title) {
    const data = await httpGet(`/api/poem/search/${title}`);
    return Poem.fromJsonArray(data);
}