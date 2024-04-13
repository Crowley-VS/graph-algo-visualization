class GraphNode {
    value: any;  // Consider replacing 'any' with a more specific type if possible

    constructor(value: any) {
        this.value = value;
    }
}

class Edge {
    origin: GraphNode;
    destination: GraphNode;
    weight: number;

    constructor(origin: GraphNode, destination: GraphNode, weight: number) {
        this.origin = origin;
        this.destination = destination;
        this.weight = weight;
    }

    getOpposite(node: GraphNode): GraphNode {
        if (this.origin === node) {
            return this.destination;
        } else {
            return this.origin;
        }
    }
}

class Graph {
    incoming: Map<GraphNode, Map<GraphNode, Edge>>;
    outgoing: Map<GraphNode, Map<GraphNode, Edge>>;

    constructor() {
        this.incoming = new Map();
        this.outgoing = new Map();
    }

    addGraphNode(node: GraphNode): void {
        this.incoming.set(node, new Map());
        this.outgoing.set(node, new Map());
    }

    addEdge(origin: GraphNode, destination: GraphNode, weight: number): void {
        const edge = new Edge(origin, destination, weight);
        this.outgoing.get(origin)!.set(destination, edge);
        this.incoming.get(destination)!.set(origin, edge);
    }

    getOutgoingEdges(node: GraphNode): Map<GraphNode, Edge> | undefined {
        return this.outgoing.get(node);
    }

    getIncomingEdges(node: GraphNode): Map<GraphNode, Edge> | undefined {
        return this.incoming.get(node);
    }
}
