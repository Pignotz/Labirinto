import { httpGet } from "./httpClient";
import { Photo } from "../models/Photo";

/**
 * Get a random photo that the specified user hasn't collected yet.
 * Returns null if all photos have been collected by the user.
 */
export async function getRandomUncollectedPhoto(userId: number): Promise<Photo | null> {
    try {
        const data = await httpGet(`/api/photo/random-uncollected/${userId}`);
        return data ? Photo.fromJson(data) : null;
    } catch (error) {
        console.error("Error fetching uncollected photo:", error);
        return null;
    }
}
