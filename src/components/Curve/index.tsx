import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";

type point = {
  id: number;
  newX: number;
  newY: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
};

const PRIMARY_COLOR = "rgb(68, 68, 68)";
const SECONDARY_COLOR = "rgba(68, 68, 68, 0.4)";
const CANVAS_SIZE = {
  width: 5000,
  height: 4000,
};

const initializePositions = () => {
  // Prepare an odd number of points
  let pointsLength = Math.floor(Math.random() * 10) + 10;
  pointsLength = pointsLength % 2 === 1 ? pointsLength + 1 : pointsLength;

  const localPoints: point[] = [];

  for (let i = 0; i < pointsLength; i++) {
    const newX = 0;
    const newY = 0;
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    const angle = Math.random() * 360;
    const speed = Math.random() > 0.1 ? Math.random() * 2 : Math.random() * 10;

    localPoints.push({ id: i, newX, newY, x, y, angle, speed });
  }

  return localPoints;
};

export const Curve: FC = () => {
  const positions = useMemo(() => initializePositions(), []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();
  const shufflingRef = useRef<boolean>(false);

  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
  }, []);

  const shufflePositions = useCallback(() => {
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      position.newX = Math.floor(Math.random() * window.innerWidth);
      position.newY = Math.floor(Math.random() * window.innerHeight);
      position.angle = Math.random() * 360;
      position.speed =
        Math.random() > 0.1 ? Math.random() * 2 : Math.random() * 10;
    }
  }, [positions]);

  const moveToNewPositions = useCallback(() => {
    let flag = false;
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      position.x += (position.newX - position.x) / 5;
      position.y += (position.newY - position.y) / 5;

      if (
        Math.abs(position.newX - position.x) < 1 &&
        Math.abs(position.newY - position.y) < 1
      ) {
        position.x = position.newX;
        position.y = position.newY;
        flag = true;
      } else {
        flag = false;
      }
    }

    if (flag) {
      shufflingRef.current = false;
    }
  }, [positions]);

  const updatePositions = useCallback(() => {
    // TODO: Fix windowResize
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const radians = (position.angle * Math.PI) / 180;
      let x = position.x + Math.cos(radians) * position.speed;
      let y = position.y + Math.sin(radians) * position.speed;

      // Follow window resizing
      if (x >= window.innerWidth) x = window.innerWidth;
      if (y >= window.innerHeight) y = window.innerHeight;

      // Bounce off the walls
      let newAngle = position.angle;
      if (x <= 0 || x >= window.innerWidth) newAngle = 180 - position.angle;
      if (y <= 0 || y >= window.innerHeight) newAngle = 360 - position.angle;

      position.x = x;
      position.y = y;
      position.angle = newAngle;
    }
  }, [positions]);

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

      // Draw stroke circle
      ctx.strokeStyle = SECONDARY_COLOR;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.arc(position.x, position.y, 5.4, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();

      // Draw coordinate
      ctx.font = "10px Roboto medium";
      ctx.textAlign = "left";
      ctx.fillText(
        `${position.x.toFixed(2)}, ${position.y.toFixed(2)}`,
        position.x - 3,
        position.y - 5,
      );

      // Positions
      const prevPosition =
        i === 0 ? positions[positions.length - 1] : positions[i - 1];

      const prevPrevPosition =
        i === 0
          ? positions[positions.length - 2]
          : i === 1
            ? positions[positions.length - 1]
            : positions[i - 2];

      // Draw line
      ctx.strokeStyle = SECONDARY_COLOR;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(prevPosition.x, prevPosition.y);
      ctx.lineTo(position.x, position.y);
      ctx.stroke();

      // Draw Bezier curve
      ctx.strokeStyle = PRIMARY_COLOR;
      ctx.lineWidth = 2.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();

      const startPoint = {
        x: (prevPosition.x - prevPrevPosition.x) / 2 + prevPrevPosition.x,
        y: (prevPosition.y - prevPrevPosition.y) / 2 + prevPrevPosition.y,
      };

      const endPoint = {
        x: (position.x - prevPosition.x) / 2 + prevPosition.x,
        y: (position.y - prevPosition.y) / 2 + prevPosition.y,
      };

      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.quadraticCurveTo(
        prevPosition.x,
        prevPosition.y,
        endPoint.x,
        endPoint.y,
      );
      ctx.stroke();
    }

    if (shufflingRef.current) {
      moveToNewPositions();
    } else {
      if (Math.floor(Math.random() * 1000) === 1) {
        shufflingRef.current = true;
        shufflePositions();
      } else {
        updatePositions();
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(render);
  }, [
    clearCanvas,
    positions,
    moveToNewPositions,
    shufflePositions,
    updatePositions,
  ]);

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
