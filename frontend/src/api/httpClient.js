export const API_URL = "http://localhost:8080";
export async function httpGet(path){ const r=await fetch(API_URL+path); if(!r.ok) throw new Error("request error"); return r.json(); }