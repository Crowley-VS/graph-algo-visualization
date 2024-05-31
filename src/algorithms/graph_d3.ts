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
            x: point.x,
            y: point.y
        }));
    }

    getLinks(): { source: GraphNode, target: GraphNode, weight: number }[] {
        return this.graph.getEdges().map(edge => {
            return {
                source: edge.origin,
                target: edge.destination,
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