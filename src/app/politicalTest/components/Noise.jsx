import React from "react";

const Noise = () => (
  <div
    className="pointer-events-none fixed inset-0 z-10 opacity-[0.035] animate-noise"
    style={{
      backgroundImage: "url('https://www.ui-layouts.com/noise.gif')",
    }}
  />
);

export default Noise;
