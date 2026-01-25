import { httpGet } from "./httpClient";
export function fetchPoetryList(){ return httpGet("/poetry/list"); }