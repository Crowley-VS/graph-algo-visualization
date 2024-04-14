export class Graph<T> {
    private incoming: Map<T, Map<T, Edge<T>>>;
    private outgoing: Map<T, Map<T, Edge<T>>>;

    constructor() {
        this.incoming = new Map();
        this.outgoing = new Map();
    }

    private ensureNode(value: T): void {
        if (!this.incoming.has(value)) {
            this.incoming.set(value, new Map());
            this.outgoing.set(value, new Map());
        }
    }

    addEdge(originValue: T, destinationValue: T, weight: number = -1): void {
        this.ensureNode(originValue);
        this.ensureNode(destinationValue);

        // Retrieve the map of outgoing edges for the origin node.
        const originEdges = this.outgoing.get(originValue)!;

        if (originEdges.has(destinationValue)) {
            // If an edge already exists, throw an error.
            throw new Error(`Edge already exists from ${originValue} to ${destinationValue}`);
        } else {
            // Create a new edge if one does not exist.
            const edge = new Edge(originValue, destinationValue, weight);
            originEdges.set(destinationValue, edge);
            this.incoming.get(destinationValue)!.set(originValue, edge);
        }
    }

    getOutgoingEdges(value: T): Edge<T>[] {
        if (!this.outgoing.has(value)) {
            throw new Error(`No outgoing edges found for node ${value}`);
        }
        return Array.from(this.outgoing.get(value)!.values());
    }

    getIncomingEdges(value: T): Edge<T>[] {
        if (!this.incoming.has(value)) {
            throw new Error(`No incoming edges found for node ${value}`);
        }
        return Array.from(this.incoming.get(value)!.values());
    }


    static fromData<T>(data: Array<[T, T, number]>): Graph<T> {
        const graph = new Graph<T>();
        data.forEach(([originValue, destinationValue, weight]) => {
            graph.addEdge(originValue, destinationValue, weight);
        });
        return graph;
    }

    getNodes(): T[] {
        return Array.from(this.outgoing.keys());
    }
}

export class Edge<T> {
    origin: T;
    destination: T;
    weight: number;

    constructor(origin: T, destination: T, weight: number) {
        this.origin = origin;
        this.destination = destination;
        this.weight = weight;
    }

    // Method to get the opposite node of the given node
    opposite(node: T): T {
        if (node === this.origin) {
            return this.destination;
        } else if (node === this.destination) {
            return this.origin;
        } else {
            throw new Error(`Node ${node} is not an endpoint of the edge.`);
        }
    }
}

