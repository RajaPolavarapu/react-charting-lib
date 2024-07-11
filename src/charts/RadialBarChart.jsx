import React, { useMemo, useRef } from 'react';
import { arc as d3Arc, scaleBand, scaleRadial } from 'd3';
import useResponsiveWrapper from './customHooks/useResponsiveWrapper';
import data from "./data/radialbar.json";

const RadialBarChart = () => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const barsRef = useRef(null);
    const labelsRef = useRef(null);

    const { height: containerHeight, width: containerWidth } = useResponsiveWrapper(containerRef);

    var margin = { top: 100, right: 0, bottom: 0, left: 0 },
        width = containerWidth - margin.left - margin.right,
        height = containerHeight - margin.top - margin.bottom,
        innerRadius = 90,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border


    const x = useMemo(() => scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(data.map(d => d.Country)), []);

    const y = useMemo(() => scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, 13000]), [innerRadius, outerRadius]);

    const arc = useMemo(() => (
        d3Arc()
            .innerRadius(innerRadius)
            .outerRadius(d => y(d['Value']))
            .startAngle(d => x(d.Country))
            .endAngle(d => x(d.Country) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius)
    ), [innerRadius, x, y]);

    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "100%" }}>
            <h3 style={{ margin: 5 }}>Radial Bar Chart</h3>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "70vh", display: "flex", justifyContent: "center" }}
            >
                <svg ref={svgRef} width={width + margin.left + margin.right} height={height}>
                    <g transform={`translate(${width / 2 + margin.left},${height / 2 + margin.top})`}>
                        <g id="paths">
                            {data.map(d => (
                                <React.Fragment key={d.Country}>
                                    <path fill='#69b3a2' d={arc(d)} />
                                    <text
                                        fontSize={11}
                                        transform={
                                            `rotate(${(x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90}) 
                                            translate(${y(d['Value']) + 15},${4})`
                                        }>
                                        {d.Country}
                                    </text>
                                </React.Fragment>
                            ))}
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default RadialBarChart;
