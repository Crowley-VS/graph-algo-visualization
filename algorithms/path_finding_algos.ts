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

export function aStarSearch<T>(graph: Graph<T>, start: T, goal: T, heuristic: (a: T, b: T) => number): T[] | null {
    const openSet = new PriorityQueue<T>();
    const cameFrom: Map<T, T> = new Map();

    const gScore: Map<T, number> = new Map(); // Cost from start along best known path.
    const fScore: Map<T, number> = new Map(); // Estimated total cost from start to goal through y.

    // Initialize scores for all nodes to Infinity, except the start node
    for (const node of graph.getNodes()) {
        gScore.set(node, Infinity);
        fScore.set(node, Infinity);
    }

    // Set the start node scores
    gScore.set(start, 0);
    fScore.set(start, heuristic(start, goal));

    openSet.insert({ value: start, priority: fScore.get(start)! });

    while (openSet.length > 0) {
        const current = openSet.extractMin()!.value;

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        graph.getOutgoingEdges(current).forEach(edge => {
            const neighbor = edge.destination;
            const tentative_gScore = gScore.get(current)! + edge.weight;
            if (tentative_gScore < gScore.get(neighbor)!) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + heuristic(neighbor, goal));
                if (!openSet.contains(neighbor)) {
                    openSet.insert({ value: neighbor, priority: fScore.get(neighbor)! });
                }
            }
        });
    }

    return null; // Return null if no path is found
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

