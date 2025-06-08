import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UnlinkedMessage from "../../../src/components/auth/UnlinkedMessage";
import * as authService from "../../../src/services/authService";
import "@testing-library/jest-dom";

jest.mock("../../../src/services/authService", () => ({
  __esModule: true,
  checkIfUserIsLinked: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("../../../src/components/buttons/CoriBtn", () => (props: any) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={props.className}
      data-testid={
        props.children === "Logout" ? "logout-button" : "refresh-button"
      }
    >
      {props.children}
    </button>
  );
});

jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    message: {
      useMessage: () => {
        const open = jest.fn();
        return [open, <div key="msg" data-testid="msg-context" />];
      },
    },
  };
});

describe("UnlinkedMessage", () => {
  const mockCheck = authService.checkIfUserIsLinked as jest.Mock;
  const mockLogout = authService.logout as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the message and both buttons", () => {
    render(<UnlinkedMessage onLogOut={() => {}} />);

    expect(screen.getByText(/almost there!/i)).toBeInTheDocument();
    expect(screen.getByText(/needs to be linked/i)).toBeInTheDocument();
    expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  it("calls checkIfUserIsLinked on Refresh click", async () => {
    mockCheck.mockResolvedValue({ errorCode: 200, message: "Linked" });
    render(<UnlinkedMessage onLogOut={() => {}} />);

    fireEvent.click(screen.getByTestId("refresh-button"));

    await waitFor(() => {
      expect(mockCheck).toHaveBeenCalled();
    });
  });

  it("calls logout on Logout click", () => {
    render(<UnlinkedMessage onLogOut={() => {}} />);

    fireEvent.click(screen.getByTestId("logout-button"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
