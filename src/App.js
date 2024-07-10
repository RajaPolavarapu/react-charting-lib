import React from 'react';
import HeatMap from './charts/HeatMap';
import Sunburst from './charts/Sunburst';
import ParallelCoordinates from './charts/ParallelCoordinates';
import WorldChoropleth from './charts/WorldChoropleth';
import DirectedChord from './charts/DirectedChord';

const App = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap"
    }}>
      <Sunburst />
      <DirectedChord />
      <WorldChoropleth />
      <ParallelCoordinates />
      <HeatMap />
    </div >
  );
};

export default App;