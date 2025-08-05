import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.querySelector(".App")).toBeInTheDocument();
  });

  it("renders navigation components", () => {
    const { container } = render(<App />);
    
    // Check for HOME link
    const homeLink = screen.getByText("HOME");
    expect(homeLink).toBeInTheDocument();
    
    // Check for GitHub link
    const githubLink = screen.getByText("GitHub");
    expect(githubLink).toBeInTheDocument();
    
    // Check for canvas element
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});