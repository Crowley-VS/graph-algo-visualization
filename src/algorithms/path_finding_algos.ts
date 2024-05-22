import { Graph } from "./graph";
import { PriorityQueue } from "./priority_queue";
import { StateReporter } from "./state_reporter";

// Function to execute Dijkstra's algorithm
export function dijkstra<T>(graph: Graph<T>, source: T, target: T, reporter: StateReporter | null = null): T[] {
    const hasher = graph.getHashFunction();
    const distances = new Map<string, number>();
    const predecessors = new Map<string, T | null>();
    const priorityQueue = new PriorityQueue<T>(hasher);

    // Initialize all distances to infinity, except the source which is 0
    graph.getNodes().forEach(node => {
        const hash = hasher(node);
        distances.set(hash, Infinity);
        predecessors.set(hash, null);
        priorityQueue.insert({ value: node, priority: Infinity });
    });
    distances.set(hasher(source), 0);
    priorityQueue.update(source, 0);

    while (priorityQueue.length > 0) {
        const origin = priorityQueue.extractMin();
        if (reporter) {
            reporter.report({ type: 'visit', details: origin });
        }
        if (!origin) break;

        const originHash = hasher(origin.value);
        const originDist = distances.get(originHash) ?? Infinity;

        // Process each adjacent vertex
        graph.getOutgoingEdges(origin.value).forEach(edge => {
            const neighborHash = hasher(edge.destination);
            const weight = edge.weight;
            const distThroughOrigin = originDist + weight;
            if (distThroughOrigin < (distances.get(neighborHash) ?? Infinity)) {
                distances.set(neighborHash, distThroughOrigin);
                predecessors.set(neighborHash, origin.value);
                priorityQueue.update(edge.destination, distThroughOrigin);
            }
        });
    }

    return reconstructPath(predecessors, target, hasher);
}

// Function for A* Search
export function aStarSearch<T>(graph: Graph<T>, start: T, goal: T, heuristic: (a: T, b: T) => number, reporter: StateReporter | null = null): T[] | null {
    const hasher = graph.getHashFunction();
    const openSet = new PriorityQueue<T>(hasher);
    const cameFrom = new Map<string, T>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    // Initialize scores for all nodes to Infinity, except the start node
    graph.getNodes().forEach(node => {
        const hash = hasher(node);
        gScore.set(hash, Infinity);
        fScore.set(hash, Infinity);
    });

    const startHash = hasher(start);
    const goalHash = hasher(goal);
    gScore.set(startHash, 0);
    fScore.set(startHash, heuristic(start, goal));

    openSet.insert({ value: start, priority: fScore.get(startHash)! });

    while (openSet.length > 0) {
        const current_node = openSet.extractMin();
        const current = current_node!.value;
        if (reporter) {
            reporter.report({ type: 'visit', details: current_node });
        }
        const currentHash = hasher(current);

        if (currentHash === goalHash) {
            return reconstructPath(cameFrom, current, hasher);
        }

        graph.getOutgoingEdges(current).forEach(edge => {
            const neighborHash = hasher(edge.destination);
            const tentative_gScore = gScore.get(currentHash)! + edge.weight;
            if (tentative_gScore < (gScore.get(neighborHash) ?? Infinity)) {
                cameFrom.set(neighborHash, current);
                gScore.set(neighborHash, tentative_gScore);
                fScore.set(neighborHash, tentative_gScore + heuristic(edge.destination, goal));
                if (!openSet.contains(edge.destination)) {
                    openSet.insert({ value: edge.destination, priority: fScore.get(neighborHash)! });
                }
            }
        });
    }

    return null;
}

export function reconstructPath<T>(predecessors: Map<string, T | null>, target: T, hasher: (value: T) => string): T[] {
    const path: T[] = [];
    let current: T | null = target;
    let currentHash = hasher(current);

    // Check if the target was ever reached; if not, return an empty array
    if (!predecessors.has(currentHash)) {
        return path;
    }

    // Build the path by traversing the predecessors map
    while (current !== null) {
        path.push(current);
        current = predecessors.get(currentHash) || null;
        currentHash = current ? hasher(current) : '';
    }

    return path.reverse();
}

