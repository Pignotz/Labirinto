export const API_URL = "http://localhost:8080";

export async function httpGet(path) {
    const r = await fetch(API_URL + path);
    if (!r.ok) throw new Error("request error");
    return r.json();
}

export async function httpPost(path, data) {
    const r = await fetch(API_URL + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error("request error");
    return r.json();
}

export async function httpPut(path, data) {
    const r = await fetch(API_URL + path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error("request error");
    return r.json();
}

export async function httpDelete(path) {
    const r = await fetch(API_URL + path, {
        method: "DELETE"
    });
    if (!r.ok) throw new Error("request error");
    return r.ok;
}