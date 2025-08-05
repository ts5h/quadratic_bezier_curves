import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

// Extend global type definitions for webkit prefixed AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
  var webkitAudioContext: typeof AudioContext;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.AudioContext for tests
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(),
  createGain: vi.fn(),
  destination: {},
})) as any;

(global as any).webkitAudioContext = global.AudioContext;

// Mock Canvas API
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    fillText: vi.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    lineCap: "",
    lineJoin: "",
    font: "",
    textAlign: "",
  })) as any;
  
  global.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
    setTimeout(cb, 0);
    return 0;
  });
  
  global.cancelAnimationFrame = vi.fn();
});