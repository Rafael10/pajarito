import React from "react";
import birdImg from "./assets/bird.png";

const Bird = ({ x, y }) => {
  return (
    <img
      src={birdImg}
      alt="bird"
      style={{
        position: "absolute",
        width: "50px",
        left: `${x}px`,
        top: `${y}px`,
        imageRendering: "pixelated"
      }}
    />
  );
};

export default Bird;