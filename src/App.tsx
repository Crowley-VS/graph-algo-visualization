import React from 'react';
import { ForceDirectedGraph } from './GraphVisualizationAlpha'; // Adjust the import path as needed
import { Graph, Edge } from './algorithms/graph'; // Adjust the import path as needed
import { D3GraphAlpha, D3GraphPoint } from './algorithms/graph_d3'; // Adjust the import path as needed
import { Point } from './algorithms/point';

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
  const d3GraphAlpha = new D3GraphAlpha(graph);


  const graphPoint = new Graph<Point>((point) => `${point.x},${point.y}`);
  const p1 = new Point(0, 0);
  const p2 = new Point(23, 0);
  const p3 = new Point(1, 1);
  const p4 = new Point(0, 1);

  graphPoint.addEdge(p1, p2, Point.distance(p1, p2));
  graphPoint.addEdge(p2, p1, Point.distance(p1, p2));
  graphPoint.addEdge(p2, p3, Point.distance(p2, p3));
  graphPoint.addEdge(p3, p2, Point.distance(p2, p3));
  graphPoint.addEdge(p3, p4, Point.distance(p3, p4));
  graphPoint.addEdge(p4, p3, Point.distance(p3, p4));
  graphPoint.addEdge(p4, p1, Point.distance(p4, p1));
  graphPoint.addEdge(p1, p4, Point.distance(p4, p1));
  graphPoint.addEdge(p1, p3, Point.distance(p1, p3)); // Diagonal\
  graphPoint.addEdge(p3, p3, Point.distance(p1, p3));

  const d3GraphPoint = new D3GraphPoint(graphPoint);

  return (
    <div className="App">
      <ForceDirectedGraph graph={d3GraphPoint} />
    </div>
  );
}

export default App;