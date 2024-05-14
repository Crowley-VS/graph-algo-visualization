import React, { useState, useEffect } from 'react';
import { GraphComponent } from './GraphVisualization'; // Adjust the import path as needed
import { Graph, Edge } from './algorithms/graph'; // Adjust the import path as needed
import { D3GraphPoint, D3Graph, D3GraphNode } from './algorithms/graph_d3'; // Adjust the import path as needed
import { Point, Node, GraphNode } from './algorithms/point';
import { loadAndCreateGraph } from './city_parsing/city_parse';

function App() {
  // State to store the graph data
  const [d3GraphPoint, setD3GraphPoint] = useState<D3GraphNode | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const graph = await loadAndCreateGraph(); // Load the graph asynchronously
        const d3Graph = new D3GraphNode(graph); // Create a new D3GraphNode instance
        setD3GraphPoint(d3Graph); // Set the loaded graph into state
      } catch (error) {
        console.error('Failed to load and create graph:', error);
      }
    }

    fetchGraph();
  }, []); // Empty dependency array to run only once on mount

  if (!d3GraphPoint) {
    return <div>Loading graph...</div>; // Display loading state or spinner
  }

  return (
    <div className="App">
      <h1>Force Directed Graph</h1>
      <GraphComponent graph={d3GraphPoint} width={800} height={600} />
    </div>
  );
}

export default App;