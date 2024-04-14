import { Graph } from "./graph";
import { PriorityQueue } from "./priority_queue";

export function dijkstra<T>(graph: Graph<T>, source: T): Map<T, T | null> {
    const distances = new Map<T, number>();
    const predecessors = new Map<T, T | null>();
    const priorityQueue = new PriorityQueue<T>();

    // Initialize all distances to infinity, except the source which is 0
    graph.getNodes().forEach(node => {
        distances.set(node, Infinity);
        predecessors.set(node, null);
        priorityQueue.insert({ value: node, priority: Infinity });
    });
    distances.set(source, 0);
    priorityQueue.update(source, 0);

    while (priorityQueue.length > 0) {
        const origin = priorityQueue.extractMin();
        if (!origin) break; // If the queue is empty or all remaining nodes are unreachable

        const originDist = distances.get(origin.value) ?? Infinity;

        // Process each adjacent vertex
        graph.getOutgoingEdges(origin.value).forEach(edge => {
            const neighbor = edge.destination;
            const weight = edge.weight;
            const distThroughOrigin = originDist + weight;

            if (distThroughOrigin < (distances.get(neighbor) ?? Infinity)) {
                distances.set(neighbor, distThroughOrigin);
                predecessors.set(neighbor, origin.value);
                priorityQueue.update(neighbor, distThroughOrigin);
            }
        });
    }

    return predecessors;
}

export function reconstructPath<T>(predecessors: Map<T, T | null>, target: T): T[] {
    const path: T[] = [];  // Explicitly typed as an array of T
    let step: T | null = target;

    if (!predecessors.has(step)) return path; // No path to target or target does not exist in the map

    while (step !== null) {
        path.push(step);
        step = predecessors.get(step) || null;
    }

    return path.reverse();
}

