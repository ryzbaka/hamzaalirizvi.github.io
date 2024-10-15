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
    // let t = 0;
    // p.setup = () => {
    //   p.createCanvas(canvasSize.width, canvasSize.height);
    //   p.background(255);
    // };
    // p.draw = () => {
    //   t += 0.002;
    //   const circleX = p.map(p.noise(t), 0, 1, 0, canvasSize.width);
    //   const circleY = p.map(p.noise(t, t), 0, 1, 0, canvasSize.height);
    //   p.fill(
    //     p.map(p.noise(t), 0, 1, 0, 255),
    //     p.map(p.noise(t, t), 0, 1, 0, 255),
    //     p.map(p.noise(t, t, t), 0, 1, 0, 255),
    //     p.map(p.noise(t), 0, 1, 0, 255)
    //   );
    //   p.stroke(
    //     p.map(p.noise(t), 0, 1, 0, 255),
    //     0,
    //     p.map(p.noise(t, t, t), 0, 1, 0, 255)
    //   );
    //   p.circle(circleX, circleY, p.map(p.noise(t, t, t), 0, 1, 10, 500));
    //   // p.background(p.map(p.noise(t,t),0,1,0,10),p.map(p.noise(t),0,1,0,20))
    //   p.filter(p.BLUR, 5); // Adjust blur amount as needed
    // };
    let grid;
    const s = 5;
    const n = Math.ceil(canvasSize.width/s);
    const m = Math.ceil(canvasSize.height/s);
    // const liveColor = p.color(p.random(255),p.random(255),p.random(255),50)
    const liveColor = p.color(0,0,p.random(255),70)
    const renderGrid = (grid,p) => {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          if (grid[i][j]) {
            p.fill(liveColor);
          } else {
            p.fill("white");
          }
          p.rect(s * i, s * j, s, s);
        }
      }
    };

    p.setup = ()=>{
      p.createCanvas(canvasSize.width, canvasSize.height);
      p.noStroke()
      grid = [];
      for (let i = 0; i < n; i++) {
        const newRow = [];
        for (let j = 0; j < m; j++) {
          newRow.push(Math.round(Math.random()));
        }
        grid.push(newRow);
      }
    }

    const generateNextState = (grid, x, y) => {
      const currentState = grid[x][y];
      let live = 0;

      for (let i = x - 1; i < x - 1 + 3; i++) {
        for (let j = y - 1; j < y - 1 + 3; j++) {
          if (i >= 0 && i < n && j >= 0 && j < n) {
            //within bounds
            if (x == i && y == j) {
              //do nothing
            } else {
              if (grid[i][j]) {
                live += 1;
              }
            }
          }
        }
      }

      if (currentState) {
        if (live < 2 || live > 3) {
          //over or under
          return 0;
        } else {
          return 1;
        }
      } else {
        if (live == 3) {
          return 1;
        } else {
          return 0;
        }
      }
    };

    const generateNextGeneration = (grid) => {
      const nextGen = [];
      for (let i = 0; i < n; i++) {
        const newRow = [];
        for (let j = 0; j < m; j++) {
          newRow.push(generateNextState(grid, i, j));
        }
        nextGen.push(newRow);
      }
      return nextGen;
    };

    p.draw = ()=>{
      // frameRate(0.1)
      p.frameRate(10);
      p.background(220);
      grid = generateNextGeneration(grid);
      renderGrid(grid,p);
    }
    ////
    // p.windowResized = () => {
    //   p.resizeCanvas(canvasSize.width, canvasSize.height);
    // };
  };

  return <ReactP5Wrapper sketch={sketch} className="canvas-background" />;
};

export default CanvasBackground;
