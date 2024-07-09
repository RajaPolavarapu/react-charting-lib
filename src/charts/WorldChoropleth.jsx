import React, { useMemo, useRef } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { Tooltip } from 'react-tooltip';
import { feature } from "topojson-client";
import useResponsiveWrapper from "./customHooks/useResponsiveWrapper";
import world from "./data/countries-50m.json";
import literacyData from "./data/literacy.json";
import { scaleLog } from "d3";

const WorldMap = () => {
    const containerRef = useRef(null);
    const { width, height } = useResponsiveWrapper(containerRef);

    const literacy = useMemo(() => literacyData, []);

    const projection = useMemo(
        () => geoEqualEarth().fitExtent([[0, 0], [width, height]], { type: "Sphere" }),
        [width, height]
    );
    const path = useMemo(() => geoPath(projection), [projection]);

    const countries = useMemo(() => feature(world, world.objects.countries).features, []);

    const radiusScale = useMemo(() => (
        scaleLog()
            .domain([85, 100])
            .range([1, 10])
    ), []);

    return (
        <div style={{ margin: 20, border: '1px solid green', borderRadius: "10px", width: "100%" }}>
            <div ref={containerRef} style={{ width: "100%", height: "90vh" }}>
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    <g className="countries">
                        {countries.map((d, i) => (
                            <path
                                key={`path-${i}`}
                                d={path(d)}
                                fill={"#0004"}
                                className="country"
                                stroke="#FFFFFF"
                                strokeWidth={0.5}
                            />
                        ))}
                    </g>
                    <g className="markers">
                        {literacy.map((city, i) => (
                            <circle
                                key={`marker-${i}`}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={`${city.name}: ${city.literacy}%`}
                                cx={projection(city.coordinates)[0]}
                                cy={projection(city.coordinates)[1]}
                                r={radiusScale(city.literacy)}
                                fill="#E91E63"
                                stroke="#FFFFFF"
                                className="marker"
                            />
                        ))}
                    </g>
                </svg>
            </div>
            <Tooltip id="my-tooltip" />
        </div>
    );
};

export default WorldMap;
