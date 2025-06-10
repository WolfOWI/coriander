import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import UnlinkedMessage from "../../../src/components/auth/UnlinkedMessage";
import { checkIfUserIsLinked, logout } from "../../../src/services/authService";
import "@testing-library/jest-dom";

// Mock the auth service
jest.mock("../../../src/services/authService", () => ({
  checkIfUserIsLinked: jest.fn(),
  logout: jest.fn(),
}));

// Mock antd message
jest.mock("antd", () => ({
  message: {
    useMessage: () => [{ loading: jest.fn(), success: jest.fn(), error: jest.fn() }, null],
  },
}));

describe("UnlinkedMessage", () => {
  const mockOnLogOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders core content", () => {
    const { getByText } = render(<UnlinkedMessage onLogOut={mockOnLogOut} />);
    expect(getByText("Almost")).toBeInTheDocument();
    expect(getByText("there!")).toBeInTheDocument();
    expect(getByText(/Your Coriander account was created successfully/i)).toBeInTheDocument();
  });

  it("handles logout button click", () => {
    const { getByText } = render(<UnlinkedMessage onLogOut={mockOnLogOut} />);
    fireEvent.click(getByText("Logout"));
    expect(logout).toHaveBeenCalled();
  });
});
