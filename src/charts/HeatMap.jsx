import React, { useCallback, useMemo, useRef } from "react";
import {
    scaleBand, scaleSequential,
    axisBottom, select, axisLeft,
    interpolateInferno
} from "d3";
import { Tooltip } from 'react-tooltip';
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/heatmap.js";

const HeatMap = () => {
    const margin = { top: 0, right: 30, bottom: 30, left: 30 };
    const containerRef = useRef(null);
    const xRef = useRef(null);
    const yRef = useRef(null);

    const { width, height } = useResponsiveWrapper(containerRef);

    const drawingWidth = width - margin.left - margin.right;
    const drawingHeight = height - margin.top - margin.bottom;

    const groups = useMemo(() => [...new Set(data.map(d => d.group))], []);
    const variables = useMemo(() => [...new Set(data.map(d => d.variable))], []);

    const xScale = useCallback(() => {
        return scaleBand().domain(groups).range([0, drawingWidth]).padding(.05)
    }, [drawingWidth, groups])();

    const yScale = useCallback(() => {
        return scaleBand().domain(variables).range([drawingHeight, 0]).padding(0.05)
    }, [drawingHeight, variables])();

    const color = useCallback(() => {
        // return scaleSequential().domain([0, 100]).interpolator(interpolateInferno);
        return scaleSequential().domain([0, 100]).range(["lightgreen", "green"])
    }, [])();

    useCallback(() => {
        return axisBottom(xScale).tickSize(0)
    }, [xScale])()(select(xRef.current));

    useCallback(() => {
        return axisLeft(yScale).tickSize(0)
    }, [yScale])()(select(yRef.current));

    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "500px", }}>
            <h3 style={{ margin: 5 }}>Heat Map</h3>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "50vh",
                }}
            >
                <svg width={width} height={height} >
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        <g>
                            {data.map((d, i) => (
                                <rect
                                    key={i}
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={`${d.group} ${d.variable} = ${d.value}`}
                                    height={yScale.bandwidth()}
                                    width={xScale.bandwidth()}
                                    x={xScale(d.group)}
                                    y={yScale(d.variable)}
                                    fill={color(d.value)}
                                    className="rect"
                                    opacity={0.8}
                                    strokeWidth={2}
                                    rx={4}
                                    ry={4}
                                />
                            ))}
                        </g>
                        <g ref={xRef} transform={`translate(-5, ${height - margin.bottom + 5})`} style={{ fontSize: 15, fontFamily: "Roboto" }}></g>
                        <g ref={yRef} transform={`translate(-5, 5)`} style={{ fontSize: 15, fontFamily: "Roboto" }}></g>
                    </g>
                </svg>
                <Tooltip id="my-tooltip" />
            </div>
        </div>
    );
};

export default HeatMap;
