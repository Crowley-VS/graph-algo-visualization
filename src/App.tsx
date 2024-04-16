import React from 'react';
import { ForceDirectedGraph } from './GraphVisualizationAlpha'; // Adjust the import path as needed
import { Graph, Edge } from './algorithms/graph'; // Adjust the import path as needed
import { D3GraphAlpha, D3GraphPoint } from './algorithms/graph_d3'; // Adjust the import path as needed
import { Point } from './algorithms/point';

function App() {

  const simpleHasher = (value: Point): string => {
    return `${value.x}_${value.y}`;
  };
  // Create a Graph instance
  const graph = new Graph<string>((node) => node);

  // Add some nodes and edges to the graph
  graph.addEdge('A', 'B', 1);
  graph.addEdge('B', 'A', 1);
  graph.addEdge('B', 'C', 2);
  graph.addEdge('C', 'B', 2);
  graph.addEdge('B', 'D', 3);

  // Create a D3Graph instance
  const d3GraphAlpha = new D3GraphAlpha(graph);


  const p1 = new Point(0, 0);
  const p2 = new Point(23, 0);
  const p3 = new Point(1, 1);
  const p4 = new Point(0, 1);
  const p5 = new Point(5, 5);
  const p6 = new Point(3, 2);

  const data: [Point, Point, number][] = [[p3, p4, 1], [p4, p1, 1], [p1, p3, 1], [p3, p5, 5], [p5, p6, 1], [p6, p1, 3]];
  const graphPoint = Graph.fromData(data, simpleHasher);

  const d3GraphPoint = new D3GraphPoint(graphPoint);

  return (
    <div className="App">
      <ForceDirectedGraph graph={d3GraphPoint} />
    </div>
  );
}

export default App;