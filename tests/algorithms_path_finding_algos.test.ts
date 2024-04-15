import { Graph } from '../algorithms/graph';
import { dijkstra, reconstructPath, aStarSearch } from '../algorithms/path_finding_algos';

describe('Graph Algorithms', () => {
    let graph: Graph<string>;
    const hasher = (s: string) => s; // Simple hasher function for strings

    beforeEach(() => {
        graph = new Graph<string>(hasher);
        // Create a simple graph: A -> B -> C, A -> C
        graph.addEdge('A', 'B', 1);
        graph.addEdge('B', 'C', 2);
        graph.addEdge('A', 'C', 4);
    });

    describe('Dijkstra\'s Algorithm', () => {
        test('should find the shortest path from A to C', () => {
            const predecessors = dijkstra(graph, 'A');
            expect(predecessors.get('B')).toBe('A');
            expect(predecessors.get('C')).toBe('B');
        });
    });

    describe('A* Search', () => {
        const heuristic = (a: string, b: string) => {
            // Simple heuristic: direct distance (made up for this example)
            const heuristics = new Map([
                ['A', 2],
                ['B', 1],
                ['C', 0]
            ]);
            return heuristics.get(a)! - heuristics.get(b)!;
        };

        test('should find the optimal path from A to C using A*', () => {
            const path = aStarSearch(graph, 'A', 'C', heuristic);
            expect(path).toEqual(['A', 'B', 'C']);
        });
    });
});
