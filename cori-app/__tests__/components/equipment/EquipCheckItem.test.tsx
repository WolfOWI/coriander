import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import EquipCheckItem from "../../../src/components/equipment/EquipCheckItem";
import { EquipmentCategory, EquipmentCondition } from "../../../src/types/common";

describe("EquipCheckItem Component Tests", () => {
  const defaultProps = {
    equipmentId: 1,
    equipmentName: "Test Equipment",
    equipmentCategoryId: EquipmentCategory.Laptop,
    equipmentCategoryName: "Laptop",
    condition: EquipmentCondition.Good,
    isSelected: false,
    onClick: jest.fn(),
  };

  test("renders basic equipment information", () => {
    render(<EquipCheckItem {...defaultProps} />);
    expect(screen.getByText(defaultProps.equipmentName)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.equipmentCategoryName)).toBeInTheDocument();
  });

  test("handles click events", () => {
    render(<EquipCheckItem {...defaultProps} />);
    const item = screen.getByText(defaultProps.equipmentName).closest("div");
    fireEvent.click(item!);
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  test("renders selected state correctly", () => {
    render(<EquipCheckItem {...defaultProps} isSelected={true} />);
    const container = screen
      .getByText(defaultProps.equipmentName)
      .closest('div[class*="flex items-center justify-between"]');
    expect(container).toHaveClass("bg-corigreen-100");
    expect(screen.getByTestId("CheckRoundedIcon")).toBeInTheDocument();
  });

  test("renders unselected state correctly", () => {
    render(<EquipCheckItem {...defaultProps} isSelected={false} />);
    const container = screen
      .getByText(defaultProps.equipmentName)
      .closest('div[class*="flex items-center justify-between"]');
    expect(container).not.toHaveClass("bg-corigreen-100");
    expect(screen.queryByTestId("CheckRoundedIcon")).not.toBeInTheDocument();
  });

  test("applies correct cursor style", () => {
    render(<EquipCheckItem {...defaultProps} />);
    const container = screen
      .getByText(defaultProps.equipmentName)
      .closest('div[class*="flex items-center justify-between"]');
    expect(container).toHaveClass("cursor-pointer");
  });

  test("prevents text selection", () => {
    render(<EquipCheckItem {...defaultProps} />);
    const container = screen
      .getByText(defaultProps.equipmentName)
      .closest('div[class*="flex flex-col"]');
    expect(container).toHaveClass("select-none");
  });

  test("maintains consistent layout structure", () => {
    render(<EquipCheckItem {...defaultProps} />);
    const container = screen
      .getByText(defaultProps.equipmentName)
      .closest('div[class*="flex items-center justify-between"]');
    expect(container).toHaveClass("flex items-center justify-between");
  });
});
