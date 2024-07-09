import React, { useEffect, useRef, useMemo } from 'react';
import {
    select,
    arc as d3Arc,
    chordDirected,
    ribbonArrow,
    schemeCategory10,
    descending
} from 'd3';
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import data from "./data/directedChord.json";

const DirectedChordReact = () => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    const { width, height } = useResponsiveWrapper(containerRef);

    const innerRadius = Math.min(width, height) * 0.45;
    const outerRadius = innerRadius + 6;

    const names = useMemo(() => Array.from(new Set(data.flatMap(d => [d.source, d.target]))), []);
    const index = useMemo(() => new Map(names.map((name, i) => [name, i])), [names]);
    const matrix = useMemo(() => {
        const mat = Array.from(index, () => new Array(names.length).fill(0));
        data.forEach(({ source, target, value }) => {
            mat[index.get(source)][index.get(target)] += value;
        });
        return mat;
    }, [index, names.length]);

    const chord = useMemo(() => chordDirected()
        .padAngle(12 / innerRadius)
        .sortSubgroups(descending)
        .sortChords(descending), [innerRadius]);

    const arc = useMemo(() => d3Arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius), [innerRadius, outerRadius]);

    const ribbon = useMemo(() => ribbonArrow()
        .radius(innerRadius)
        .padAngle(1 / innerRadius), [innerRadius]);

    const chords = useMemo(() => chord(matrix), [matrix, chord]);
    const colors = useMemo(() => schemeCategory10, []);


    return (
        <div style={{ margin: 20, border: "1px solid green", borderRadius: "10px", width: "100%" }}>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "95vh" }}
            >
                <svg ref={svgRef} width={width} height={height} viewBox={[-width / 2, -height / 2, width, height]}>
                    <path d={d3Arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI })} fill='none' id={"mainArc"} />
                    <g id='chords' fillOpacity={0.75}>
                        {
                            chords.map((d, i) => (
                                <path
                                    key={i}
                                    d={ribbon(d)}
                                    fill={colors[d.target.index]}
                                    style={{
                                        mixBlendMode: "multiply"
                                    }}
                                />
                            ))
                        }
                    </g>
                    <g id='chordgroups' >
                        {
                            chords.groups.map((d, i) => (
                                <g key={i}>
                                    <path
                                        d={arc(d)}
                                        fill={colors[d.index]}
                                    />
                                    <text dy={-3} fontSize={10}>
                                        <textPath href="#mainArc" startOffset={d.startAngle * outerRadius} endAngle={40}>
                                            {names[d.index]}
                                        </textPath>
                                    </text>
                                </g>
                            ))
                        }
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default DirectedChordReact;
