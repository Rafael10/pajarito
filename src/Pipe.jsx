import React from "react";
import cactus from "./assets/cactus.png";

const Pipe = ({ x, gap }) => {
  const pipeWidth = 60;
  const gapSize = 150;

  return (
    <>
      {/* ARRIBA */}
      <div
        style={{
          position: "absolute",
          width: `${pipeWidth}px`,
          height: `${gap}px`,
          left: `${x}px`,
          top: 0,
          backgroundImage: `url(${cactus})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "60px auto",
          transform: "rotate(180deg)",
          imageRendering: "pixelated"
        }}
      />

      {/* ABAJO */}
      <div
        style={{
          position: "absolute",
          width: `${pipeWidth}px`,
          height: `500px`,
          left: `${x}px`,
          top: `${gap + gapSize}px`,
          backgroundImage: `url(${cactus})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "60px auto",
          imageRendering: "pixelated"
        }}
      />
    </>
  );
};

export default Pipe;