import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EquipmentTypeAvatar from "../../../src/components/avatars/EquipmentTypeAvatar";
import { EquipmentCategory } from "../../../src/types/common";

// Mock the Icons
jest.mock("../../../src/constants/icons", () => ({
  Icons: {
    Phone: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="phone-icon" data-fontsize={fontSize} className={className}>
        📱
      </span>
    ),
    Tablet: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="tablet-icon" data-fontsize={fontSize} className={className}>
        📱
      </span>
    ),
    Laptop: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="laptop-icon" data-fontsize={fontSize} className={className}>
        💻
      </span>
    ),
    Monitor: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="monitor-icon" data-fontsize={fontSize} className={className}>
        🖥️
      </span>
    ),
    Headset: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="headset-icon" data-fontsize={fontSize} className={className}>
        🎧
      </span>
    ),
    Keyboard: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="keyboard-icon" data-fontsize={fontSize} className={className}>
        ⌨️
      </span>
    ),
    DeviceUnknown: ({ fontSize, className }: { fontSize?: string; className?: string }) => (
      <span data-testid="unknown-icon" data-fontsize={fontSize} className={className}>
        ❓
      </span>
    ),
  },
}));

describe("EquipmentTypeAvatar Component Tests", () => {
  test("renders with cellphone category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Cellphone} />);

    expect(screen.getByTestId("phone-icon")).toBeInTheDocument();
    expect(screen.getByTestId("phone-icon")).toHaveAttribute("data-fontsize", "large");
  });

  test("renders with tablet category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Tablet} />);

    expect(screen.getByTestId("tablet-icon")).toBeInTheDocument();
  });

  test("renders with laptop category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} />);

    expect(screen.getByTestId("laptop-icon")).toBeInTheDocument();
  });

  test("renders with monitor category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Monitor} />);

    expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
  });

  test("renders with headset category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Headset} />);

    expect(screen.getByTestId("headset-icon")).toBeInTheDocument();
  });

  test("renders with keyboard category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Keyboard} />);

    expect(screen.getByTestId("keyboard-icon")).toBeInTheDocument();
  });

  test("renders unknown icon for invalid category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={999 as EquipmentCategory} />);

    expect(screen.getByTestId("unknown-icon")).toBeInTheDocument();
  });

  test("applies default styling", () => {
    const { container } = render(
      <EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Cellphone} />
    );

    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass(
      "bg-zinc-100",
      "rounded-full",
      "h-14",
      "w-14",
      "flex",
      "items-center",
      "justify-center"
    );
  });

  test("applies green color styling", () => {
    const { container } = render(
      <EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Cellphone} colour="green" />
    );

    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass("bg-corigreen-100");

    const icon = screen.getByTestId("phone-icon");
    expect(icon).toHaveClass("text-corigreen-600");
  });

  test("applies red color styling", () => {
    const { container } = render(
      <EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Cellphone} colour="red" />
    );

    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass("bg-red-100");

    const icon = screen.getByTestId("phone-icon");
    expect(icon).toHaveClass("text-red-600");
  });

  test("applies default color styling for unknown color", () => {
    const { container } = render(
      <EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Cellphone} colour="blue" />
    );

    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass("bg-zinc-100");

    const icon = screen.getByTestId("phone-icon");
    expect(icon).toHaveClass("text-zinc-900");
  });

  test("applies custom className", () => {
    const { container } = render(
      <EquipmentTypeAvatar
        equipmentCategoryId={EquipmentCategory.Cellphone}
        className="custom-class"
      />
    );

    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass("custom-class");
  });

  test("handles numeric equipment category ID", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={1} />);

    expect(screen.getByTestId("phone-icon")).toBeInTheDocument();
  });

  test("renders all equipment categories correctly", () => {
    const categories = [
      { category: EquipmentCategory.Cellphone, testId: "phone-icon" },
      { category: EquipmentCategory.Tablet, testId: "tablet-icon" },
      { category: EquipmentCategory.Laptop, testId: "laptop-icon" },
      { category: EquipmentCategory.Monitor, testId: "monitor-icon" },
      { category: EquipmentCategory.Headset, testId: "headset-icon" },
      { category: EquipmentCategory.Keyboard, testId: "keyboard-icon" },
    ];

    categories.forEach(({ category, testId }) => {
      const { unmount } = render(<EquipmentTypeAvatar equipmentCategoryId={category} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    });
  });

  test("icon has correct fontSize attribute", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} />);

    const icon = screen.getByTestId("laptop-icon");
    expect(icon).toHaveAttribute("data-fontsize", "large");
  });

  test("combines all props correctly", () => {
    const { container } = render(
      <EquipmentTypeAvatar
        equipmentCategoryId={EquipmentCategory.Monitor}
        colour="green"
        className="test-class"
      />
    );

    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass("bg-corigreen-100", "test-class");

    const icon = screen.getByTestId("monitor-icon");
    expect(icon).toHaveClass("text-corigreen-600");
    expect(icon).toHaveAttribute("data-fontsize", "large");
  });
});
