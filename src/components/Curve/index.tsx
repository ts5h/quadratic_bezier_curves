import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

type point = {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  wait: number;
};

const PRIMARY_COLOR = "rgb(68, 68, 68)";
const SECONDARY_COLOR = "rgb(184, 184, 184)";
const CANVAS_SIZE = {
  width: 5000,
  height: 4000,
};

const initializePositions = (windowSize: { width: number; height: number }) => {
  // Prepare an odd number of points
  let pointsLength = Math.floor(Math.random() * 2) + 10;
  pointsLength = pointsLength % 2 === 1 ? pointsLength + 1 : pointsLength;

  const localPoints: point[] = [];

  for (let i = 0; i < pointsLength; i++) {
    const x = Math.floor(Math.random() * windowSize.width);
    const y = Math.floor(Math.random() * windowSize.height);
    const angle = Math.random() * 360;
    const speed = Math.random() * 5 + 1;

    localPoints.push({ id: i, x, y, angle, speed, wait: speed });
  }

  return localPoints;
};

export const Curve: FC = () => {
  const { windowSize } = useWindowSize();

  const positions = useMemo(
    () => initializePositions(windowSize),
    [windowSize],
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();

  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
  }, []);

  const updatePositions = useCallback(
    (id: number) => {
      const position = positions[id];
      const radians = (position.angle * Math.PI) / 180;
      const x = position.x + Math.cos(radians) * position.speed;
      const y = position.y + Math.sin(radians) * position.speed;

      let newAngle = position.angle;
      if (x < 0 || x > windowSize.width) {
        newAngle = 180 - position.angle;
      }

      if (y < 0 || y > windowSize.height) {
        newAngle = 360 - position.angle;
      }

      position.x = x;
      position.y = y;
      position.angle = newAngle;
    },
    [positions],
  );

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    clearCanvas(ctx);

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];

      // Draw fill circle
      ctx.fillStyle = SECONDARY_COLOR;
      ctx.beginPath();
      ctx.arc(position.x, position.y, 1.8, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      // Draw coordinate
      ctx.font = "10px Roboto medium";
      ctx.textAlign = "left";
      ctx.fillText(
        `${position.x.toFixed(2)}, ${position.y.toFixed(2)}`,
        position.x - 3,
        position.y - 5,
      );

      // Draw line
      let prevPosition: point;
      if (i === 0) {
        prevPosition = positions[positions.length - 1];
      } else {
        prevPosition = positions[i - 1];
      }

      ctx.strokeStyle = SECONDARY_COLOR;
      ctx.lineWidth = 0.25;
      ctx.beginPath();
      ctx.moveTo(prevPosition.x, prevPosition.y);
      ctx.lineTo(position.x, position.y);
      ctx.stroke();

      updatePositions(position.id);
    }

    animationFrameIdRef.current = requestAnimationFrame(render);
  }, [positions, clearCanvas, updatePositions]);

  useEffect(() => {
    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE.width}
      height={CANVAS_SIZE.height}
    />
  );
};
