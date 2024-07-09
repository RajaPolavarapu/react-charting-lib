import React from 'react';
import HeatMap from './charts/HeatMap';
import ForceDirected from './charts/ForceDirected';
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
      <DirectedChord />
      <WorldChoropleth />
      <ParallelCoordinates />
      <HeatMap />
    </div >
  );
};

export default App;