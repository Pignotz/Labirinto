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
    
    // Converti ArrayBuffer in Base64
    const bytes = new Uint8Array(this.image);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:image/jpeg;base64,${base64}`;
}
}
