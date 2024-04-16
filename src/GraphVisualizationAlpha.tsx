import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { D3GraphPoint, D3GraphAlpha } from './algorithms/graph_d3';

export const ForceDirectedGraph = ({ graph }: { graph: D3GraphPoint }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            const svg = d3.select(ref.current);
            const links = graph.getLinks();
            const nodes = graph.getNodes();

            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id((d: any) => d.id))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(500 / 2, 500 / 2));

            const link = svg.append('g')
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .style("stroke", "black");


            const node = svg.append('g')
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 5);

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
    }, [graph]);

    return <svg ref={ref} width={500} height={500} />;
};

export const ForceDirectedGraphAlpha = ({ graph }: { graph: D3GraphAlpha<any> }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            const svg = d3.select(ref.current);
            const links = graph.getLinks();
            const nodes = graph.getNodes();

            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id((d: any) => d.id))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(500 / 2, 500 / 2));

            const link = svg.append('g')
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .style("stroke", "black");


            const node = svg.append('g')
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 5);

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
    }, [graph]);

    return <svg ref={ref} width={500} height={500} />;
};