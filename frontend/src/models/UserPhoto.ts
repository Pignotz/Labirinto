/**
 * UserPhoto entity model (association)
 */
export interface UserPhotoId {
    userId: number;
    photoId: number;
}

export class UserPhoto {
    constructor(
        public id: UserPhotoId
    ) {}

    static fromJson(json: any): UserPhoto {
        return new UserPhoto({
            userId: json.id.userId,
            photoId: json.id.photoId
        });
    }

    static fromJsonArray(jsonArray: any[]): UserPhoto[] {
        return jsonArray.map(json => UserPhoto.fromJson(json));
    }

    toJson() {
        return {
            id: this.id
        };
    }

    get userId(): number {
        return this.id.userId;
    }

    get photoId(): number {
        return this.id.photoId;
    }
}
