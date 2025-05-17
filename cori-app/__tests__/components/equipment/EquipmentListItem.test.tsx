import React from "react";
import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EquipmentListItem from "../../../src/components/equipment/EquipmentListItem";
import { EquipmentCategory, EquipmentCondition } from "../../../src/types/common";

const mockEquipment = {
  equipmentId: 1,
  employeeId: null,
  equipmentCatId: EquipmentCategory.Laptop,
  equipmentCategoryName: "Laptop",
  equipmentName: "MacBook Pro",
  assignedDate: "2024-03-20",
  condition: EquipmentCondition.Good,
};

describe("Component Tests for EquipmentListItem", () => {
  test("EquipmentListItem should render correctly with basic props", () => {
    render(<EquipmentListItem item={mockEquipment} />);

    // Check if basic information is displayed
    expect(screen.getByText(mockEquipment.equipmentName)).toBeInTheDocument();
    expect(screen.getByText(mockEquipment.equipmentCategoryName)).toBeInTheDocument();
    expect(screen.getByText("20 Mar 2024")).toBeInTheDocument();
  });

  test("EquipmentListItem should render admin buttons when adminView is true", async () => {
    const mockOnEdit = jest.fn();
    const mockOnUnlink = jest.fn();
    const mockOnDelete = jest.fn();
    const user = userEvent.setup();

    render(
      <EquipmentListItem
        item={mockEquipment}
        adminView={true}
        onEdit={mockOnEdit}
        onUnlink={mockOnUnlink}
        onDelete={mockOnDelete}
      />
    );

    // The buttons should be in the document but initially hidden
    const editButton = screen.getByRole("button", { name: /edit/i });
    const unlinkButton = screen.getByRole("button", { name: /unlink/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(editButton).toBeInTheDocument();
    expect(unlinkButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Click the buttons and verify callbacks
    await user.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);

    await user.click(unlinkButton);
    expect(mockOnUnlink).toHaveBeenCalledTimes(1);

    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  test("EquipmentListItem should not render admin buttons when adminView is false", () => {
    render(<EquipmentListItem item={mockEquipment} adminView={false} />);

    // Admin buttons should not be present
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /unlink/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  test("EquipmentListItem should render correct icon based on equipment category", () => {
    const categories = [
      { category: EquipmentCategory.Cellphone, testId: "phone-icon" },
      { category: EquipmentCategory.Tablet, testId: "tablet-icon" },
      { category: EquipmentCategory.Laptop, testId: "laptop-icon" },
      { category: EquipmentCategory.Monitor, testId: "monitor-icon" },
      { category: EquipmentCategory.Headset, testId: "headset-icon" },
      { category: EquipmentCategory.Keyboard, testId: "keyboard-icon" },
    ];

    categories.forEach(({ category, testId }) => {
      const equipment = {
        ...mockEquipment,
        equipmentCatId: category,
      };

      render(<EquipmentListItem item={equipment} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      cleanup();
    });
  });

  test("EquipmentListItem should render unknown device icon for invalid category", () => {
    const equipment = {
      ...mockEquipment,
      equipmentCatId: 999, // Invalid category
    };

    render(<EquipmentListItem item={equipment} />);
    expect(screen.getByTestId("unknown-device-icon")).toBeInTheDocument();
  });
});
