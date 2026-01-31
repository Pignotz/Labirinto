/**
 * Photo entity model
 */
export class Photo {
    constructor(
        public id: number,
        public image: ArrayBuffer,
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
}
