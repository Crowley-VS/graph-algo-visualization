import React from 'react';
import { ForceDirectedGraph } from './GraphVisualization'; // Adjust the import path as needed
import { Graph, Edge } from './algorithms/graph'; // Adjust the import path as needed
import { D3Graph } from './algorithms/graph_d3'; // Adjust the import path as needed

function App() {
  // Create a Graph instance
  const graph = new Graph<string>((node) => node);

  // Add some nodes and edges to the graph
  graph.addEdge('A', 'B', 1);
  graph.addEdge('B', 'A', 1);
  graph.addEdge('B', 'C', 2);
  graph.addEdge('C', 'B', 2);
  graph.addEdge('B', 'D', 3);

  // Create a D3Graph instance
  const d3Graph = new D3Graph(graph);

  return (
    <div className="App">
      <ForceDirectedGraph graph={d3Graph} />
    </div>
  );
}

export default App;