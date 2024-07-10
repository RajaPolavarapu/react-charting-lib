import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    arc as d3Arc,
    interpolateRainbow,
    hierarchy as d3Hierarchy,
    scaleOrdinal,
    partition,
    quantize,
} from 'd3';
import chartData from "./data/flare-2.json";
import useResponsiveWrapper from './customHooks/useResponsiveWrapper';

const Sunburst = () => {
    const containerRef = useRef(null);
    const [data, setData] = useState(chartData);

    const { width, height } = useResponsiveWrapper(containerRef);
    const containerHeight = Math.min(height, width - 100);
    const radius = useMemo(() => (containerHeight / 10), [containerHeight]);

    const color = useMemo(() => (
        scaleOrdinal(quantize(interpolateRainbow, data.children.length + 1))
    ), [data.children.length]);

    const hierarchy = useMemo(() => (
        d3Hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
    ), [data]);

    const root = useMemo(() => (
        (partition()
            .size([2 * Math.PI, hierarchy.height + 1])
            (hierarchy)).each(d => d.current = d)
    ), [hierarchy]);

    const arc = useMemo(() => (
        d3Arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
    ), [radius]);

    const arcVisible = useCallback((d) => {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }, [])

    const getColor = useCallback((d) => {
        let node = d;
        while (node.depth > 1) node = node.parent;
        return color(node.data.name);
    }, [color]);

    const clicked = (_, p) => {
        setData(p.data);
    }

    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "100%" }}>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "1000px", display: "flex", justifyContent: "center" }}
            >
                <svg width={width} height={height} font='10px sans-serif'>
                    <g id="parent" transform={`translate(${width / 2}, ${height / 1.8})`} >
                        <g id="arcs" >
                            {
                                root.descendants().slice(1).map(d => (
                                    <path
                                        key={d.data.name}
                                        fill={getColor(d)}
                                        fillOpacity={d.children ? 0.6 : 0.4}
                                        pointerEvents={arcVisible(d.current) ? "auto" : "none"}
                                        d={arc(d.current)}
                                        cursor={d.children ? "pointer" : "auto"}
                                        onClick={d.children ? (e) => clicked(e, d) : null}
                                    />
                                ))
                            }
                        </g>
                        <circle onClick={(e) => setData(chartData)} r={radius} fill='none' pointerEvents={"all"} />
                    </g>
                </svg>
            </div>
        </div >
    );
};

export default Sunburst;
