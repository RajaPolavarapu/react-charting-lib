import React from 'react';
import HeatMap from './charts/HeatMap';
import ParallelCoordinates from './charts/ParallelCoordinates';

const App = () => {
  return (
    <>
      <ParallelCoordinates />
      <HeatMap />
    </>
  );
};

export default App;
