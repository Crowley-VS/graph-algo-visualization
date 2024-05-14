import { Graph, Edge } from '../algorithms/graph'; // Adjust the import path as necessary
import { GraphNode } from '../algorithms/point';

// Define the custom Node class


interface JsonGraph {
    nodes: { [key: string]: { x: number, y: number } };
    edges: Array<{ id_start: string, id_destination: string, distance: number }>;
}

function parseJsonToGraph(data: JsonGraph): Graph<GraphNode> {

    // Create a new Graph instance using GraphNode's getHash method
    const graph = new Graph<GraphNode>((node: GraphNode) => node.getHash());

    // Add edges to the graph
    data.edges.forEach(edge => {
        const origin = new GraphNode(edge.id_start, data.nodes[edge.id_start].x, data.nodes[edge.id_start].y);
        const destination = new GraphNode(edge.id_destination, data.nodes[edge.id_destination].x, data.nodes[edge.id_destination].y);
        graph.addEdge(origin, destination, edge.distance);
    });

    return graph;
}

// Function to load JSON data from the public directory
async function loadJsonFromFile(filename: string): Promise<JsonGraph> {
    const response = await fetch(`${process.env.PUBLIC_URL}/${filename}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status}`);
    }
    return response.json();
}

// Example usage to load and parse JSON
export async function loadAndCreateGraph(): Promise<Graph<GraphNode>> {
    try {
        const jsonData = await loadJsonFromFile('Astana.json');
        const graph = parseJsonToGraph(jsonData);
        return graph;  // Return the graph instance
    } catch (error) {
        console.error('Error loading or parsing JSON:', error);
        throw error;  // Rethrow the error after logging, or handle it as needed
    }
}
