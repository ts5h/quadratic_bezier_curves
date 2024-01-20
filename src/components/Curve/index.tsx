import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

type point = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

const CANVAS_SIZE = {
  width: 5000,
  height: 4000,
};

const initializePositions = (windowSize: { width: number; height: number }) => {
  // Prepare an odd number of points
  let pointsLength = Math.floor(Math.random() * 20) + 10;
  pointsLength = pointsLength % 2 === 1 ? pointsLength + 1 : pointsLength;

  const localPoints: point[] = [];

  for (let i = 0; i < pointsLength; i++) {
    const x = Math.random() * windowSize.width;
    const y = Math.random() * windowSize.height;
    const speed = Math.random() * 20 + 1;

    localPoints.push({ id: i, x, y, speed });
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

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    clearCanvas(ctx);

    positions.forEach((position) => {
      // Update position
      const degree = Math.random() * 360;
      const radian = (degree * Math.PI) / 180;
      position.x += Math.cos(radian) * position.speed;
      position.y += Math.sin(radian) * position.speed;

      // Draw circle
      // ctx.beginPath();
      // ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2);
      // ctx.fillStyle = `rgba(192, 192, 192, ${position.alpha})`;
    });

    animationFrameIdRef.current = requestAnimationFrame(render);
  }, [positions]);

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
