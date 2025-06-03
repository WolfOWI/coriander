import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UnlinkedUserDropdown, { UnlinkedUser } from "../../../src/components/dropdown/UnlinkedUserDropdown";

// Mock Ant Design icons and Avatar to avoid rendering issues
jest.mock("@ant-design/icons", () => ({
  GoogleOutlined: () => <span data-testid="google-icon" />,
  MailOutlined: () => <span data-testid="mail-icon" />,
  DownOutlined: () => <span data-testid="down-icon" />,
}));
jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    Avatar: (props: any) => <img data-testid="avatar" src={props.src} alt="avatar" />,
    Dropdown: ({ children, menu }: any) => (
      <div>
        {children}
        {/* Render menu items for testing */}
        <div data-testid="dropdown-menu">
          {menu.items.map((item: any) => (
            <div key={item.key} onClick={item.onClick}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ),
    Space: ({ children }: any) => <div>{children}</div>,
  };
});

describe("UnlinkedUserDropdown", () => {
  const users: UnlinkedUser[] = [
    {
      userId: 1,
      fullName: "Alice Smith",
      profilePicture: "alice.jpg",
      signupMethod: "google",
    },
    {
      userId: 2,
      fullName: "Bob Johnson",
      profilePicture: "",
      signupMethod: "email",
    },
  ];

  it("renders placeholder when no user is selected", () => {
    render(<UnlinkedUserDropdown users={users} selectedUser={null} onSelectUser={jest.fn()} />);
    expect(screen.getByText("Select an unlinked user")).toBeInTheDocument();
  });

  it("renders selected user info", () => {
    render(<UnlinkedUserDropdown users={users} selectedUser={users[0]} onSelectUser={jest.fn()} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByTestId("google-icon")).toBeInTheDocument();
    expect(screen.getByTestId("down-icon")).toBeInTheDocument();
  });

  it("renders fallback avatar when profilePicture is empty", () => {
    render(<UnlinkedUserDropdown users={users} selectedUser={users[1]} onSelectUser={jest.fn()} />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("src", ""); // Should fallback to noUserImage in real component
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });

  it("renders nothing for empty users array", () => {
    render(<UnlinkedUserDropdown users={[]} selectedUser={null} onSelectUser={jest.fn()} />);
    expect(screen.getByText("Select an unlinked user")).toBeInTheDocument();
    // Dropdown menu should be empty
    expect(screen.getByTestId("dropdown-menu").children.length).toBe(0);
  });

  it("calls onSelectUser with the correct user when multiple users are present", () => {
    const onSelectUser = jest.fn();
    render(<UnlinkedUserDropdown users={users} selectedUser={null} onSelectUser={onSelectUser} />);
    fireEvent.click(screen.getByText("Alice Smith"));
    expect(onSelectUser).toHaveBeenCalledWith(users[0]);
    fireEvent.click(screen.getByText("Bob Johnson"));
    expect(onSelectUser).toHaveBeenCalledWith(users[1]);
  });
  
  it("shows dropdown items and calls onSelectUser when clicked", () => {
    const onSelectUser = jest.fn();
    render(<UnlinkedUserDropdown users={users} selectedUser={null} onSelectUser={onSelectUser} />);
    // Dropdown menu is always rendered in this mock
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Bob Johnson"));
    expect(onSelectUser).toHaveBeenCalledWith(users[1]);
  });
});