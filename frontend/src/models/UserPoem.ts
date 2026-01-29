/**
 * UserPoem entity model (association)
 */
export interface UserPoemId {
    userId: number;
    poemId: number;
}

export class UserPoem {
    constructor(
        public id: UserPoemId
    ) {}

    static fromJson(json: any): UserPoem {
        return new UserPoem({
            userId: json.id.userId,
            poemId: json.id.poemId
        });
    }

    static fromJsonArray(jsonArray: any[]): UserPoem[] {
        return jsonArray.map(json => UserPoem.fromJson(json));
    }

    toJson() {
        return {
            id: this.id
        };
    }

    get userId(): number {
        return this.id.userId;
    }

    get poemId(): number {
        return this.id.poemId;
    }
}
