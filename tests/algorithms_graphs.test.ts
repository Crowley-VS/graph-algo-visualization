import { Graph, Edge } from '../algorithms/graph';

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
        graph = new Graph();
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
        const newGraph = Graph.fromData(data);
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

    test('fromData should build a complex graph with various edges', () => {
        const data: [string, string, number][] = [['X', 'Y', 100], ['Y', 'Z', 200], ['Z', 'X', 300], ['X', 'Z', 150]];
        const complexGraph = Graph.fromData(data);
        expect(complexGraph.getOutgoingEdges('X').length).toBe(2);
        expect(complexGraph.getOutgoingEdges('Y').length).toBe(1);
        expect(complexGraph.getIncomingEdges('Z').length).toBe(2);
    });
});