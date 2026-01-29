/**
 * Poem entity model
 */
export class Poem {
    constructor(
        public id: number,
        public title: string,
        public text: string
    ) {}

    static fromJson(json: any): Poem {
        return new Poem(json.id, json.title, json.text);
    }

    static fromJsonArray(jsonArray: any[]): Poem[] {
        return jsonArray.map(json => Poem.fromJson(json));
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            text: this.text
        };
    }
}
