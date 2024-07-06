import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
    scalePoint, line, scaleLinear,
    extent, select, axisLeft, scaleOrdinal
} from "d3";
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/parallelCoords.json";

const Axis = ({ yScale, xScale, data }) => {
    const ref = useRef(null);
    const labelRef = useRef(null);

    useCallback(() => {
        return axisLeft(yScale)
    }, [yScale])()(select(ref.current));

    useEffect(() => {
        const firstChild = labelRef.current.children[0];
        if (!firstChild?.textContent) {
            select(labelRef.current)
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(data)
                .style("fill", "black");
        }
    });

    return (
        <>
            <g ref={labelRef} transform={`translate(${xScale(data)}, 0)`} />
            <g ref={ref} transform={`translate(${xScale(data)}, 0)`} />
        </>
    );
}

const ParallelCoordinates = ({ dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"] }) => {

    const containerRef = useRef(null);

    const { width, height } = useResponsiveWrapper(containerRef);
    const margin = useMemo(() => ({ top: 30, right: 0, bottom: 30, left: 0 }), []);

    const yScales = useMemo(() => {
        const scales = {};
        dimensions.forEach((d) => {
            scales[d] = scaleLinear()
                .domain(extent(data, (ele) => +ele[d]))
                .range([height - margin.top - margin.bottom, 0])
        });
        return scales;
    }, [dimensions, height, margin]);

    const xScale = useCallback(() => {
        return scalePoint()
            .range([0, width - margin.left - margin.right])
            .padding(1)
            .domain(dimensions)
    }, [width, dimensions, margin])();

    const color = useCallback(() => {
        return scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica"])
            .range(["#440154ff", "#21908dff", "#fde725ff"])
    }, [])();

    const path = useCallback((d) => {
        return line()(dimensions.map((p) => ([xScale(p), yScales[p](d[p])])));
    }, [dimensions, xScale, yScales])

    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "500px", }}>
            <h3 style={{ margin: 5 }}>Parallel Coordinates</h3>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "50vh",
                }}
            >
                <svg width={width} height={height} >
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        <g id="paths">
                            {
                                data.map((d, i) => {
                                    return (
                                        <path
                                            key={i}
                                            d={path(d)}
                                            fill="none"
                                            stroke={color(d.Species)}
                                            opacity={0.5}

                                        />
                                    )
                                })
                            }
                        </g>
                        <g id="axes">
                            {
                                dimensions.map((axe) => {
                                    return <Axis
                                        key={axe}
                                        data={axe}
                                        yScale={yScales[axe]}
                                        xScale={xScale}
                                    />
                                })
                            }
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    )
}

export default ParallelCoordinates;