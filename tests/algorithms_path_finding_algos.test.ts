import { Graph } from '../algorithms/graph';
import { dijkstra, reconstructPath, aStarSearch } from '../algorithms/path_finding_algos';

describe('Graph Algorithms', () => {
    let graph: Graph<string>;

    beforeEach(() => {
        // A simple graph: A -> B -> C
        graph = new Graph<string>((node) => node);
        graph.addEdge('A', 'B', 1);
        graph.addEdge('B', 'C', 2);
    });

    describe('dijkstra', () => {
        it('should find the shortest path from A to C', () => {
            const path = dijkstra(graph, 'A', 'C');
            expect(path).toEqual(['A', 'B', 'C']);
        });

        it('should return an empty array if no path exists', () => {
            const path = dijkstra(graph, 'A', 'D'); // Assuming D does not exist
            expect(path).toEqual([]);
        });
    });

    describe('A* Search', () => {
        it('should find the shortest path from A to C', () => {
            const heuristic = (a: string, b: string) => Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
            const path = aStarSearch(graph, 'A', 'C', heuristic);
            expect(path).toEqual(['A', 'B', 'C']);
        });

        it('should return null if no path exists', () => {
            const heuristic = (a: string, b: string) => Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
            const path = aStarSearch(graph, 'A', 'D', heuristic); // Assuming D does not exist
            expect(path).toBeNull();
        });
    });
});

describe('Graph Algorithms Basic', () => {
    let graph: Graph<string>;

    beforeEach(() => {
        // A simple graph: A -> B -> C
        graph = new Graph<string>((node) => node);
        graph.addEdge('A', 'B', 1);
        graph.addEdge('B', 'A', 1);
        graph.addEdge('B', 'C', 2);
        graph.addEdge('C', 'B', 2);
        graph.addEdge('B', 'D', 3);
        graph.addEdge('D', 'B', 3);
        graph.addEdge('B', 'F', 1);
        graph.addEdge('F', 'B', 1);
        graph.addEdge('F', 'D', 4);
        graph.addEdge('D', 'F', 4);
        graph.addEdge('D', 'H', 2);
        graph.addEdge('H', 'D', 2);
        graph.addEdge('F', 'G', 4);
        graph.addEdge('G', 'F', 4);
    });

    describe('dijkstra', () => {
        it('should find the shortest path from A to H', () => {
            const path = dijkstra(graph, 'A', 'H');
            expect(path).toEqual(['A', 'B', 'D', 'H']);
        });
    });

    describe('A* Search', () => {
        it('should find the shortest path from A to C', () => {
            const heuristic = (a: string, b: string) => Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
            const path = aStarSearch(graph, 'A', 'H', heuristic);
            expect(path).toEqual(['A', 'B', 'D', 'H']);
        });

    });
});


describe('Graph Algorithms with Numeric Nodes', () => {
    let graph: Graph<number>;

    beforeEach(() => {
        // A simple numeric graph: 1 -> 2 -> 3 -> 4
        graph = new Graph<number>((node) => node.toString());
        graph.addEdge(1, 2, 1);
        graph.addEdge(2, 3, 2);
        graph.addEdge(3, 4, 3);
    });

    describe('dijkstra', () => {
        it('should find the shortest path from 1 to 4', () => {
            const path = dijkstra(graph, 1, 4);
            expect(path).toEqual([1, 2, 3, 4]);
        });

        it('should handle graphs with cycles', () => {
            // Creating a cycle: 3 -> 2
            graph.addEdge(3, 2, 1);
            const path = dijkstra(graph, 1, 3);
            expect(path).toEqual([1, 2, 3]);
        });
    });

    describe('A* Search', () => {
        const heuristic = (a: number, b: number) => Math.abs(a - b);

        it('should find the shortest path from 1 to 4 using A*', () => {
            const path = aStarSearch(graph, 1, 4, heuristic);
            expect(path).toEqual([1, 2, 3, 4]);
        });

        it('should return null if no path exists using A* (isolated node)', () => {
            const path = aStarSearch(graph, 1, 5, heuristic); // Node 5 is isolated
            expect(path).toBeNull();
        });

        it('should correctly choose paths in a graph with multiple valid routes', () => {
            // Adding an alternative shorter route from 2 to 4
            graph.addEdge(2, 4, 1);
            const path = aStarSearch(graph, 1, 4, heuristic);
            expect(path).toEqual([1, 2, 4]);
        });
    });
});


class Point {
    constructor(public x: number, public y: number) { }

