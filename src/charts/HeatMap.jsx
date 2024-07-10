import React, { useEffect, useMemo, useRef } from "react";
import {
    scaleBand,
    scaleLinear,
    interpolateInferno,
    scaleOrdinal,
    scaleSequential,
    interpolateYlGn
} from "d3";
import { Tooltip } from 'react-tooltip';
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/heatmap.json";

const {
    group, variable, value
} = { group: "x", variable: "y", value: "value" };

const COLORS = [
    "#e7f0fa",
    "#c9e2f6",
    "#95cbee",
    "#0099dc",
    "#4ab04a",
    "#ffd73e",
    "#eec73a",
    "#e29421",
    "#e29421",
    "#f05336",
    "#ce472e",
];

const THRESHOLDS = [
    0, 0.01, 0.02, 0.03, 0.09, 0.1, 0.15, 0.25, 0.4, 0.5, 1,
];


const useScales = (data, drawingHeight, drawingWidth) => {
    const groups = useMemo(() => [...new Set(data.map(d => d[group]))], [data]);
    const variables = useMemo(() => [...new Set(data.map(d => d[variable]))], [data]);

    const xScale = useMemo(() => (
        scaleBand().domain(groups).range([0, drawingWidth]).padding(0.1)
    ), [groups, drawingWidth]);

    const yScale = useMemo(() => (
        scaleBand().domain(variables).range([0, drawingHeight]).padding(0.1)
    ), [variables, drawingHeight]);

    const colorScale = useMemo(() => (
        scaleLinear().domain(THRESHOLDS.map((t) => t * 600)).range(COLORS)
    ), []);


    return { xScale, yScale, colorScale, xDomain: groups, yDomain: variables };
};


const HeatMap = () => {
    const margin = useMemo(() => ({ top: 30, right: 30, bottom: 30, left: 30 }), []);
    const containerRef = useRef(null);

    const { width: tempWidth, height: tempHeight } = useResponsiveWrapper(containerRef);

    const width = Math.min(tempHeight, tempWidth);
    const height = width;

    const drawingHeight = useMemo(() => height - margin.top - margin.bottom, [height, margin]);
    const drawingWidth = useMemo(() => width - margin.right - margin.left, [width, margin]);

    const {
        xScale, yScale, colorScale,
        xDomain
    } = useScales(data, drawingHeight, drawingWidth);


    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "100%" }}>
            <h3 style={{ margin: 5 }}>Heat Map</h3>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center" }}
            >
                <svg width={width} height={height}>
                    <g
                        transform={`translate(${margin.left},${margin.top})`}
                    >
                        <g id="rects">
                            {data.map((d, i) => {
                                if (!d[value]) return null;
                                return <rect
                                    key={i}
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={`${d[group]} ${d[variable]} = ${d[value]}`}
                                    height={yScale.bandwidth()}
                                    width={xScale.bandwidth()}
                                    x={xScale(d[group])}
                                    y={yScale(d[variable])}
                                    fill={colorScale(d[value]) || "white"}
                                    className="rect"
                                    opacity={0.8}
                                    strokeWidth={2}
                                    rx={4}
                                    ry={4}
                                />
                            })}
                        </g>
                        {/* <g id="y-axis">
                            {yDomain.map(d => {
                                return (
                                    <text
                                        x={-5}
                                        y={yScale(d) + yScale.bandwidth() / 2}
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                    >
                                        {d}
                                    </text>
                                )
                            })}
                        </g> */}
                        <g id="x-axis">
                            {xDomain.map(d => {
                                if (d % 10 !== 0) return null;
                                return (
                                    <text
                                        x={xScale(d) + xScale.bandwidth() / 2}
                                        y={drawingHeight + 15}
                                        textAnchor="middle"
                                        dominantBaseline="top"
                                    >
                                        {d}
                                    </text>
                                )
                            })}
                        </g>
                    </g>
                </svg>
                <Tooltip id="my-tooltip" />
            </div>
        </div>
    );
};

export default HeatMap;
