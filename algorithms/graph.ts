export class Graph<T> {
    private incoming: Map<string, Map<string, Edge<T>>>;
    private outgoing: Map<string, Map<string, Edge<T>>>;
    private hasher: (value: T) => string; // Function to hash nodes
    private hashToNodeMap: Map<string, T>;

    constructor(hasher: (value: T) => string) {
        this.incoming = new Map();
        this.outgoing = new Map();
        this.hasher = hasher;
        this.hashToNodeMap = new Map();
    }

    private ensureNode(value: T): void {
        let hash = this.hasher(value);
        if (!this.incoming.has(hash)) {
            this.incoming.set(hash, new Map());
            this.outgoing.set(hash, new Map());
            this.hashToNodeMap.set(hash, value);
        }
    }

    addEdge(originValue: T, destinationValue: T, weight: number = -1): void {
        this.ensureNode(originValue);
        this.ensureNode(destinationValue);

        const originHash = this.hasher(originValue);
        const destinationHash = this.hasher(destinationValue);

        const originEdges = this.outgoing.get(originHash)!;

        if (originEdges.has(destinationHash)) {
            throw new Error(`Edge already exists from ${originValue} to ${destinationValue}`);
        } else {
            const edge = new Edge(originValue, destinationValue, weight);
            originEdges.set(destinationHash, edge);
            this.incoming.get(destinationHash)!.set(originHash, edge);
        }
    }

    removeEdge(originValue: T, destinationValue: T): void {
        const originHash = this.hasher(originValue);
        const destinationHash = this.hasher(destinationValue);

        const originEdges = this.outgoing.get(originHash);
        const destinationEdges = this.incoming.get(destinationHash);

        // Check if both nodes exist in the graph
        if (!originEdges || !destinationEdges) {
            throw new Error(`One or both nodes not found: ${originValue}, ${destinationValue}`);
        }

        // Attempt to delete the edge from both directions
        const originEdgeRemoved = originEdges.delete(destinationHash);
        const destinationEdgeRemoved = destinationEdges.delete(originHash);

        if (!originEdgeRemoved || !destinationEdgeRemoved) {
            throw new Error(`Edge not found from ${originValue} to ${destinationValue}`);
        }
    }

    getOutgoingEdges(value: T): Edge<T>[] {
        let hash = this.hasher(value);
        if (!this.outgoing.has(hash)) {
            throw new Error(`No outgoing edges found for node ${value}`);
        }
        return Array.from(this.outgoing.get(hash)!.values());
    }

    getIncomingEdges(value: T): Edge<T>[] {
        let hash = this.hasher(value);
        if (!this.incoming.has(hash)) {
            throw new Error(`No incoming edges found for node ${value}`);
        }
        return Array.from(this.incoming.get(hash)!.values());
    }

    static fromData<T>(data: Array<[T, T, number]>, hasher: (value: T) => string): Graph<T> {
        const graph = new Graph<T>(hasher);
        data.forEach(([originValue, destinationValue, weight]) => {
            graph.addEdge(originValue, destinationValue, weight);
        });
        return graph;
    }

    getNodes(): T[] {
        return Array.from(this.hashToNodeMap.values());  // Return actual nodes
    }

    // Method to expose the hasher
    public getHashFunction(): (value: T) => string {
        return this.hasher;
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
