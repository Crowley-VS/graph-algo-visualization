import React, { Component, RefObject } from 'react';
import * as d3 from 'd3';
import { D3Graph } from './algorithms/graph_d3';
import { StateReport, StateReporter } from './algorithms/state_reporter';
import { GraphNode } from './algorithms/point';
import { dijkstra, aStarSearch, reconstructPath } from './algorithms/path_finding_algos';



interface GraphComponentBaseProps {
    width: number;
    height: number;
    graph: D3Graph;
}

interface GraphComponentBaseState {
    selectedNodesId: string[];
}

export class GraphComponent extends Component<GraphComponentBaseProps, GraphComponentBaseState> {
    private canvasRef: RefObject<HTMLCanvasElement>;
    private stateReporter: StateReporter;
    private num: number = 0;

    constructor(props: GraphComponentBaseProps) {
        super(props);
        this.state = {
            selectedNodesId: []
        };
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.stateReporter = new StateReporter();
    }

    componentDidMount() {
        this.initializeGraph();
        this.stateReporter.subscribe(this.handleStateUpdate);
        const canvas = this.canvasRef.current;
        if (canvas) {
            canvas.addEventListener('click', this.handleCanvasClick);
        }
    }

    componentWillUnmount() {
        const canvas = this.canvasRef.current;
        if (canvas) {
            canvas.removeEventListener('click', this.handleCanvasClick);
        }
    }

    createQuadtree(nodes: { id: string; x: number; y: number; }[]): d3.Quadtree<{ id: string; x: number; y: number; }> {
        return d3.quadtree<{ id: string; x: number; y: number; }>()
            .x(d => d.x)
            .y(d => d.y)
            .addAll(nodes);
    }


    findClosestNode(
        quadtree: d3.Quadtree<{ id: string; x: number; y: number; }>,
        clickX: number,
        clickY: number,
        searchRadius: number = Infinity
    ): { id: string; x: number; y: number; } | undefined {
        let closestNode = quadtree.find(clickX, clickY, searchRadius);
        return closestNode;
    }

    handleStateUpdate = (state: StateReport) => {
        const canvas = this.canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        switch (state.type) {
            case 'visit':
                context.fillStyle = "red";
                context.beginPath();
                context.moveTo(state.details.value.x, state.details.value.y);
                context.arc(state.details.value.x, state.details.value.y, 2, 0, 2 * Math.PI);
                context.fill();
                break;
            case 'path':
                context.fillStyle = "green";
                context.beginPath();
                context.moveTo(state.details.x, state.details.y);
                context.arc(state.details.x, state.details.y, 2, 0, 2 * Math.PI);
                context.fill();
                break;
        }
    }

    initializeGraph() {
        const { width, height, graph } = this.props;
        const canvas = this.canvasRef.current;
        if (!canvas) {
            return; // If canvas is null, exit the function
        }
        const context = canvas.getContext('2d'); // Get the context from the canvas
        if (!context) {
            return; // If context is null, exit the function
        }

        const links = graph.getLinks(); // Presumed to already have source and target with x,y coordinates
        const nodes = graph.getNodes(); // Presumed nodes array has x, y coordinates

        context.clearRect(0, 0, width, height); // Clear the canvas

        // Draw the links
        context.beginPath();
        links.forEach((link) => {
            context.moveTo(link.source.x, link.source.y);
            context.lineTo(link.target.x, link.target.y);
        });
        context.stroke(); // Apply the path drawings to the canvas

        // Draw the nodes
        context.beginPath();
        nodes.forEach((node) => {
            context.moveTo(node.x, node.y);
            context.arc(node.x, node.y, 2, 0, 2 * Math.PI); // Draw circle for each node
        });
        context.fill(); // Fill the last path
    }

    handleCanvasClick = (event: MouseEvent) => {
        const { graph } = this.props;
        const canvas = this.canvasRef.current;
        const nodes = graph.getNodes();

        if (!canvas) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        let quadtree = this.createQuadtree(nodes);
        let closestNode = this.findClosestNode(quadtree, clickX, clickY);

        if (closestNode) {
            const temp_id = closestNode.id;
            this.setState(prevState => ({
                selectedNodesId: [...prevState.selectedNodesId, temp_id]
            }), () => {
                if (this.state.selectedNodesId.length === 2) {
                    const graph1 = graph.getGraph();
                    if (graph1) {
                        const startNode = graph.getNodeFromHash(this.state.selectedNodesId[0]);
                        const endNode = graph.getNodeFromHash(this.state.selectedNodesId[1]);

                        if (startNode && endNode) {
                            aStarSearch(graph1, startNode, endNode, GraphNode.distance, this.stateReporter);
                        } else {
                            console.error('Either startNode or endNode is undefined');
                        }
                    }
                    this.setState({
                        selectedNodesId: []
                    });
                }
            });
        }
    }
    linkStrength(): number {
        return 0; // Default strength, can be overridden
    }

    chargeStrength(): number {
        return 0; // Default strength, can be overridden
    }


    render() {
        const { width, height } = this.props;
        return <canvas ref={this.canvasRef} width={width} height={height} />; // Change this
    }
}