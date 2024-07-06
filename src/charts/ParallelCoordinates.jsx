import React, { useEffect, useMemo, useRef, useCallback } from "react";
import {
    scalePoint, line, scaleLinear,
    extent, select, axisLeft, scaleOrdinal
} from "d3";
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/parallelCoords.json";

const useAxis = (ref, yScale, label, xPosition) => {
    useEffect(() => {
        if (ref.current) {
            const axisGenerator = axisLeft(yScale);
            select(ref.current).call(axisGenerator);

            const labelGroup = select(ref.current.parentNode).select(".axis-label");
            if (labelGroup.empty()) {
                select(ref.current.parentNode)
                    .append("text")
                    .attr("class", "axis-label")
                    .attr("y", -9)
                    .attr("text-anchor", "middle")
                    .text(label)
                    .style("fill", "black");
            }
        }
    }, [ref, yScale, label, xPosition]);
};

const Axis = ({ yScale, xScale, dimension }) => {
    const axisRef = useRef(null);
    useAxis(axisRef, yScale, dimension, xScale(dimension));

    return (
        <g transform={`translate(${xScale(dimension)}, 0)`}>
            <g ref={axisRef} />
        </g>
    );
};

const ParallelCoordinates = ({ dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"] }) => {
    const containerRef = useRef(null);
    const { width, height } = useResponsiveWrapper(containerRef);

    const margin = useMemo(() => ({ top: 30, right: 0, bottom: 30, left: 0 }), []);

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
            .padding(1);
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
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "500px" }}>
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
                        {/* Paths */}
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
                        {/* Axes */}
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
