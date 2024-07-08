import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/graph.json";
import {
    forceSimulation, forceLink, forceManyBody,
    forceX, forceY, schemeCategory10, scaleOrdinal,
    selectAll, drag,
    forceCenter
} from 'd3';

const ForceDirectedGraph = () => {
    const svgRef = useRef();
    const containerRef = useRef(null);
    const nodeRef = useRef(null);
    const linkRef = useRef(null);
    const { height, width } = useResponsiveWrapper(containerRef);

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const simulationRef = useRef(null);
    const color = useMemo(() => scaleOrdinal(schemeCategory10), []);

    const dragstarted = useCallback((event) => {
        if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }, []);

    const dragged = useCallback((event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }, []);

    const dragended = useCallback((event) => {
        if (!event.active) simulationRef.current.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }, []);

    useEffect(() => {
        selectAll("circle")
            .data(nodes)
            .join("circle")
            .call(drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
    }, [nodes, dragstarted, dragged, dragended]);

    useEffect(() => {
        const linksData = [...data.links];
        const nodesData = [...data.nodes];

        const simulation = forceSimulation(nodesData)
            .force('link', forceLink(linksData).id(d => d.id))
            .force('charge', forceManyBody())
            .force('center', forceCenter(0, 0))
            .force('x', forceX())
            .force('y', forceY())
            .on('tick', () => {
                setNodes([...nodesData]);
                setLinks([...linksData]);
            });

        simulationRef.current = simulation

        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "99vh" }}
            >
                <svg ref={svgRef} viewBox={[-width / 2, -height / 2, width, height]} height={height} width={width}>
                    <g ref={linkRef} stroke="#999" opacity={.6}>
                        {
                            links.map((d, i) => (
                                <line
                                    key={i}
                                    id="link"
                                    strokeOpacity={.6}
                                    strokeWidth={Math.sqrt(d.value)}
                                    x1={d.source.x}
                                    y1={d.source.y}
                                    x2={d.target.x}
                                    y2={d.target.y}
                                />
                            ))
                        }
                    </g>
                    <g ref={nodeRef} stroke="#fff" strokeWidth={1.5}>
                        {
                            nodes.map((d, i) => (
                                <circle
                                    key={i}
                                    fill={color(d.group)}
                                    cx={d.x}
                                    cy={d.y}
                                    r={5}
                                >
                                    <title>{d.id}</title>
                                </circle>
                            ))
                        }
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default ForceDirectedGraph;
