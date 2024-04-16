export class Point {
    constructor(public x: number, public y: number) { }

    static distance(a: Point, b: Point): number {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
}