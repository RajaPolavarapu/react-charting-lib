import React from 'react';
import HeatMap from './charts/HeatMap';
import ForceDirected from './charts/ForceDirected';
import ParallelCoordinates from './charts/ParallelCoordinates';

const App = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap"
    }}>
      <ForceDirected />
      {/* <ParallelCoordinates /> */}
      {/* <HeatMap /> */}
    </div >
  );
};

export default App;