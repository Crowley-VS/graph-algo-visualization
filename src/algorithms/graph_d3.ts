import { Graph, Edge } from './graph'; // Import your Graph and Edge classes

export class D3Graph<T> {
    private graph: Graph<T>;

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