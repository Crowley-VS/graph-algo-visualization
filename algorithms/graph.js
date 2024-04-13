class Node {
    constructor(value) {
        this.value = value;
    }

}
class Edge {
    constructor(origin, destination, weight) {
        this.origin = origin;;
        this.destination = destination;
        this.weight = weight;
    }
    get_oppisite(node) {
        if (this.origin == node) {
            return this.destination;
        } else {
            return this.origin;
        }
    }
}

class Graph {
    constructor() {
        this.incoming = new Map();
        this.outgoing = new Map();
    }

    addNode(node) {
        this.incoming.set(node, new Map());
        this.outgoing.set(node, new Map());
    }

    addEdge(origin, destination, weight) {
        const edge = new Edge(origin, destination, weight);
        this.outgoing.get(origin).set(destination, edge);
        this.incoming.get(destination).set(origin, edge);
    }

    getOutgoingEdges(node) {
        return this.outgoing.get(node);
    }

    getIncomingEdges(node) {
        return this.incoming.get(node);
    }
}

