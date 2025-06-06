import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CoriBadge from "../../../src/components/badges/CoriBadge";

describe("CoriBadge Component Tests", () => {
  test("renders with correct text", () => {
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
});
