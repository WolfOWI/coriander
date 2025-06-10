import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EquipmentTypeAvatar from "../../../src/components/avatars/EquipmentTypeAvatar";
import { EquipmentCategory } from "../../../src/types/common";

interface EquipmentTypeAvatarProps {
  equipmentCategoryId: EquipmentCategory | number;
  colour?: string;
  className?: string;
}

describe("EquipmentTypeAvatar Component Tests", () => {
  test("renders with default styling", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} />);
    const avatar = screen.getByTestId("LaptopRoundedIcon").closest("div");
    expect(avatar).toHaveClass("bg-zinc-100");
    expect(screen.getByTestId("LaptopRoundedIcon")).toHaveClass("text-zinc-900");
  });

  test("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} className={customClass} />
    );
    const avatar = screen.getByTestId("LaptopRoundedIcon").closest("div");
    expect(avatar).toHaveClass(customClass);
  });

  test("applies green color styling", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} colour="green" />);
    const avatar = screen.getByTestId("LaptopRoundedIcon").closest("div");
    expect(avatar).toHaveClass("bg-corigreen-100");
    expect(screen.getByTestId("LaptopRoundedIcon")).toHaveClass("text-corigreen-600");
  });

  test("applies red color styling", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} colour="red" />);
    const avatar = screen.getByTestId("LaptopRoundedIcon").closest("div");
    expect(avatar).toHaveClass("bg-red-100");
    expect(screen.getByTestId("LaptopRoundedIcon")).toHaveClass("text-red-600");
  });

  test("renders correct icons for all equipment categories", () => {
    const categories = [
      { category: EquipmentCategory.Laptop, testId: "LaptopRoundedIcon" },
      { category: EquipmentCategory.Cellphone, testId: "PhoneAndroidRoundedIcon" },
      { category: EquipmentCategory.Monitor, testId: "MonitorRoundedIcon" },
      { category: EquipmentCategory.Keyboard, testId: "KeyboardRoundedIcon" },
      { category: EquipmentCategory.Tablet, testId: "TabletAndroidRoundedIcon" },
      { category: EquipmentCategory.Headset, testId: "HeadsetRoundedIcon" },
    ];

    categories.forEach(({ category, testId }) => {
      const { rerender } = render(<EquipmentTypeAvatar equipmentCategoryId={category} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      rerender(<></>);
    });
  });

  test("renders unknown device icon for invalid category", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={999} />);
    expect(screen.getByTestId("DeviceUnknownRoundedIcon")).toBeInTheDocument();
  });

  test("maintains consistent container dimensions", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} />);
    const container = screen.getByTestId("LaptopRoundedIcon").closest("div");
    expect(container).toHaveClass("h-14 w-14");
  });

  test("maintains flex layout properties", () => {
    render(<EquipmentTypeAvatar equipmentCategoryId={EquipmentCategory.Laptop} />);
    const container = screen.getByTestId("LaptopRoundedIcon").closest("div");
    expect(container).toHaveClass("flex items-center justify-center");
  });
});
