import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useSound } from "../../hooks/useSound";

type positionType = {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
};

const BACKGROUND_COLOR = "rgb(34, 34, 34)";
const CANVAS_SIZE = {
  width: 4000,
  height: 3000,
};

const initializePositions = (windowSize: { width: number; height: number }) => {
  const pointsLength = Math.floor(Math.random() * 10) + 10;
  const localPositions: positionType[] = [];

  for (let i = 0; i < pointsLength; i++) {
    const radius = Math.random() * 75 + 5;
    const x = Math.random() * (windowSize.width - radius * 2) + radius;
    const y = Math.random() * (windowSize.height - radius * 2) + radius;
    const speed = Math.random() * 20 + 1;
    const alpha = Math.random() * 0.2 + 0.1;

    localPositions.push({ id: i, x, y, radius, speed, alpha });
  }

  return localPositions;
};

export const Circles: FC = () => {
  const { windowSize } = useWindowSize();

  const positions = useMemo(
    () => initializePositions(windowSize),
    [windowSize],
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();

  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
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

      if (position.x < position.radius) {
        position.x = position.radius;
      }

      if (position.x > windowSize.width - position.radius) {
        position.x = windowSize.width - position.radius;
      }

      if (position.y < position.radius) {
        position.y = position.radius;
      }

      if (position.y > windowSize.height - position.radius) {
        position.y = windowSize.height - position.radius;
      }

      // Draw circle
      ctx.beginPath();
      ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 192, 192, ${position.alpha})`;
      ctx.fill();
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
