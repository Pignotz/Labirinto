/**
 * Photo entity model
 */
export class Photo {
    constructor(
        public id: number,
        public image: ArrayBuffer | string,
        public representativeColor: string | null
    ) {}

    static fromJson(json: any): Photo {
        return new Photo(json.id, json.image, json.representativeColor);
    }

    static fromJsonArray(jsonArray: any[]): Photo[] {
        return jsonArray.map(json => Photo.fromJson(json));
    }

    toJson() {
        return {
            id: this.id,
            image: this.image,
            representativeColor: this.representativeColor
        };
    }

    getImageUrl(): string {
        if (typeof this.image === 'string') {
            return this.image;
        }
        // If it's an ArrayBuffer, create a data URL
        const blob = new Blob([this.image], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    }
}
