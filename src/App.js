import React from 'react';
import HeatMap from './charts/HeatMap';
import ParallelCoordinates from './charts/ParallelCoordinates';

const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <ParallelCoordinates />
      <HeatMap />
    </div>
  );
};

export default App;
