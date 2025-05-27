import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoriBtn from "../../../src/components/buttons/CoriBtn";

describe("CoriBtn Component Tests", () => {
  test("renders with default props", () => {
    render(<CoriBtn>Test Button</CoriBtn>);

    const button = screen.getByRole("button", { name: "Test Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Test Button");
  });

  test("renders with children", () => {
    render(
      <CoriBtn>
        <span>Icon</span>
        Button Text
      </CoriBtn>
    );

    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Button Text")).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<CoriBtn onClick={mockOnClick}>Click Me</CoriBtn>);

    const button = screen.getByRole("button", { name: "Click Me" });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("applies custom className", () => {
    render(<CoriBtn className="custom-class">Button</CoriBtn>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  test("renders as submit type", () => {
    render(<CoriBtn type="submit">Submit</CoriBtn>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  test("renders as disabled", () => {
    render(<CoriBtn disabled>Disabled Button</CoriBtn>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("does not call onClick when disabled", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(
      <CoriBtn onClick={mockOnClick} disabled>
        Disabled
      </CoriBtn>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test("renders with iconOnly prop", () => {
    render(<CoriBtn iconOnly>🔍</CoriBtn>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-10");
  });

  test("renders primary style variants", () => {
    const styles = ["default", "black", "red"] as const;

    styles.forEach((style) => {
      const { container, unmount } = render(<CoriBtn style={style}>Button</CoriBtn>);
      const button = container.querySelector("button");

      if (style === "default") {
        expect(button).toHaveClass("bg-corigreen-500");
      } else if (style === "black") {
        expect(button).toHaveClass("bg-zinc-800");
      } else if (style === "red") {
        expect(button).toHaveClass("bg-red-700");
      }

      unmount();
    });
  });

  test("renders secondary style variants", () => {
    const styles = ["default", "black", "red"] as const;

    styles.forEach((style) => {
      const { container, unmount } = render(
        <CoriBtn secondary style={style}>
          Button
        </CoriBtn>
      );
      const button = container.querySelector("button");

      if (style === "default") {
        expect(button).toHaveClass("border-corigreen-500", "text-corigreen-500");
      } else if (style === "black") {
        expect(button).toHaveClass("border-zinc-800", "text-zinc-800");
      } else if (style === "red") {
        expect(button).toHaveClass("border-red-700", "text-red-700");
      }

      unmount();
    });
  });

  test("applies default classes", () => {
    render(<CoriBtn>Button</CoriBtn>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "text-[14px]",
      "font-semibold",
      "flex",
      "items-center",
      "justify-center",
      "h-10",
      "px-3",
      "gap-2",
      "rounded-xl",
      "cori-btn"
    );
  });

  test("handles click event with event parameter", () => {
    const mockOnClick = jest.fn();

    render(<CoriBtn onClick={mockOnClick}>Button</CoriBtn>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
  });

  test("renders without onClick handler", () => {
    expect(() => render(<CoriBtn>Button</CoriBtn>)).not.toThrow();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("renders with all props combined", () => {
    const mockOnClick = jest.fn();

    render(
      <CoriBtn
        onClick={mockOnClick}
        className="test-class"
        secondary
        style="black"
        type="submit"
        iconOnly
        disabled={false}
      >
        Test Content
      </CoriBtn>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("test-class", "w-10");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).not.toBeDisabled();
  });
});
