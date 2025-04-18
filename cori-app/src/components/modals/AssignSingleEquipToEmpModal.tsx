import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Select, DatePicker, message } from "antd";
import type { SelectProps } from "antd";

import { Icons } from "../../constants/icons";
import { empUserAPI, equipmentAPI } from "../../services/api.service";
import { EquipmentCondition } from "../../types/common";
import dayjs from "dayjs";

interface AssignSingleEquipToEmpModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  equipment: {
    equipmentId: number;
    equipmentName: string;
    equipmentCategoryName: string;
    condition: EquipmentCondition;
  } | null;
  onAssignSuccess: () => void; // Callback to refresh the equipment list
}

// Employee option type (for dropdown)
interface EmployeeOption {
  employeeId: number;
  fullName: string;
  profilePicture: string | null;
  numberOfItems: number;
  hasItemOfSameEquipCat: boolean;
}

function AssignSingleEquipToEmpModal({
  showModal,
  setShowModal,
  equipment,
  onAssignSuccess,
}: AssignSingleEquipToEmpModalProps) {
  const [form] = Form.useForm();
  const [dropdownEmployees, setDropdownEmployees] = useState<EmployeeOption[]>([]);

  // Message System
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch employees for the dropdown
  const fetchEmployees = async () => {
    if (equipment) {
      const res = await empUserAPI.getAllEmpUsersAndEquipStats(equipment.equipmentId);
      setDropdownEmployees(res.data.$values);
    }
  };

  // When equipment changes, get all employees for the dropdown
  useEffect(() => {
    if (equipment) {
      fetchEmployees();
    }
  }, [equipment]);

  // Assignment button
  const handleAssign = () => {
    form.validateFields().then(async (values) => {
      console.log("Selected employee ID:", values.empId);
      setShowModal(false);
      try {
        if (equipment && values.empId) {
          console.log("Equipment ID:", equipment.equipmentId);
          console.log("Employee ID:", values.empId);
          await equipmentAPI.assignEquipItemOrItemsToEmp(values.empId, [equipment.equipmentId]);
          messageApi.success("Equipment assigned to employee");
        } else {
          messageApi.error("Failed to assign equipment to employee");
        }
      } catch (error) {
        console.error("Error assigning equipment to employee:", error);
        messageApi.error("Failed to assign equipment to employee");
      }
      onAssignSuccess();
    });
    // Reset the form
    form.resetFields();
  };

  // Format the employee data for the Dropdown component
  const employeeOptions = dropdownEmployees.map((emp) => ({
    value: emp.employeeId,
    label: (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {emp.profilePicture ? (
            <img src={emp.profilePicture} alt={emp.fullName} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
              <Icons.Person className="text-zinc-400" fontSize="small" />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-zinc-900">{emp.fullName}</p>
            <p className="text-zinc-500 text-sm">
              {emp.numberOfItems} {emp.numberOfItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        {emp.hasItemOfSameEquipCat && (
          <div className="flex items-center gap-1">
            <Icons.Error className="text-yellow-500" fontSize="small" />
            <p className="text-zinc-500 text-[12px]">
              Already Owns A {equipment?.equipmentCategoryName}
            </p>
          </div>
        )}
      </div>
    ),
    data: emp,
  }));

  return (
    <>
      {contextHolder}
      <Modal
        title={<h2 className="text-zinc-900 font-bold text-3xl">Assign To Employee</h2>}
        open={showModal}
        onCancel={() => setShowModal(false)}
        width={600}
        styles={{
          header: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 40,
          },
          body: {
            paddingTop: 16,
            padding: 40,
          },
          footer: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 40,
          },
        }}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
            Cancel
          </Button>,
          <Button key="create" type="primary" onClick={handleAssign}>
            Assign To Employee
          </Button>,
        ]}
      >
        {equipment && (
          <div className="flex items-center gap-3 px-4 py-3 bg-warmstone-300 rounded-xl mb-4">
            <div className="bg-warmstone-50 rounded-full p-2">
              <Icons.Phone className="text-zinc-900" fontSize="large" />
            </div>
            <div className="flex flex-col">
              <p className="text-zinc-900">{equipment.equipmentName}</p>
              <div className="flex items-center gap-2">
                <p className="text-zinc-500 text-sm">{equipment.equipmentCategoryName}</p>
                <p className="text-zinc-500 text-sm">•</p>
                <p className="text-zinc-500 text-sm">
                  {equipment.condition === EquipmentCondition.New
                    ? "New"
                    : equipment.condition === EquipmentCondition.Good
                    ? "Good"
                    : equipment.condition === EquipmentCondition.Decent
                    ? "Decent"
                    : "Used"}{" "}
                  Condition
                </p>
              </div>
            </div>
          </div>
        )}
        <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
          <Form.Item name="empId" label="Employee">
            <Select
              placeholder="Select a Employee"
              options={employeeOptions}
              optionFilterProp="label"
              labelRender={(option) => {
                const emp = dropdownEmployees.find((e) => e.employeeId === option.value);
                return <div>{emp?.fullName}</div>;
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AssignSingleEquipToEmpModal;
