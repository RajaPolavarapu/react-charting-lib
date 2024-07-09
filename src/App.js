import React from 'react';
import HeatMap from './charts/HeatMap';
import ForceDirected from './charts/ForceDirected';
import ParallelCoordinates from './charts/ParallelCoordinates';
import WorldChoropleth from './charts/WorldChoropleth';

const App = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap"
    }}>
      <WorldChoropleth />
      <ParallelCoordinates />
      <HeatMap />
    </div >
  );
};

export default App;