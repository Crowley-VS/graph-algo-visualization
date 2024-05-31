import React, { useState, useEffect } from 'react';
import { GraphComponent } from './GraphVisualization';
import { D3Graph } from './algorithms/graph_d3';
import { loadAndCreateGraph } from './city_parsing/city_parse';

function App() {
  // State to store the graph data
  const [d3GraphPoint, setD3GraphPoint] = useState<D3Graph | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const graph = await loadAndCreateGraph(); // Load the graph asynchronously
        const d3Graph = new D3Graph(graph); // Create a new D3GraphNode instance
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
      <GraphComponent graph={d3GraphPoint} width={1000} height={1000} />
    </div>
  );
}

export default App;