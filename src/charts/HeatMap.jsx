import React, { useEffect, useMemo, useRef } from "react";
import {
    scaleBand, scaleSequential,
    axisBottom, axisLeft, select
} from "d3";
import { Tooltip } from 'react-tooltip';
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/heatmap.js";

const useScales = (data, width, height, margin) => {
    const groups = useMemo(() => [...new Set(data.map(d => d.group))], [data]);
    const variables = useMemo(() => [...new Set(data.map(d => d.variable))], [data]);

    const xScale = useMemo(() => (
        scaleBand().domain(groups).range([0, width - margin.left - margin.right]).padding(0.05)
    ), [groups, width, margin]);

    const yScale = useMemo(() => (
        scaleBand().domain(variables).range([height - margin.top - margin.bottom, 0]).padding(0.05)
    ), [variables, height, margin]);

    const colorScale = useMemo(() => (
        scaleSequential().domain([0, 100]).range(["lightgreen", "green"])
    ), []);

    return { xScale, yScale, colorScale };
};

const useRenderAxes = (xRef, yRef, xScale, yScale, height, margin) => {
    useEffect(() => {
        const xAxis = axisBottom(xScale).tickSize(0);
        select(xRef.current).call(xAxis)
            .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
            .style("font-size", "12px")
            .style("font-family", "Roboto");

        const yAxis = axisLeft(yScale).tickSize(0);
        select(yRef.current).call(yAxis)
            .attr("transform", "translate(0, 0)")
            .style("font-size", "12px")
            .style("font-family", "Roboto");
    }, [xScale, yScale, height, margin, xRef, yRef]);
};

const HeatMap = () => {
    const margin = { top: 30, right: 0, bottom: 30, left: 30 };
    const containerRef = useRef(null);
    const xRef = useRef(null);
    const yRef = useRef(null);

    const { width, height } = useResponsiveWrapper(containerRef);
    const drawingWidth = width - margin.left - margin.right;
    const drawingHeight = height;

    const { xScale, yScale, colorScale } = useScales(data, drawingWidth, drawingHeight, margin);
    useRenderAxes(xRef, yRef, xScale, yScale, height, margin);

    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "100%" }}>
            <h3 style={{ margin: 5 }}>Heat Map</h3>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "50vh" }}
            >
                <svg width={width} height={height}>
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        {data.map((d, i) => (
                            <rect
                                key={i}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={`${d.group} ${d.variable} = ${d.value}`}
                                height={yScale.bandwidth()}
                                width={xScale.bandwidth()}
                                x={xScale(d.group)}
                                y={yScale(d.variable)}
                                fill={colorScale(d.value)}
                                className="rect"
                                opacity={0.8}
                                strokeWidth={2}
                                rx={4}
                                ry={4}
                            />
                        ))}
                        <g ref={xRef} transform={`translate(0, ${drawingHeight})`} />
                        <g ref={yRef} />
                    </g>
                </svg>
                <Tooltip id="my-tooltip" />
            </div>
        </div>
    );
};

export default HeatMap;
