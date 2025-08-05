import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Curve } from "./index";

describe("Curve", () => {
  it("renders canvas element", () => {
    const { container } = render(<Curve />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("sets correct canvas dimensions", () => {
    const { container } = render(<Curve />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    
    // Check that canvas has width and height attributes
    expect(canvas?.width).toBeGreaterThan(0);
    expect(canvas?.height).toBeGreaterThan(0);
  });

  it("initializes canvas context", () => {
    render(<Curve />);
    // The getContext is mocked in setup.ts, so we just verify the component renders
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
  });
});