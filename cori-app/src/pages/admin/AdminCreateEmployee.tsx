import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Divider,
  message,
  Spin,
  Typography,
} from "antd";
const { Title, Text } = Typography;
import CoriBtn from "../../components/buttons/CoriBtn";
import EquipmentListItem from "../../components/equipment/EquipmentListItem";
import AssignEmpToOneOrManyEquipsModal from "../../components/modals/AssignEmpToOneOrManyEquipsModal";
import { Icons } from "../../constants/icons";
import { EquipmentCondition, EquipmentCategory } from "../../types/common";
import UnlinkedUserDropdown, {
  UnlinkedUser,
} from "../../components/dropdown/UnlinkedUserDropdown";
import { employeeAPI, userAPI } from "../../services/api.service";
import dayjs from "dayjs";

// Authentication
import { getFullCurrentUser } from "../../services/authService";
import { Equipment } from "../../interfaces/equipment/equipment";

const AdminCreateEmployee: React.FC = () => {
  const [form] = Form.useForm();
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [unlinkedUsers, setUnlinkedUsers] = useState<UnlinkedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<UnlinkedUser | null>(null);
  const [showAssignEmpToEquipsModal, setShowAssignEmpToEquipsModal] =
    useState(false);
  const [equipmentIds, setEquipmentIds] = useState<number[]>([]); // placeholder
  const [selectedEquipments, setSelectedEquipments] = useState<Equipment[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "Create Employee";

  const [adminId, setAdminId] = useState<number | null>(null);
  useEffect(() => {
    const fetchUserAndSetId = async () => {
      const user = await getFullCurrentUser();
      if (user?.adminId) {
        setAdminId(user.adminId);
      }
    };
    fetchUserAndSetId();
  }, []);

  // Fetch unlinked users on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await userAPI.getUnlinkedUsers();
        const apiUsers = res.data.$values || [];
        setUnlinkedUsers(
          apiUsers.map((u: any) => ({
            userId: u.userId,
            fullName: u.fullName,
            profilePicture: u.profilePicture,
            signupMethod: u.googleId ? "google" : "email",
          }))
        );
      } catch (err) {
        console.error(err);
        message.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          size="large"
          tip={
            <div className="text-center">
              <Title level={4} className="mb-2">
                Loading Users
              </Title>
              <Text type="secondary">
                Please hold on while we fetch your data…
              </Text>
            </div>
          }
        />
      </div>
    );
  }

  // AdminCreateEmployee.tsx (excerpt)
  const handleCreateEmployee = async (values: any) => {
    if (!selectedUser) return;
    messageApi.open({
      key: messageKey,
      type: "loading",
      content: "loading",
    });

    // build payload exactly as your DTO expects
    const payload = {
      userId: selectedUser.userId,
      gender: values.gender, // number (0=Male,1=Female,2=Other)
      dateOfBirth: dayjs(values.dob).format("YYYY-MM-DD"),
      phoneNumber: values.phone,
      jobTitle: values.jobTitle,
      department: values.department,
      salaryAmount: values.salary,
      payCycle: values.payCycle, // number (0=Monthly,1=BiWeekly,2=Weekly)
      lastPaidDate: undefined, // optional
      employType: values.employmentType, // number (0=FullTime,1=PartTime,2=Contract,3=Intern)
      employDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      isSuspended: false,
      equipmentIds,
    };

    // DEBUG: inspect what we're about to send
    console.log("📤 [DEBUG] Creating employee with payload:", payload);

    messageApi.open({
      key: messageKey,
      type: "loading",
      content: `Creating employee for ${selectedUser.fullName}...`,
    });
    try {
      const res = await employeeAPI.setupUserAsEmployee(payload);
      console.log("✅ [DEBUG] Response from API:", res.status, res.data);
      message.success(res.data.message);
      form.resetFields();
      setSelectedUser(null);
      messageApi.open({
        key: messageKey,
        type: "success",
        content: `Created employee: ${selectedUser.fullName}`,
      });
    } catch (err: any) {
      console.error("❌ [DEBUG] Failed to create employee:", err);
      message.error(err.response?.data?.message || "Failed to create employee");
      messageApi.open({
        key: messageKey,
        type: "error",
        content: `${
          err.response?.data?.message || "Failed to create employee"
        }`,
      });
    }
  };

  if (loadingUsers) {
    return <Spin tip="Loading users…" className="pt-8" />;
  }

  return (
    <div className="max-w-7xl mx-auto m-4 p-3">
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icons.DirectionsWalk fontSize="large" />
          <h1 className="text-3xl font-bold">Create Employee</h1>
        </div>
        {selectedUser && (
          <CoriBtn style="black" type="submit" onClick={() => form.submit()}>
            Create Employee
          </CoriBtn>
        )}
      </div>

      {/* User Dropdown */}
      <UnlinkedUserDropdown
        users={unlinkedUsers}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      {/* Empty state */}
      {!selectedUser && (
        <div className="pt-32 text-center text-gray-500">
          <Icons.PersonAdd
            className="text-corigreen-500"
            style={{ fontSize: 64 }}
          />
          <h2 className="text-xl font-semibold mt-2">No User Selected</h2>
          <p className="mt-2">Please select a user above to begin.</p>
        </div>
      )}

      {/* Combined Form */}
      {selectedUser && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateEmployee}
          className="space-y-8"
        >
          <Form.Item name="userId" initialValue={selectedUser.userId} hidden>
            <Input />
          </Form.Item>

          {/* Personal Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-zinc-500 font-semibold text-center mb-2 text-lg">
                  Personal
                </div>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: "Male", value: 0 },
                    { label: "Female", value: 1 },
                    { label: "Other", value: 2 },
                  ]}
                  className="drop-shadow-md"
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true }]}
              >
                <Input className="drop-shadow-md" />
              </Form.Item>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full h-12 drop-shadow-md" />
              </Form.Item>
            </div>
            <div>
              {/* Employment */}
              <div>
                <div className="text-zinc-500 font-semibold text-center mb-2 text-lg">
                  Employment
                </div>
                <Form.Item
                  name="jobTitle"
                  label="Job Title"
                  rules={[{ required: true }]}
                >
                  <Input className="drop-shadow-md" />
                </Form.Item>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Input className="drop-shadow-md" />
                </Form.Item>
                <Form.Item
                  name="employmentType"
                  label="Employment Type"
                  rules={[{ required: true }]}
                >
                  <Select
                  className="drop-shadow-md"
                    options={[
                      { label: "Full Time", value: 0 },
                      { label: "Part Time", value: 1 },
                      { label: "Contract", value: 2 },
                      { label: "Intern", value: 3 },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="startDate"
                  label="Date of Employment"
                  rules={[{ required: true }]}
                >
                  <DatePicker className='w-full h-12 drop-shadow-md' />
                </Form.Item>
              </div>

              {/* Payroll */}
              <div className="pt-2">
                <div className="text-zinc-500 font-semibold text-center mb-2 text-lg">
                  Payroll
                </div>
                <Form.Item
                  name="salary"
                  label="Salary Amount"
                  rules={[{ required: true }]}
                >
                  <InputNumber prefix="R" className="w-full h-12 rounded-lg drop-shadow-md" />
                </Form.Item>
                <Form.Item
                  name="payCycle"
                  label="Pay Cycle"
                  rules={[{ required: true }]}
                >
                  <Select
                  className="drop-shadow-md"
                    options={[
                      { label: "Monthly", value: 0 },
                      { label: "Bi-weekly", value: 1 },
                      { label: "Weekly", value: 2 },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>
            {/* Equipment Section */}
            <div className="flex flex-col items-center ">
              <div className="text-zinc-500 font-semibold text-center mb-2 text-lg">
                Equipment
              </div>
              {/* If selected equipment ids (equipmentIds) is empty it must show, please add equpment */}
              {/* You have to select the equipment items from the equipments modal */}
              <div className="space-y-4 w-full mt-2">
                {equipmentIds.length === 0 ? (
                  <div className="flex gap-2 items-center justify-center">
                    <Icons.Warning
                      className="text-yellow-500"
                      style={{ fontSize: 28 }}
                    />
                    <div>
                      <Text strong className="text-yellow-800 block">
                        No equipment selected
                      </Text>
                      <Text type="secondary">
                        The employee will be registered without any equipment.
                        Click "Add Equipment" to assign.
                      </Text>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg drop-shadow-md p-4 border border-zinc-500">
                    {selectedEquipments.map((equip) => (
                      <EquipmentListItem
                        key={equip.equipmentId}
                        item={equip}
                        adminView
                        onDelete={() => {}}
                        onEdit={() => {}}
                        onUnlink={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <CoriBtn
                  style="default"
                  type="button"
                  onClick={() => setShowAssignEmpToEquipsModal(true)}
                >
                  Add Equipment
                </CoriBtn>
              </div>
            </div>
          </div>
        </Form>
      )}

      {/* Assign Equipment Modal */}
      <AssignEmpToOneOrManyEquipsModal
        showModal={showAssignEmpToEquipsModal}
        setShowModal={setShowAssignEmpToEquipsModal}
        onSelectConfirm={(equipments) => {
          console.log("✅ Selected Equipments:", equipments);
          setSelectedEquipments(equipments);
          setEquipmentIds(equipments.map((e) => e.equipmentId));
        }}
      />
    </div>
  );
};

export default AdminCreateEmployee;

// <CoriBtn
//   style="black"
//   onClick={() => setShowAssignEmpToEquipsModal(true)}
// >
//   Assign 1 or Multiple Equipments
// </CoriBtn>
// {/* Assign Multiple Existing Equipments Modal */}
// {/* TODO: Will probably create a copy of this modal, since this modal assigns immediately on press of Assign Button. */}
// <AssignEmpToOneOrManyEquipsModal
//   showModal={showAssignEmpToEquipsModal}
//   setShowModal={setShowAssignEmpToEquipsModal}
//   employeeId={8}
//   onAssignSuccess={() => {
//     console.log(
//       "Callback function that will be called when the employee is assigned to the equipment"
//     );
//   }}
// />
