import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminCreateEmployee from "../../../src/pages/admin/AdminCreateEmployee";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import dayjs from "dayjs";

//==============================================================================
// MOCKS
//==============================================================================

// Mock API services
jest.mock("../../../src/services/api.service", () => ({
  userAPI: {
    getUnlinkedUsers: jest.fn(),
  },
  employeeAPI: {
    setupUserAsEmployee: jest.fn(),
  },
}));
import { userAPI, employeeAPI } from "../../../src/services/api.service";
const mockedGetUnlinkedUsers = userAPI.getUnlinkedUsers as jest.Mock;
const mockedSetupUserAsEmployee = employeeAPI.setupUserAsEmployee as jest.Mock;

// Mock authService
jest.mock("../../../src/services/authService", () => ({
  getFullCurrentUser: jest.fn(),
}));
import { getFullCurrentUser } from "../../../src/services/authService";
const mockedGetFullCurrentUser = getFullCurrentUser as jest.Mock;

// Mock Ant Design components and hooks
const mockMessageOpen = jest.fn();
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  const useMessage = () => [mockMessageOpen, <div key="message-context" />];
  return {
    ...antd,
    message: {
      useMessage,
      success: jest.fn(),
      error: jest.fn(),
    },
    Spin: ({ tip }: { tip: React.ReactNode }) => (
      <div role="progressbar">{tip}</div>
    ),
    // Provide a simplified Form that just renders its children for testing
    Form: Object.assign(
      ({ children, onFinish, form }: any) => {
        // Let's call onFinish when the form is "submitted" via a button click in tests
        form.submit = () => onFinish(form.getFieldsValue());
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onFinish(form.getFieldsValue());
            }}
          >
            {children}
          </form>
        );
      },
      {
        useForm: () => [
          React.useMemo(
            () => ({
              submit: jest.fn(),
              resetFields: jest.fn(),
              getFieldsValue: jest.fn().mockReturnValue({
                gender: 0,
                phone: "1234567890",
                dob: dayjs(),
                jobTitle: "Developer",
                department: "Tech",
                employmentType: 0,
                startDate: dayjs(),
                salary: 50000,
                payCycle: 0,
              }),
              setFieldsValue: jest.fn(),
            }),
            []
          ),
        ],
        Item: ({ children }: any) => <div>{children}</div>,
      }
    ),
  };
});

// Mock Child Components
// Mock the dropdown to allow us to simulate user selection easily
jest.mock("../../../src/components/dropdown/UnlinkedUserDropdown", () => ({
  __esModule: true,
  default: ({ onSelectUser }: { onSelectUser: (user: any) => void }) => (
    <div data-testid="unlinked-user-dropdown">
      <button
        onClick={() => onSelectUser({ userId: "user-1", fullName: "John Doe" })}
      >
        Select John Doe
      </button>
    </div>
  ),
}));

// Mock the equipment modal
jest.mock(
  "../../../src/components/modals/AssignEmpToOneOrManyEquipsModal",
  () => ({
    __esModule: true,
    // Provide a more specific type for the 'onSelectConfirm' prop to guide the compiler.
    default: ({
      showModal,
      onSelectConfirm,
    }: {
      showModal: boolean;
      onSelectConfirm: (
        equips: Array<{ equipmentId: number; name: string }>
      ) => void;
    }) => {
      if (!showModal) return null;
      return (
        <div data-testid="assign-equip-modal">
          <button
            onClick={() =>
              onSelectConfirm([{ equipmentId: 101, name: "Laptop" }])
            }
          >
            Confirm Selection
          </button>
        </div>
      );
    },
  })
);

// Mock the equipment list item
jest.mock("../../../src/components/equipment/EquipmentListItem", () => ({
  __esModule: true,
  default: ({ item, onDelete }: { item: any; onDelete: () => void }) => (
    <div data-testid="equipment-list-item">
      <span>{item.name}</span>
      <button onClick={onDelete}>Remove</button>
    </div>
  ),
}));

//==============================================================================
// TEST SETUP
//==============================================================================

