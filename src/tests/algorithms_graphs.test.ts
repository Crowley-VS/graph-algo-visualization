import { Graph, Edge } from '../algorithms/graph';

// Simple string hasher for demonstration.
const simpleHasher = (value: string): string => {
    return `hash_${value}`;
};

describe('Edge', () => {
    const origin = 'A';
    const destination = 'B';
    const weight = 10;
    let edge: Edge<string>;

    beforeEach(() => {
        edge = new Edge(origin, destination, weight);
    });

    test('should correctly assign origin, destination, and weight', () => {
        expect(edge.origin).toBe(origin);
        expect(edge.destination).toBe(destination);
        expect(edge.weight).toBe(weight);
    });

    test('opposite should return the correct node', () => {
        expect(edge.opposite(origin)).toBe(destination);
        expect(edge.opposite(destination)).toBe(origin);
    });

    test('opposite should throw error for invalid node', () => {
        expect(() => edge.opposite('C')).toThrow('Node C is not an endpoint of the edge.');
    });
});

describe('Graph', () => {
    let graph: Graph<string>;

    beforeEach(() => {
        graph = new Graph(simpleHasher);
    });

    test('new graph should have no edges or nodes', () => {
        expect(() => graph.getOutgoingEdges('A')).toThrow(`No outgoing edges found for node A`);
        expect(() => graph.getIncomingEdges('A')).toThrow('No incoming edges found for node A');
    });

    test('addEdge should correctly add new edges', () => {
        graph.addEdge('A', 'B', 5);
        expect(graph.getOutgoingEdges('A').length).toBe(1);
        expect(graph.getIncomingEdges('B').length).toBe(1);
        expect(graph.getOutgoingEdges('A')[0].weight).toBe(5);
    });

    test('addEdge should handle negative and default weights', () => {
        graph.addEdge('A', 'B');
        expect(graph.getOutgoingEdges('A')[0].weight).toBe(-1);
        graph.addEdge('B', 'C', 3);
        expect(graph.getOutgoingEdges('B')[0].weight).toBe(3);
    });

    test('fromData should create a graph from array of tuples', () => {
        const data: [string, string, number][] = [['A', 'B', 10], ['B', 'C', 20], ['C', 'A', 30]];
        const newGraph = Graph.fromData(data, simpleHasher);
        expect(newGraph.getOutgoingEdges('A')[0].weight).toBe(10);
        expect(newGraph.getIncomingEdges('C')[0].weight).toBe(20);
    });

    test('should handle multiple edges', () => {
        graph.addEdge('A', 'B', 5);
        expect(() => {
            graph.addEdge('A', 'B', 10); // Add a different edge with the same start and end
        }).toThrow(Error);
    });

    test('getOutgoingEdges should throw for non-existent node', () => {
        expect(() => graph.getOutgoingEdges('Z')).toThrow('No outgoing edges found for node Z');
    });

    test('getIncomingEdges should throw for non-existent node', () => {
        expect(() => graph.getIncomingEdges('Z')).toThrow('No incoming edges found for node Z');
    });

    test('should add a single edge and verify', () => {
        graph.addEdge('A', 'B', 10);
        const edgesFromA = graph.getOutgoingEdges('A');
        expect(edgesFromA.length).toBe(1);
        expect(edgesFromA[0].destination).toBe('B');
        expect(edgesFromA[0].weight).toBe(10);
    });

    test('should handle multiple edges between different nodes', () => {
        graph.addEdge('A', 'B', 10);
        graph.addEdge('A', 'C', 20);
        graph.addEdge('B', 'C', 30);
        expect(graph.getOutgoingEdges('A').length).toBe(2);
        expect(graph.getOutgoingEdges('B').length).toBe(1);
        expect(graph.getOutgoingEdges('C').length).toBe(0); // No outgoing from C
        expect(graph.getIncomingEdges('C').length).toBe(2); // Incoming to C from A and B
    });

    test('should handle edges to and from the same node', () => {
        graph.addEdge('A', 'A', 50); // Self-loop
        expect(graph.getOutgoingEdges('A').length).toBe(1);
        expect(graph.getIncomingEdges('A').length).toBe(1);
        expect(graph.getOutgoingEdges('A')[0].weight).toBe(50);
    });

    test('should throw when accessing edges from a non-existent node', () => {
        expect(() => graph.getOutgoingEdges('Z')).toThrow('No outgoing edges found for node Z');
        expect(() => graph.getIncomingEdges('Z')).toThrow('No incoming edges found for node Z');
    });

});

