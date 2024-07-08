import React, { useMemo, useRef, useCallback } from "react";
import {
    scalePoint, line, scaleLinear,
    extent, scaleOrdinal
} from "d3";
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/parallelCoords.json";

const Axis = ({ yScale, xScale, dimension }) => {
    const axisRef = useRef(null);

    const ticks = yScale.ticks(5);

    return (
        <g transform={`translate(${xScale(dimension)}, 0)`}>
            <g ref={axisRef} />
            {ticks.map((tick, i) => (
                <g key={i} transform={`translate(0, ${yScale(tick)})`}>
                    <line
                        x2="-6"
                        stroke="black"
                    />
                    <text
                        dx="-9"
                        dy="0.32em"
                        textAnchor="end"
                        style={{ fontSize: 10, fontFamily: "Roboto" }}
                    >
                        {tick}
                    </text>
                </g>
            ))}
            <text
                className="axis-label"
                x={0}
                y={-9}
                transform="rotate(90)"
                textAnchor="start"
                style={{ fill: "black", fontSize: 14, fontFamily: "Roboto" }}
            >
                {dimension}
            </text>
            <line
                y1={yScale.range()[0]}
                y2={yScale.range()[1]}
                stroke="black"
            />
        </g>
    );
};

const ParallelCoordinates = ({ dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"] }) => {
    const containerRef = useRef(null);
    const { width, height } = useResponsiveWrapper(containerRef);

    const margin = useMemo(() => ({ top: 20, right: 20, bottom: 50, left: 20 }), []);

    const yScales = useMemo(() => {
        return dimensions.reduce((scales, dimension) => {
            scales[dimension] = scaleLinear()
                .domain(extent(data, d => +d[dimension]))
                .range([height - margin.top - margin.bottom, 0]);
            return scales;
        }, {});
    }, [dimensions, height, margin]);

    const xScale = useMemo(() => {
        return scalePoint()
            .domain(dimensions)
            .range([0, width - margin.left - margin.right])
            .padding(.1);
    }, [dimensions, width, margin]);

    const colorScale = useMemo(() => {
        return scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica"])
            .range(["#440154ff", "#21908dff", "#fde725ff"]);
    }, []);

    const pathGenerator = useCallback((d) => {
        return line()(dimensions.map((p) => ([xScale(p), yScales[p](d[p])])));
    }, [dimensions, xScale, yScales]);

    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "100%" }}>
            <h3 style={{ margin: 5 }}>Parallel Coordinates</h3>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "50vh",
                }}
            >
                <svg width={width} height={height}>
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        <g id="paths">
                            {data.map((d, i) => (
                                <path
                                    key={i}
                                    d={pathGenerator(d)}
                                    fill="none"
                                    stroke={colorScale(d.Species)}
                                    opacity={0.5}
                                />
                            ))}
                        </g>
                        <g id="axes">
                            {dimensions.map(dimension => (
                                <Axis
                                    key={dimension}
                                    yScale={yScales[dimension]}
                                    xScale={xScale}
                                    dimension={dimension}
                                />
                            ))}
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default ParallelCoordinates;