const mockUnlinkedUsers = [
  {
    userId: "user-1",
    fullName: "John Doe",
    profilePicture: "",
    signupMethod: "email",
  },
  {
    userId: "user-2",
    fullName: "Jane Smith",
    profilePicture: "",
    signupMethod: "google",
  },
];

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AdminCreateEmployee />
    </BrowserRouter>
  );
};

//==============================================================================
// TESTS
//==============================================================================

describe("AdminCreateEmployee Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetFullCurrentUser.mockResolvedValue({ adminId: 1 });
    mockedGetUnlinkedUsers.mockResolvedValue({
      data: { $values: mockUnlinkedUsers },
    });
    mockedSetupUserAsEmployee.mockResolvedValue({
      data: { message: "Success" },
    });
  });

  test("should show loading spinner initially, then the empty state", async () => {
    renderComponent();
    // Initially shows loading
    expect(screen.getByRole("progressbar")).toHaveTextContent("Loading Users");

    // After loading, shows the empty state because no user is selected
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
    expect(screen.getByText("No User Selected")).toBeInTheDocument();
  });

  test("should display the main form after a user is selected", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );

    // Initially, form is not visible
    expect(screen.queryByLabelText(/gender/i)).not.toBeInTheDocument();

    // Select a user
    const selectUserButton = screen.getByText("Select John Doe");
    await userEvent.click(selectUserButton);

    // Now, the form should be visible
    await waitFor(() => {
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    });
  });

  test("should open equipment modal and display selected equipment", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
    await userEvent.click(screen.getByText("Select John Doe"));

    // Check for initial equipment warning
    expect(screen.getByText("No equipment selected")).toBeInTheDocument();

    // Click "Add Equipment" button to open the modal
    const addEquipmentButton = screen.getByRole("button", {
      name: /add equipment/i,
    });
    await userEvent.click(addEquipmentButton);

    // The mock modal should be visible
    await waitFor(() => {
      expect(screen.getByTestId("assign-equip-modal")).toBeInTheDocument();
    });

    // Simulate selecting equipment from the modal
    const confirmButton = screen.getByRole("button", {
      name: /confirm selection/i,
    });
    await userEvent.click(confirmButton);

    // The modal should close and the selected equipment should be displayed
    await waitFor(() => {
      expect(
        screen.queryByTestId("assign-equip-modal")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("equipment-list-item")).toHaveTextContent(
        "Laptop"
      );
    });

    // Test removing the equipment
    const removeButton = screen.getByRole("button", { name: /remove/i });
    await userEvent.click(removeButton);
    expect(screen.queryByTestId("equipment-list-item")).not.toBeInTheDocument();
    expect(screen.getByText("No equipment selected")).toBeInTheDocument();
  });

  test("should successfully create an employee on form submission", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );

    // 1. Select a user
    await user.click(screen.getByText("Select John Doe"));

    // 2. The form is now visible. We can find the create button
    const createButton = await screen.findByRole("button", {
      name: /create employee/i,
    });

    // 3. Submit the form
    // The antd form mock will call onFinish with mocked values
    await user.click(createButton);

    // 4. Verify API call
    await waitFor(() => {
      expect(mockedSetupUserAsEmployee).toHaveBeenCalledTimes(1);
      // Check if the payload is structured correctly
      expect(mockedSetupUserAsEmployee).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          jobTitle: "Developer",
          salaryAmount: 50000,
        })
      );
    });

    // 5. Verify success message
    expect(require("antd").message.success).toHaveBeenCalledWith("Success");
  });

  test("should show an error message if employee creation fails", async () => {
    const user = userEvent.setup();
    // Mock the API to return an error
    const errorMessage = "API Error: User already exists";
    mockedSetupUserAsEmployee.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    renderComponent();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );

    // Select a user and submit the form
    await user.click(screen.getByText("Select John Doe"));
    const createButton = await screen.findByRole("button", {
      name: /create employee/i,
    });
    await user.click(createButton);

    // Verify error message is shown
    await waitFor(() => {
      expect(require("antd").message.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
