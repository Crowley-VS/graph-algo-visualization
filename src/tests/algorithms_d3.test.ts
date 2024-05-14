import { D3Graph } from '../algorithms/graph_d3'; // Adjust the import path as necessary
import { Graph } from '../algorithms/graph'; // Adjust import path as necessary
import { GraphNode } from '../algorithms/point'; // Adjust import path as necessary

describe('D3Graph', () => {
    let mockGraph: Graph<GraphNode>;
    let d3Graph: D3Graph;
    const mockHashFunction = (node: GraphNode) => `hash_${node.x}_${node.y}`;

    beforeEach(() => {
        mockGraph = new Graph(mockHashFunction);
        mockGraph.getNodes = jest.fn().mockReturnValue([
            { x: 100, y: 200 },
            { x: 300, y: 600 }
        ]);
        mockGraph.getEdges = jest.fn().mockReturnValue([
            { origin: { x: 100, y: 200 }, destination: { x: 300, y: 600 }, weight: 5 }
        ]);
        mockGraph.getHashFunction = jest.fn().mockReturnValue(mockHashFunction);
        d3Graph = new D3Graph(mockGraph);
    });

    test('getNodes should transform nodes for D3', () => {
        const nodes = d3Graph.getNodes();
        expect(nodes).toEqual([
            { id: 'hash_100_200', x: 10, y: 20 },
            { id: 'hash_300_600', x: 30, y: 60 }
        ]);
        expect(mockGraph.getNodes).toHaveBeenCalled();
    });

    test('getLinks should transform links for D3', () => {
        const links = d3Graph.getLinks();
        expect(links).toEqual([
            { source: 'hash_100_200', target: 'hash_300_600', weight: 5 }
        ]);
        expect(mockGraph.getEdges).toHaveBeenCalled();
    });
});
