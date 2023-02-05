import { useEffect, useRef } from "react";
import { drawWheel } from "../services/canvas/drawWheel";

import "./Wheel.css";

const Wheel = ({ sections, ...canvasProps }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawWheel(canvasRef.current, sections);
  }, []);

  return (
    <div className="wheel__container">
      <canvas ref={canvasRef} {...canvasProps}></canvas>
    </div>
  );
};

export default Wheel;
