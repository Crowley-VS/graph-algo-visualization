import { Graph } from '../algorithms/graph';
import { dijkstra, reconstructPath } from '../algorithms/path_finding_algos';

describe('Dijkstra Algorithm', () => {
    test('should find the shortest path in a simple graph', () => {
        // Create a new graph instance
        const graph = new Graph();
        graph.addEdge(1, 2, 1);
        graph.addEdge(1, 3, 4);
        graph.addEdge(2, 3, 2);
        graph.addEdge(2, 4, 6);
        graph.addEdge(3, 4, 3);

        // Run dijkstra's algorithm
        const source = 1;
        const predecessors = dijkstra(graph, source);

        // Check if the shortest path to node 4 is correct
        const pathToNode4 = reconstructPath(predecessors, 4);
        expect(pathToNode4).toEqual([1, 2, 3, 4]);
    });

    test('should handle graphs with no paths', () => {
        const graph = new Graph();
        graph.addEdge(1, 2, 1);

        const source = 1;
        const predecessors = dijkstra(graph, source);

        // Trying to find a path to a node not connected
        const pathToNode3 = reconstructPath(predecessors, 3);
        expect(pathToNode3).toEqual([]);
    });
    test('should find the shortest path in a graph with a cycle', () => {
        const graph = new Graph();
        graph.addEdge(1, 2, 7);
        graph.addEdge(1, 3, 9);
        graph.addEdge(1, 6, 14);
        graph.addEdge(2, 3, 10);
        graph.addEdge(2, 4, 15);
        graph.addEdge(3, 4, 11);
        graph.addEdge(3, 6, 2);
        graph.addEdge(4, 5, 6);
        graph.addEdge(6, 5, 9);

        const source = 1;
        const predecessors = dijkstra(graph, source);

        const pathToNode5 = reconstructPath(predecessors, 5);
        expect(pathToNode5).toEqual([1, 3, 6, 5]);
    });

    test('should handle graph with single node', () => {
        const graph = new Graph();
        graph.addEdge(1, 1, 0); // Self-loop

        const source = 1;
        const predecessors = dijkstra(graph, source);

        const pathToNode1 = reconstructPath(predecessors, 1);
        expect(pathToNode1).toEqual([1]);
    });

    test('should handle graph where multiple paths have different weights', () => {
        const graph = new Graph();
        graph.addEdge(1, 2, 1);
        graph.addEdge(2, 3, 1);
        graph.addEdge(1, 3, 10);
        graph.addEdge(3, 4, 1);
        graph.addEdge(2, 4, 2);

        const source = 1;
        const predecessors = dijkstra(graph, source);

        const pathToNode4 = reconstructPath(predecessors, 4);
        expect(pathToNode4).toEqual([1, 2, 4]);
    });

    test('should find no path when no connection exists', () => {
        const graph = new Graph();
        graph.addEdge(1, 2, 1);
        graph.addEdge(2, 3, 1);
        // Node 4 is disconnected

        const source = 1;
        const predecessors = dijkstra(graph, source);

        const pathToNode4 = reconstructPath(predecessors, 4);
        expect(pathToNode4).toEqual([]);
    });

    test('should handle graphs with zero-weight edges', () => {
        const graph = new Graph();
        graph.addEdge(1, 2, 0);
        graph.addEdge(2, 3, 0);
        graph.addEdge(3, 4, 0);
        graph.addEdge(1, 4, 1); // Not the shortest path due to zero weights

        const source = 1;
        const predecessors = dijkstra(graph, source);

        const pathToNode4 = reconstructPath(predecessors, 4);
        expect(pathToNode4).toEqual([1, 2, 3, 4]);
    });
});
