import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { GetProp, TableProps } from "antd";
import { Table, Avatar, Tooltip, Button, Dropdown, Popover, message } from "antd";
import type { SorterResult, FilterValue } from "antd/es/table/interface";
import { equipmentAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

// Import Icons
import { Icons } from "../../constants/icons";

// Import Components
import CoriBtn from "../../components/buttons/CoriBtn";
import EquipCondiBadge from "../../components/badges/EquipCondiBadge";
import EquipmentTypeAvatar from "../../components/avatars/EquipmentTypeAvatar";

// Import Modals
import CreateUnlinkedEquipModal from "../../components/modals/CreateUnlinkedEquipModal";
import EditEquipDetailsModal from "../../components/modals/EditEquipDetailsModal";
import AssignSingleEquipToEmpModal from "../../components/modals/AssignSingleEquipToEmpModal";
import DeleteEquipmentModal from "../../components/modals/DeleteEquipmentModal";
import dayjs from "dayjs";

// Types
type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;

interface EquipmentData {
  equipmentId: number;
  equipmentName: string;
  equipmentCatId: number;
  equipmentCategoryName: string;
  condition: number;
  employeeId: number | null;
  fullName: string | null;
  profilePicture: string | null;
  numberOfItems: number | null;
  assignedDate: string | null;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: "ascend" | "descend" | null;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const AdminEquipmentManagement: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [allData, setAllData] = useState<EquipmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  // Modal States
  const [showCreateUnlinkedEquipModal, setShowCreateUnlinkedEquipModal] = useState(false);
  const [showEditEquipDetailsModal, setShowEditEquipDetailsModal] = useState(false);
  const [showAssignSingleEquipToEmpModal, setShowAssignSingleEquipToEmpModal] = useState(false);
  const [showDeleteEquipmentModal, setShowDeleteEquipmentModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentData | null>(null);

  // Fetch equipment data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await equipmentAPI.getAllEquipItems();
      const processedData = response.data.$values.map((item: any) => ({
        equipmentId: item.equipment.equipmentId,
        equipmentName: item.equipment.equipmentName,
        equipmentCatId: item.equipment.equipmentCatId,
        equipmentCategoryName: item.equipment.equipmentCategoryName,
        condition: item.equipment.condition,
        employeeId: item.equipment.employeeId || null,
        fullName: item.fullName || null,
        profilePicture: item.profilePicture || null,
        numberOfItems: item.numberOfItems || null,
        assignedDate: item.equipment.assignedDate || null,
      }));
      setAllData(processedData);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<EquipmentData> | SorterResult<EquipmentData>[]
    ) => {
      setTableParams({
        pagination,
        filters,
        sortOrder: Array.isArray(sorter) ? sorter[0]?.order : sorter.order,
        sortField: Array.isArray(sorter) ? (sorter[0]?.field as string) : (sorter.field as string),
      });
    },
    []
  );

  const processedData = useMemo(() => {
    const data = [...allData];
    if (tableParams.sortField && tableParams.sortOrder) {
      data.sort((a, b) => {
        const aValue = a[tableParams.sortField as keyof EquipmentData] ?? "";
        const bValue = b[tableParams.sortField as keyof EquipmentData] ?? "";
        if (tableParams.sortOrder === "ascend") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    const { current = 1, pageSize = 10 } = tableParams.pagination || {};
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [allData, tableParams]);

  // Dropdown Actions for each row (Edit, Assign, Delete)
  const handleActionClick = (record: EquipmentData, action: string) => {
    // Set the selected equipment to be used in the modals & respective functions
    setSelectedEquipment(record);
    switch (action) {
      case "edit":
        setShowEditEquipDetailsModal(true);
        break;
      case "assign":
        setShowAssignSingleEquipToEmpModal(true);
        break;
      case "delete":
        setShowDeleteEquipmentModal(true);
        break;
    }
  };

  const columns = useMemo<ColumnsType<EquipmentData>>(
    () => [
      {
        title: "Equipment",
        dataIndex: "equipmentName",
        sorter: true,
        width: "30%",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <EquipmentTypeAvatar deviceType={record.equipmentCatId} />
            <div className="flex flex-col">
              <p className="font-medium">{record.equipmentName}</p>
              <p className="text-sm text-zinc-500 truncate">{record.equipmentCategoryName}</p>
            </div>
          </div>
        ),
      },
      {
        title: "Condition",
        dataIndex: "condition",
        sorter: true,
        render: (_, record) => <EquipCondiBadge condition={record.condition} />,
      },
      {
        title: "Assigned To",
        dataIndex: "fullName",
        sorter: true,
        render: (_, record) => (
          <Dropdown
            menu={{
              items: [
                ...(record.employeeId
                  ? [
                      {
                        key: "view",
                        label: "View Employee",
                        icon: <Icons.Person fontSize="small" />,
                        onClick: () => {
                          navigate(`/admin/individual-employee/${record.employeeId}`);
                        },
                      },
                    ]
                  : []),
                {
                  key: "assign",
                  label: record.employeeId ? "Unlink Employee" : "Assign an Employee",
                  icon: record.employeeId ? (
                    <Icons.PersonOff fontSize="small" />
                  ) : (
                    <Icons.PersonAdd fontSize="small" />
                  ),
                  onClick: () => {
                    if (record.employeeId) {
                      console.log("Unlinking Employee");
                    } else {
                      console.log("Assign an Employee");
                    }
                  },
                },
              ],
            }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <div className="cursor-pointer">
              {record.employeeId ? (
                <div className="flex items-center gap-2">
                  {record.profilePicture ? (
                    <Avatar
                      src={record.profilePicture}
                      className="bg-corigreen-500 h-10 w-10 rounded-full object-cover border-1 border-corigreen-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-corigreen-500 h-10 w-10 rounded-full">
                      <Icons.Person fontSize="medium" className="text-white" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="font-medium">{record.fullName}</p>
                    <p className="text-sm text-zinc-500">{record.numberOfItems} items</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center bg-zinc-200 h-10 w-10 rounded-full">
                    <Icons.Person fontSize="medium" className="text-zinc-300" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-zinc-300">Unassigned</p>
                  </div>
                </div>
              )}
            </div>
          </Dropdown>
        ),
      },
      {
        title: "Assigned Date",
        dataIndex: "assignedDate",
        sorter: true,
        render: (_, record) => (
          <>
            {record.employeeId ? (
              <div className="flex flex-col">
                <p className="text-zinc-900">{dayjs(record.assignedDate).format("DD MMM YYYY")}</p>
                <p className="text-zinc-500 text-[12px]">
                  {dayjs(record.assignedDate).fromNow(true)}
                </p>
              </div>
            ) : (
              <p className="text-zinc-900">-</p>
            )}
          </>
        ),
      },
      {
        render: (_, record) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Edit Item Info",
                  icon: <Icons.Edit />,
                  onClick: () => handleActionClick(record, "edit"),
                },
                {
                  key: "assign",
                  label: "Employee Assignment",
                  icon: <Icons.PersonPin />,
                  onClick: () => handleActionClick(record, "assign"),
                },
                {
                  key: "delete",
                  label: "Delete Item",
                  icon: <Icons.Delete />,
                  danger: true,
                  onClick: () => handleActionClick(record, "delete"),
                },
              ],
            }}
            placement="bottomRight"
            trigger={["click"]}
            dropdownRender={(menu) => (
              <div className="border-2 border-zinc-100 rounded-2xl">{menu}</div>
            )}
          >
            <Button className="p-0 border-none bg-transparent">
              <Icons.MoreVertRounded className="text-zinc-500" />
            </Button>
          </Dropdown>
        ),
      },
    ],
    []
  );

  // Create Unlinked Equipment (Modal)
  const handleCreate = async (data: object) => {
    if (!data) {
      messageApi.error("Something went wrong. No equipment data was detected.");
      return;
    }
    try {
      await equipmentAPI.createEquipItemOrItems([data]); // Create the equipment item (must be in an array - even if just 1)
      messageApi.success("Equipment was created successfully");
      // Refresh the data
      fetchData();
    } catch (error) {
      messageApi.error("Something went wrong and the equipment was not created.");
      console.error("Error creating equipment:", error);
    }

    // Close the modal
    setShowCreateUnlinkedEquipModal(false);
  };

  // Delete Equipment (Modal)
  const handleDeleteSuccess = () => {
    // Refresh the data
    fetchData();
  };

  // Message System (Ant Design)
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <div className="max-w-7xl mx-auto m-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Icons.Construction fontSize="large" className="text-zinc-900" />
            <h1 className="text-3xl font-bold text-zinc-900">Equipment</h1>
          </div>
          <CoriBtn style="black" onClick={() => setShowCreateUnlinkedEquipModal(true)}>
            Create
            <Icons.Add />
          </CoriBtn>
        </div>
        <Table<EquipmentData>
          columns={columns}
          rowKey={(record) => record.equipmentId}
          dataSource={processedData}
          pagination={{
            ...tableParams.pagination,
            total: allData.length,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>

      {/* Modals */}
      <CreateUnlinkedEquipModal
        showModal={showCreateUnlinkedEquipModal}
        setShowModal={setShowCreateUnlinkedEquipModal}
        onCreate={handleCreate}
      />
      <EditEquipDetailsModal
        showModal={showEditEquipDetailsModal}
        setShowModal={setShowEditEquipDetailsModal}
        equipment={selectedEquipment}
      />
      <AssignSingleEquipToEmpModal
        showModal={showAssignSingleEquipToEmpModal}
        setShowModal={setShowAssignSingleEquipToEmpModal}
      />
      <DeleteEquipmentModal
        showModal={showDeleteEquipmentModal}
        setShowModal={setShowDeleteEquipmentModal}
        equipment={selectedEquipment}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default AdminEquipmentManagement;
