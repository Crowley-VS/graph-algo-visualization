import { Graph } from './graph';
import { GraphNode } from './point';

export class D3Graph {
    protected graph: Graph<GraphNode>;

    constructor(graph: Graph<GraphNode>) {
        this.graph = graph;
    }

    getNodes(): { id: string, x: number, y: number }[] {
        // Generate nodes data for D3, using the x, y directly from Point
        return this.graph.getNodes().map((point) => ({
            id: this.graph.getHashFunction()(point),
            x: point.x / 10,
            y: point.y / 10
        }));
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
    getNodeFromHash(hash: string): GraphNode | undefined {
        return this.graph.getNodeFromHash(hash);
    }

    getGraph(): Graph<GraphNode> {
        return this.graph;
    }
}