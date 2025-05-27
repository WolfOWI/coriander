import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoriCircleBtn from "../../../src/components/buttons/CoriCircleBtn";

// Mock icon component for testing
const MockIcon = ({ fontSize }: { fontSize?: "small" | "medium" | "large" }) => (
  <span data-testid="mock-icon" data-fontsize={fontSize}>
    Icon
  </span>
);

describe("CoriCircleBtn Component Tests", () => {
  test("renders with required icon prop", () => {
    render(<CoriCircleBtn icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<CoriCircleBtn onClick={mockOnClick} icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("applies custom className", () => {
    render(<CoriCircleBtn className="custom-class" icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  test("renders as submit type", () => {
    render(<CoriCircleBtn type="submit" icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  test("renders as disabled", () => {
    render(<CoriCircleBtn disabled icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("does not call onClick when disabled", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<CoriCircleBtn onClick={mockOnClick} disabled icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test("applies aria-label", () => {
    render(<CoriCircleBtn aria-label="Close button" icon={<MockIcon />} />);

    const button = screen.getByRole("button", { name: "Close button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Close button");
  });

  test("clones icon with small fontSize", () => {
    render(<CoriCircleBtn icon={<MockIcon />} />);

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toHaveAttribute("data-fontsize", "small");
  });

  test("renders primary style variants", () => {
    const styles = ["default", "black", "red"] as const;

    styles.forEach((style) => {
      const { container, unmount } = render(<CoriCircleBtn style={style} icon={<MockIcon />} />);
      const button = container.querySelector("button");

      if (style === "default") {
        expect(button).toHaveClass("bg-corigreen-500");
      } else if (style === "black") {
        expect(button).toHaveClass("bg-zinc-500");
      } else if (style === "red") {
        expect(button).toHaveClass("bg-red-500");
      }

      unmount();
    });
  });

  test("renders secondary style variants", () => {
    const styles = ["default", "black", "red"] as const;

    styles.forEach((style) => {
      const { container, unmount } = render(
        <CoriCircleBtn secondary style={style} icon={<MockIcon />} />
      );
      const button = container.querySelector("button");

      if (style === "default") {
        expect(button).toHaveClass("bg-transparent", "text-corigreen-500", "border-corigreen-500");
      } else if (style === "black") {
        expect(button).toHaveClass("bg-transparent", "text-zinc-500", "border-zinc-500");
      } else if (style === "red") {
        expect(button).toHaveClass("bg-transparent", "text-red-500", "border-red-500");
      }

      unmount();
    });
  });

  test("applies default classes", () => {
    render(<CoriCircleBtn icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "h-8",
      "w-8",
      "rounded-full",
      "cori-btn"
    );
  });

  test("handles click event", () => {
    const mockOnClick = jest.fn();

    render(<CoriCircleBtn onClick={mockOnClick} icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("renders without onClick handler", () => {
    expect(() => render(<CoriCircleBtn icon={<MockIcon />} />)).not.toThrow();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("handles non-React element icon gracefully", () => {
    // Test with a string instead of React element
    render(<CoriCircleBtn icon={"not-an-element" as any} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("renders with all props combined", () => {
    const mockOnClick = jest.fn();

    render(
      <CoriCircleBtn
        onClick={mockOnClick}
        className="test-class"
        style="black"
        type="submit"
        secondary
        icon={<MockIcon />}
        disabled={false}
        aria-label="Test button"
      />
    );

    const button = screen.getByRole("button", { name: "Test button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("test-class");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-label", "Test button");
    expect(button).not.toBeDisabled();
  });

  test("defaults disabled to false", () => {
    render(<CoriCircleBtn icon={<MockIcon />} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  test("defaults secondary to false", () => {
    const { container } = render(<CoriCircleBtn icon={<MockIcon />} />);

    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-corigreen-500"); // Primary style
  });
});
