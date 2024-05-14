import React, { Component, RefObject } from 'react';
import * as d3 from 'd3';
import { D3GraphPoint, D3Graph } from './algorithms/graph_d3';


interface GraphComponentBaseProps<T> {
    width: number;
    height: number;
    graph: D3Graph<T>;
}

class GraphComponentBase<T> extends Component<GraphComponentBaseProps<T>> {
    private svgRef: RefObject<SVGSVGElement>;

    constructor(props: GraphComponentBaseProps<T>) {
        super(props);
        this.svgRef = React.createRef<SVGSVGElement>();
    }

    componentDidMount() {
        this.initializeGraph();
    }

    componentDidUpdate(prevProps: GraphComponentBaseProps<T>) {
        if (prevProps.graph !== this.props.graph) {
            this.initializeGraph();
        }
    }

    initializeGraph() {
        const { width, height, graph } = this.props;
        const svg = d3.select(this.svgRef.current);
        svg.selectAll('*').remove();
        const links = graph.getLinks();
        const nodes = graph.getNodes();

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).strength(this.linkStrength()))
            .force('charge', d3.forceManyBody().strength(this.chargeStrength()))
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
            .attr("r", 1);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
        });
    }

    linkStrength(): number {
        return 0; // Default strength, can be overridden
    }

    chargeStrength(): number {
        return -30; // Default strength, can be overridden
    }


    render() {
        const { width, height } = this.props;
        return <svg ref={this.svgRef} width={width} height={height} />;
    }
}

// Specific component implementations
export class GraphComponent<T> extends GraphComponentBase<T> {
    linkStrength() {
        return 0;
    }

    chargeStrength() {
        return 0;
    }
}