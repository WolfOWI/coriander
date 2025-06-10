import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import EquipmentListItem from "../../../src/components/equipment/EquipmentListItem";
import { EquipmentCategory, EquipmentCondition } from "../../../src/types/common";
import { Equipment } from "../../../src/interfaces/equipment/equipment";

const mockEquipment: Equipment = {
  equipmentId: 1,
  employeeId: null,
  equipmentCatId: EquipmentCategory.Laptop,
  equipmentCategoryName: "Laptop",
  equipmentName: "MacBook Pro",
  assignedDate: "2024-03-20",
  condition: EquipmentCondition.Good,
};

describe("EquipmentListItem Component Tests", () => {
  const mockHandlers = {
    onEdit: jest.fn(),
    onUnlink: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders basic equipment information", () => {
    render(<EquipmentListItem item={mockEquipment} />);

    expect(screen.getByText(mockEquipment.equipmentName)).toBeInTheDocument();
    expect(screen.getByText(mockEquipment.equipmentCategoryName)).toBeInTheDocument();
    expect(screen.getByText("20 Mar 2024")).toBeInTheDocument();
  });

  test("renders correct icon based on equipment category", () => {
    const categories = [
      { category: EquipmentCategory.Cellphone, testId: "phone-icon" },
      { category: EquipmentCategory.Tablet, testId: "tablet-icon" },
      { category: EquipmentCategory.Laptop, testId: "laptop-icon" },
      { category: EquipmentCategory.Monitor, testId: "monitor-icon" },
      { category: EquipmentCategory.Headset, testId: "headset-icon" },
      { category: EquipmentCategory.Keyboard, testId: "keyboard-icon" },
    ];

    categories.forEach(({ category, testId }) => {
      const equipment = { ...mockEquipment, equipmentCatId: category };
      const { rerender } = render(<EquipmentListItem item={equipment} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      rerender(<></>);
    });

    // Test unknown category
    const unknownEquipment = { ...mockEquipment, equipmentCatId: 999 };
    render(<EquipmentListItem item={unknownEquipment} />);
    expect(screen.getByTestId("unknown-device-icon")).toBeInTheDocument();
  });

  test("shows admin controls when adminView is true", () => {
    render(
      <EquipmentListItem
        item={mockEquipment}
        adminView={true}
        onEdit={mockHandlers.onEdit}
        onUnlink={mockHandlers.onUnlink}
        onDelete={mockHandlers.onDelete}
      />
    );

    const editButton = screen.getByLabelText("edit");
    const unlinkButton = screen.getByLabelText("unlink");
    const deleteButton = screen.getByLabelText("delete");

    expect(editButton).toBeInTheDocument();
    expect(unlinkButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls appropriate handlers when admin buttons are clicked", () => {
    render(
      <EquipmentListItem
        item={mockEquipment}
        adminView={true}
        onEdit={mockHandlers.onEdit}
        onUnlink={mockHandlers.onUnlink}
        onDelete={mockHandlers.onDelete}
      />
    );

    fireEvent.click(screen.getByLabelText("edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("unlink"));
    expect(mockHandlers.onUnlink).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  test("does not show admin controls when adminView is false", () => {
    render(<EquipmentListItem item={mockEquipment} adminView={false} />);

    expect(screen.queryByLabelText("edit")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("unlink")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
  });

  test("returns null when item prop is null", () => {
    const { container } = render(<EquipmentListItem item={null} />);
    expect(container.firstChild).toBeNull();
  });
});