// Define a simple Point class
class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString(): string {
        return `Point(x=${this.x}, y=${this.y})`;
    }
}

// A hashing function for Point objects
const pointHasher = (point: Point): string => {
    return `${point.x}_${point.y}`;
};

describe('Graph with Point objects', () => {
    let graph: Graph<Point>;

    beforeEach(() => {
        graph = new Graph(pointHasher);
    });

    test('addEdge should correctly add new edges between points', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        graph.addEdge(pointA, pointB, 10);

        const outgoingEdges = graph.getOutgoingEdges(pointA);
        expect(outgoingEdges.length).toBe(1);
        expect(outgoingEdges[0].weight).toBe(10);
        expect(outgoingEdges[0].destination).toEqual(pointB);
    });

    test('fromData should create a graph from array of tuples with points', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        const pointC = new Point(2, 2);

        const data: [Point, Point, number][] = [
            [pointA, pointB, 10],
            [pointB, pointC, 20],
            [pointC, pointA, 30]
        ];

        const newGraph = Graph.fromData(data, pointHasher);
        expect(newGraph.getOutgoingEdges(pointA)[0].weight).toBe(10);
        expect(newGraph.getIncomingEdges(pointC)[0].weight).toBe(20);
    });

    test('hashing ensures identical points are treated as the same node', () => {
        const pointA = new Point(1, 1);
        const pointB = new Point(1, 1); // Identical to pointA

        graph.addEdge(pointA, new Point(2, 2), 15);
        expect(() => graph.addEdge(pointB, new Point(3, 3), 25)).not.toThrow();

        // Ensure pointA and pointB are treated as the same node due to identical hashing
        expect(graph.getOutgoingEdges(pointA).length).toBe(2); // Should reflect edges added using both pointA and pointB
    });

    test('should throw when accessing edges from a non-existent point', () => {
        const pointZ = new Point(99, 99);
        expect(() => graph.getOutgoingEdges(pointZ)).toThrow('No outgoing edges found for node Point(x=99, y=99)');
        expect(() => graph.getIncomingEdges(pointZ)).toThrow('No incoming edges found for node Point(x=99, y=99)');
    });

    test('getNodes should return all unique points in the graph', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        const pointC = new Point(2, 2);

        graph.addEdge(pointA, pointB, 10);
        graph.addEdge(pointB, pointC, 20);
        graph.addEdge(pointC, pointA, 30);

        // The output of getNodes will be hashed values; to compare them properly, we use the hasher on expected points
        const expectedNodes = [pointA, pointB, pointC].map(point => pointHasher(point));
        const actualNodes = graph.getNodes().map(point => pointHasher(point));
        expect(actualNodes).toEqual(expect.arrayContaining(expectedNodes));
    });

    test('should verify removal of an edge', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        graph.addEdge(pointA, pointB, 10);
        graph.removeEdge(pointA, pointB); // Assume implementation of removeEdge
        expect(graph.getOutgoingEdges(pointA)).toEqual([]);
        expect(graph.getIncomingEdges(pointB)).toEqual([]);
    });

    test('should handle cycles correctly', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        const pointC = new Point(0, 0); // Same as pointA to form a cycle

        graph.addEdge(pointA, pointB, 10);
        graph.addEdge(pointB, pointC, 20); // Forms a cycle back to pointA

        expect(graph.getOutgoingEdges(pointB)[0].destination).toEqual(pointC);
        expect(graph.getIncomingEdges(pointA)[0].origin).toEqual(pointB);
    });

    test('should maintain correct number of unique points', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        const pointC = new Point(1, 1); // Identical to pointB

        graph.addEdge(pointA, pointB, 10);

        expect(() => {
            graph.addEdge(pointA, pointC, 20); // Should not increase unique nodes
        }).toThrow(Error);


        const uniqueNodes = graph.getNodes().length;
        expect(uniqueNodes).toBe(2); // Only pointA and pointB should be recognized as unique
    });

    test('should verify multiple outgoing edges from a single node', () => {
        const pointA = new Point(0, 0);
        const pointB = new Point(1, 1);
        const pointC = new Point(2, 2);

        graph.addEdge(pointA, pointB, 10);
        graph.addEdge(pointA, pointC, 20);

        const outgoingEdges = graph.getOutgoingEdges(pointA);
        expect(outgoingEdges.length).toBe(2);
        expect(outgoingEdges).toEqual(expect.arrayContaining([
            expect.objectContaining({ destination: pointB }),
            expect.objectContaining({ destination: pointC })
        ]));
    });
});