    static distance(a: Point, b: Point): number {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
}

describe('Graph Algorithms with Points', () => {
    let graph: Graph<Point>;

    beforeEach(() => {
        // Creating a simple square graph with diagonal
        graph = new Graph<Point>((point) => `${point.x},${point.y}`);
        const p1 = new Point(0, 0);
        const p2 = new Point(1, 0);
        const p3 = new Point(1, 1);
        const p4 = new Point(0, 1);

        graph.addEdge(p1, p2, Point.distance(p1, p2));
        graph.addEdge(p2, p1, Point.distance(p1, p2));
        graph.addEdge(p2, p3, Point.distance(p2, p3));
        graph.addEdge(p3, p2, Point.distance(p2, p3));
        graph.addEdge(p3, p4, Point.distance(p3, p4));
        graph.addEdge(p4, p3, Point.distance(p3, p4));
        graph.addEdge(p4, p1, Point.distance(p4, p1));
        graph.addEdge(p1, p4, Point.distance(p4, p1));
        graph.addEdge(p1, p3, Point.distance(p1, p3)); // Diagonal\
        graph.addEdge(p3, p3, Point.distance(p1, p3));
    });

    describe('dijkstra', () => {
        it('should find the shortest path from top-left to bottom-right', () => {
            const p1 = new Point(0, 0);
            const p3 = new Point(1, 1);
            const path = dijkstra(graph, p1, p3);
            expect(path).toEqual([p1, p3]); // Direct via diagonal
        });
    });

    describe('A* Search', () => {
        it('should find the shortest path from top-left to bottom-right using A*', () => {
            const p1 = new Point(0, 0);
            const p3 = new Point(1, 1);
            const heuristic = (a: Point, b: Point) => Point.distance(a, b);
            const path = aStarSearch(graph, p1, p3, heuristic);
            expect(path).toEqual([p1, p3]); // Direct via diagonal
        });

        it('should find the shortest path around the square', () => {
            const p1 = new Point(0, 0);
            const p4 = new Point(0, 1);
            const p3 = new Point(1, 1);
            const heuristic = (a: Point, b: Point) => Point.distance(a, b);
            const path = aStarSearch(graph, p1, p4, heuristic);
            expect(path).toEqual([p1, p4]); // Should prefer the direct path even though there's an alternative via p3
        });
    });
});

describe('Graph Algorithms with Points - Additional Tests 1', () => {
    let graph: Graph<Point>;


    beforeEach(() => {
        // Creating a graph with more complexity
        graph = new Graph<Point>((point) => `${point.x},${point.y}`);
        const p0 = new Point(0, 0);
        const p1 = new Point(1, 0);
        const p2 = new Point(2, 0);
        const p3 = new Point(2, 1);
        const p4 = new Point(1, 2);
        const p5 = new Point(0, 2);

        graph.addEdge(p0, p1, Point.distance(p0, p1));
        graph.addEdge(p1, p2, Point.distance(p1, p2));
        graph.addEdge(p2, p3, Point.distance(p2, p3));
        graph.addEdge(p3, p4, Point.distance(p3, p4));
        graph.addEdge(p4, p5, Point.distance(p4, p5));
        graph.addEdge(p5, p0, Point.distance(p5, p0)); // Completing a loop
    });

    describe('A* Search - Complex Path', () => {
        it('should find a complex path avoiding direct routes', () => {
            const p0 = new Point(0, 0);
            const p1 = new Point(1, 0);
            const p2 = new Point(2, 0);
            const p3 = new Point(2, 1);
            const heuristic = (a: Point, b: Point) => Point.distance(a, b);
            const path = aStarSearch(graph, p0, p3, heuristic);
            expect(path).toEqual([p0, p1, p2, p3]); // Should traverse through p1, p2 to p3
        });
    });

    describe('Dijkstra - Complex Path', () => {
        it('should find a complex path avoiding direct routes', () => {
            const p0 = new Point(0, 0);
            const p1 = new Point(1, 0);
            const p2 = new Point(2, 0);
            const p3 = new Point(2, 1);
            const path = dijkstra(graph, p0, p3);
            expect(path).toEqual([p0, p1, p2, p3]); // Should traverse through p1, p2 to p3
        });
    });
});

describe('Graph Algorithms with Points - Additional Tests 2', () => {
    let graph: Graph<Point>;

    beforeEach(() => {
        // Creating a graph with more complexity
        graph = new Graph<Point>((point) => `${point.x},${point.y}`);
        const p0 = new Point(0, 0);
        const p1 = new Point(0, 1);
        const p2 = new Point(1, 0);
        const p3 = new Point(1, 1);
        const p4 = new Point(2, 0);
        const p5 = new Point(5, 5);
        const p6 = new Point(9, 9);

        graph.addEdge(p0, p1, Point.distance(p0, p1));
        graph.addEdge(p1, p3, Point.distance(p1, p3));
        graph.addEdge(p2, p3, Point.distance(p2, p3));
        graph.addEdge(p1, p2, Point.distance(p1, p2));
        graph.addEdge(p3, p4, Point.distance(p3, p4));
        graph.addEdge(p4, p6, Point.distance(p4, p6));
        graph.addEdge(p6, p5, Point.distance(p6, p5));
        graph.addEdge(p4, p5, Point.distance(p4, p5));
    });

    describe('A* Search - Complex Path', () => {
        it('should find a complex path avoiding direct routes', () => {
            const p0 = new Point(0, 0);
            const p1 = new Point(0, 1);
            const p2 = new Point(1, 1);
            const p3 = new Point(2, 0);
            const p4 = new Point(5, 5);
            const heuristic = (a: Point, b: Point) => Point.distance(a, b);
            const path = aStarSearch(graph, p0, p4, heuristic);
            expect(path).toEqual([p0, p1, p2, p3, p4]); // Should traverse through p1, p2 to p3
        });
    });

    describe('Dijkstra - Complex Path', () => {
        it('should find a complex path avoiding direct routes', () => {
            const p0 = new Point(0, 0);
            const p1 = new Point(0, 1);
            const p2 = new Point(1, 1);
            const p3 = new Point(2, 0);
            const p4 = new Point(5, 5);
            const path = dijkstra(graph, p0, p4);
            expect(path).toEqual([p0, p1, p2, p3, p4]); // Should traverse through p1, p2 to p3
        });
    });
});
