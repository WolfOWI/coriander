import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EquipCondiBadge from "../../../src/components/badges/EquipCondiBadge";
import { EquipmentCondition } from "../../../src/types/common";

describe("EquipCondiBadge Component Tests", () => {
  test("renders with EquipmentCondition.New", () => {
    render(<EquipCondiBadge condition={EquipmentCondition.New} />);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  test("renders with EquipmentCondition.Good", () => {
    render(<EquipCondiBadge condition={EquipmentCondition.Good} />);

    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  test("renders with EquipmentCondition.Decent", () => {
    render(<EquipCondiBadge condition={EquipmentCondition.Decent} />);

    expect(screen.getByText("Decent")).toBeInTheDocument();
  });

  test("renders with EquipmentCondition.Used", () => {
    render(<EquipCondiBadge condition={EquipmentCondition.Used} />);

    expect(screen.getByText("Used")).toBeInTheDocument();
  });

  test("renders with unknown condition", () => {
    // Cast to bypass TypeScript checking for testing purposes
    render(<EquipCondiBadge condition={999 as EquipmentCondition} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(
      <EquipCondiBadge condition={EquipmentCondition.New} className="custom-class" />
    );

    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("custom-class");
  });

  test("applies default classes", () => {
    const { container } = render(<EquipCondiBadge condition={EquipmentCondition.New} />);

    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("w-fit");
  });

  test("renders all condition types correctly", () => {
    const conditionTests = [
      { condition: EquipmentCondition.New, expectedText: "New" },
      { condition: EquipmentCondition.Good, expectedText: "Good" },
      { condition: EquipmentCondition.Decent, expectedText: "Decent" },
      { condition: EquipmentCondition.Used, expectedText: "Used" },
    ];

    conditionTests.forEach(({ condition, expectedText }) => {
      const { unmount } = render(<EquipCondiBadge condition={condition} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
      unmount();
    });
  });

  test("uses small size for CoriBadge", () => {
    const { container } = render(<EquipCondiBadge condition={EquipmentCondition.New} />);

    // Check that the badge has small size styling
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("py-1", "px-3");
  });
});
