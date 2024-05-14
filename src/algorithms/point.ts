export class Point {
    constructor(public x: number, public y: number) { }

    static distance(a: Point, b: Point): number {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
}


export class GraphNode {
    id: string;
    x: number;
    y: number;

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    // Hash function based on the node's ID
    getHash(): string {
        return this.id;
    }
}