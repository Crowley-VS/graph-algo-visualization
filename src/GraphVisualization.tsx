import React, { Component, RefObject } from 'react';
import * as d3 from 'd3';
import { D3Graph } from './algorithms/graph_d3';
import { StateReport, StateReporter } from './algorithms/state_reporter';
import { GraphNode } from './algorithms/point';
import { dijkstra, aStarSearch } from './algorithms/path_finding_algos';



interface GraphComponentBaseProps {
    width: number;
    height: number;
    graph: D3Graph;
}

export class GraphComponent extends Component<GraphComponentBaseProps> {
    private svgRef: RefObject<SVGSVGElement>;
    private stateReporter: StateReporter;
    private num: number = 0;

    constructor(props: GraphComponentBaseProps) {
        super(props);
        this.svgRef = React.createRef<SVGSVGElement>();
        this.stateReporter = new StateReporter();
    }

    componentDidMount() {
        this.initializeGraph();
        this.stateReporter.subscribe(this.handleStateUpdate);
    }

    handleStateUpdate = (state: StateReport) => {
        const svg = d3.select(this.svgRef.current);
        switch (state.type) {
            case 'visit':
                svg.select(`circle#node-${state.details.value.id}`) // Add this line
                    .style("fill", "red"); // Change color on visit
                break;
            case 'path':
                break;
        }
    }

    initializeGraph() {
        const { width, height, graph } = this.props;
        const svg = d3.select(this.svgRef.current);
        svg.selectAll('*').remove();
        const links = graph.getLinks();
        const nodes = graph.getNodes();
        let selectedNodesId: string[] = [];


        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).strength(this.linkStrength()))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .style("stroke", "black");

        const node = svg.append('g')
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 3)
            .on("click", (d) => { // Use an arrow function here
                const temp = d;
                const temp_id = d.target.__data__.id;
                selectedNodesId.push(d.target.__data__.id);
                if (selectedNodesId.length === 2) {
                    const graph1 = graph.getGraph();
                    if (graph1) {
                        const startNode = graph.getNodeFromHash(selectedNodesId[0]);
                        const endNode = graph.getNodeFromHash(selectedNodesId[1]);

                        if (startNode && endNode) {
                            //dijkstra(graph1, startNode, endNode, this.stateReporter);
                            aStarSearch(graph1, startNode, endNode, GraphNode.distance, this.stateReporter);
                        } else {
                            // Handle the case where either startNode or endNode is undefined
                            console.error('Either startNode or endNode is undefined');
                        }
                    }
                    selectedNodesId = [];
                }
            });

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y)
                .attr("id", (d: any) => `node-${d.id}`);
        });


    }

    linkStrength(): number {
        return 0; // Default strength, can be overridden
    }

    chargeStrength(): number {
        return 0; // Default strength, can be overridden
    }


    render() {
        const { width, height } = this.props;
        return <svg ref={this.svgRef} width={width} height={height} />;
    }
}