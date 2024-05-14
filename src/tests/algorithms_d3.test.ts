import { D3Graph, D3GraphPoint } from '../algorithms/graph_d3'; // Adjust the import path as necessary
import { Graph } from '../algorithms/graph'; // Adjust import path as necessary
import { Point } from '../algorithms/point'; // Adjust import path as necessary

describe('D3Graph', () => {
    const simpleHasher = (node: any) => `id_${node.x}_${node.y}`;
    const nodes = [new Point(0, 0), new Point(100, 0), new Point(200, 0)];
    const edges = [{ origin: nodes[0], destination: nodes[1], weight: 1 }, { origin: nodes[1], destination: nodes[2], weight: 2 }];

    const mockGraph = {
        getNodes: () => nodes,
        getEdges: () => edges,
        getHashFunction: () => simpleHasher
    };

    it('getNodes should return correct formatted nodes', () => {
        const d3Graph = new D3Graph<Point>(mockGraph as Graph<Point>);
        expect(d3Graph.getNodes()).toEqual([
            { id: 'id_0_0', x: 100, y: 100 },
            { id: 'id_100_0', x: 200, y: 200 },
            { id: 'id_200_0', x: 300, y: 300 }
        ]);
    });

    it('getLinks should return correct formatted links', () => {
        const d3Graph = new D3Graph<Point>(mockGraph as Graph<Point>);
        expect(d3Graph.getLinks()).toEqual([
            { source: 'id_0_0', target: 'id_100_0', weight: 1 },
            { source: 'id_100_0', target: 'id_200_0', weight: 2 }
        ]);
    });
});

describe('D3GraphPoint', () => {
    const simpleHasher = (node: Point) => `id_${node.x}_${node.y}`;
    const points = [new Point(0, 0), new Point(100, 0), new Point(200, 0)];
    const edges = [{ origin: points[0], destination: points[1], weight: 1 }, { origin: points[1], destination: points[2], weight: 2 }];

    const mockGraphPoint = {
        getNodes: () => points,
        getEdges: () => edges,
        getHashFunction: () => simpleHasher
    };

    it('getNodes should directly use Point coordinates', () => {
        const d3GraphPoint = new D3GraphPoint(mockGraphPoint as Graph<Point>);
        expect(d3GraphPoint.getNodes()).toEqual([
            { id: 'id_0_0', x: 0, y: 0 },
            { id: 'id_100_0', x: 100, y: 0 },
            { id: 'id_200_0', x: 200, y: 0 }
        ]);
    });
});
