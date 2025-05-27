import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CoriBadge from "../../../src/components/badges/CoriBadge";

describe("CoriBadge Component Tests", () => {
  test("renders with default props", () => {
    render(<CoriBadge text="Test Badge" />);

    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  test("renders with different colors", () => {
    const colors = ["green", "black", "yellow", "red", "blue", "white", "orange", "gray"] as const;

    colors.forEach((color) => {
      const { container } = render(<CoriBadge text={`${color} badge`} color={color} />);
      expect(screen.getByText(`${color} badge`)).toBeInTheDocument();

      // Check if the correct background color class is applied
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass(
        color === "green"
          ? "bg-corigreen-500"
          : color === "black"
          ? "bg-zinc-900"
          : color === "yellow"
          ? "bg-yellow-300"
          : color === "red"
          ? "bg-red-400"
          : color === "blue"
          ? "bg-cyan-600"
          : color === "white"
          ? "bg-warmstone-50"
          : color === "orange"
          ? "bg-amber-600"
          : "bg-zinc-500"
      );
    });
  });

  test("renders with different sizes", () => {
    const sizes = ["x-small", "small", "medium", "large"] as const;

    sizes.forEach((size) => {
      const { container } = render(<CoriBadge text={`${size} badge`} size={size} />);
      expect(screen.getByText(`${size} badge`)).toBeInTheDocument();

      // Check if the correct size classes are applied
      const badge = container.firstChild as HTMLElement;
      const span = badge.querySelector("span");

      if (size === "x-small") {
        expect(badge).toHaveClass("py-1", "px-2");
        expect(span).toHaveClass("text-sm");
      } else if (size === "small") {
        expect(badge).toHaveClass("py-1", "px-3");
        expect(span).toHaveClass("text-sm");
      } else if (size === "medium") {
        expect(badge).toHaveClass("py-2", "px-3");
        expect(span).toHaveClass("text-base");
      } else if (size === "large") {
        expect(badge).toHaveClass("py-2", "px-3");
        expect(span).toHaveClass("text-lg");
      }
    });
  });

  test("applies custom className", () => {
    const { container } = render(<CoriBadge text="Custom Class" className="custom-class" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("custom-class");
  });

  test("applies correct text color for yellow and white backgrounds", () => {
    const { container: yellowContainer } = render(<CoriBadge text="Yellow" color="yellow" />);
    const yellowSpan = yellowContainer.querySelector("span");
    expect(yellowSpan).toHaveClass("text-zinc-900");

    const { container: whiteContainer } = render(<CoriBadge text="White" color="white" />);
    const whiteSpan = whiteContainer.querySelector("span");
    expect(whiteSpan).toHaveClass("text-zinc-900");
  });

  test("applies correct text color for other backgrounds", () => {
    const { container } = render(<CoriBadge text="Green" color="green" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("text-warmstone-50");
  });

  test("applies correct border radius for different sizes", () => {
    const { container: mediumContainer } = render(<CoriBadge text="Medium" size="medium" />);
    const mediumBadge = mediumContainer.firstChild as HTMLElement;
    expect(mediumBadge).toHaveClass("rounded-xl");

    const { container: largeContainer } = render(<CoriBadge text="Large" size="large" />);
    const largeBadge = largeContainer.firstChild as HTMLElement;
    expect(largeBadge).toHaveClass("rounded-xl");

    const { container: smallContainer } = render(<CoriBadge text="Small" size="small" />);
    const smallBadge = smallContainer.firstChild as HTMLElement;
    expect(smallBadge).toHaveClass("rounded-lg");
  });
});
