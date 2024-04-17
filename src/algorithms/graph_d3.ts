import { Graph, Edge } from './graph';
import { Point } from './point';

export class D3Graph<T> {
    protected graph: Graph<T>;

    constructor(graph: Graph<T>) {
        this.graph = graph;
    }

    getNodes(): { id: string, x: number, y: number }[] {
        return this.graph.getNodes().map((node, index) => {
            return {
                id: this.graph.getHashFunction()(node),
                x: 100 + index * 100, // Initial x position
                y: 100 + index * 100  // Initial y position
            };
        });
    }

    getLinks(): { source: string, target: string, weight: number }[] {
        return this.graph.getEdges().map(edge => {
            return {
                source: this.graph.getHashFunction()(edge.origin),
                target: this.graph.getHashFunction()(edge.destination),
                weight: edge.weight
            };
        });
    }
}

export class D3GraphPoint extends D3Graph<Point> {
    getNodes(): { id: string, x: number, y: number }[] {
        // Generate nodes data for D3, using the x, y directly from Point
        return this.graph.getNodes().map((point) => ({
            id: this.graph.getHashFunction()(point),
            x: point.x,
            y: point.y
        }));
    }
}
