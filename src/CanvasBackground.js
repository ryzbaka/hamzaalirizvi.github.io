import React, { useState, useEffect, useCallback } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

const CanvasBackground = () => {
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const handleResize = useCallback(() => {
    setCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    //adding event listeners to resize the canvas
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sketch = (p) => {
    let t = 0;
    p.setup = () => {
        p.createCanvas(canvasSize.width, canvasSize.height);
        p.background(0);
    };
    p.draw = () => {
      t += 0.002;
      const circleX = p.map(p.noise(t), 0, 1, 0, canvasSize.width);
      const circleY = p.map(p.noise(t, t), 0, 1, 0, canvasSize.height);
      p.fill(
          p.map(p.noise(t), 0, 1, 0, 255),
          p.map(p.noise(t, t), 0, 1, 0, 255),
          p.map(p.noise(t, t, t), 0, 1, 0, 255),
          p.map(p.noise(t), 0, 1, 0, 255)
        );
        p.stroke(255,0,255);
        p.circle(circleX, circleY, p.map(p.noise(t, t, t), 0, 1, 10, 500));
        // p.background(p.map(p.noise(t,t),0,1,0,10),p.map(p.noise(t),0,1,0,20))
        p.filter(p.BLUR, 5); // Adjust blur amount as needed
    };
    p.windowResized = () => {
      p.resizeCanvas(canvasSize.width, canvasSize.height);
    };
  };

  return <ReactP5Wrapper sketch={sketch} className="canvas-background" />;
};

export default CanvasBackground;
