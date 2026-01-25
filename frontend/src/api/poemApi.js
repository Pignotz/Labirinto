import { httpGet } from "./httpClient";
export function fetchPoetryList(){ return httpGet("/api/poem/list"); }