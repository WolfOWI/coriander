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
});
