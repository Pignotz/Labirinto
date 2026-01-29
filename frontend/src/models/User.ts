/**
 * User entity model
 */
export class User {
    constructor(
        public id: number,
        public username: string
    ) {}

    static fromJson(json: any): User {
        return new User(json.id, json.username);
    }

    static fromJsonArray(jsonArray: any[]): User[] {
        return jsonArray.map(json => User.fromJson(json));
    }

    toJson() {
        return {
            id: this.id,
            username: this.username
        };
    }
}
