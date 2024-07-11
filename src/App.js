import React from 'react';
import HeatMap from './charts/HeatMap';
import Sunburst from './charts/Sunburst';
import ParallelCoordinates from './charts/ParallelCoordinates';
import WorldChoropleth from './charts/WorldChoropleth';
import DirectedChord from './charts/DirectedChord';
import RadialBarChart from './charts/RadialBarChart';

const App = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap"
    }}>
      <RadialBarChart />
      <Sunburst />
      <DirectedChord />
      <WorldChoropleth />
      <ParallelCoordinates />
      <HeatMap />
    </div >
  );
};

export default App;