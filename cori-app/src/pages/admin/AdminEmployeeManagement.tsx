import React, { useEffect, useState } from "react";
import type { GetProp, TableProps } from "antd";
import { Table, Avatar } from "antd";
import type { AnyObject } from "antd/es/_util/type";
import type { SorterResult } from "antd/es/table/interface";
import { empUserAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

// Import React Components
import CoriBtn from "../../components/buttons/CoriBtn";

// Import Google Icons
import AddIcon from "@mui/icons-material/Add";

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;

interface DataType {
  employeeId: number;
  fullName: string;
  gender: string;
  jobTitle: string;
  department: string;
  // Average rating?
  employType: number;
  salaryAmount: number;
  payCycle: number;
  lastPaidDate: string;
  // Remaining Leave days?
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}
// DATA EXAMPLE
// {
//   "$id": "8",
//   "userId": 11,
//   "fullName": "Justine McKenzy",
//   "email": "justine@yahoo.com",
//   "profilePicture": null,
//   "role": 1,
//   "employeeId": 7,
//   "gender": 1,
//   "dateOfBirth": "1998-09-21",
//   "phoneNumber": "093 237 4834",
//   "jobTitle": "Assassin",
//   "department": "Security",
//   "salaryAmount": 10000,
//   "payCycle": 0,
//   "lastPaidDate": "2025-04-02",
//   "employType": 1,
//   "employDate": "2025-04-02",
//   "isSuspended": false
// }

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "fullName",
    sorter: true,
    render: (_, record) => (
      <div className="flex items-center gap-2">
        {/* TODO: Random Avatar generator for now */}
        <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.fullName}`} />
        <div className="flex flex-col">
          <p className="font-medium">{record.fullName}</p>
          <p className="text-sm text-zinc-500">{record.employeeId}</p>
        </div>
      </div>
    ),
    width: "20%",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    sorter: true,
    width: "10%",
  },
  {
    title: "Job Title",
    dataIndex: "jobTitle",
    sorter: true,
    width: "15%",
    render: (_, record) => (
      <div className="flex flex-col">
        <p className="">{record.jobTitle}</p>
        <p className="text-sm text-zinc-500">{record.department}</p>
      </div>
    ),
  },
  {
    title: "Employment Type",
    dataIndex: "employType",
    sorter: true,
    width: "15%",
    render: (type) => {
      const types = {
        0: "Full-time",
        1: "Part-time",
        2: "Contract",
        3: "Temporary",
      };
      return types[type as keyof typeof types] || "Unknown";
    },
  },
  {
    title: "Salary",
    dataIndex: "salaryAmount",
    sorter: true,
    width: "15%",
    render: (amount) => `R${amount.toLocaleString()}`,
  },
  {
    title: "Pay Cycle",
    dataIndex: "payCycle",
    sorter: true,
    width: "10%",
    render: (cycle) => {
      const cycles = {
        0: "Monthly",
        1: "Weekly",
        2: "Bi-weekly",
      };
      return cycles[cycle as keyof typeof cycles] || "Unknown";
    },
  },
  {
    title: "Last Paid",
    dataIndex: "lastPaidDate",
    sorter: true,
    width: "15%",
    render: (date) => new Date(date).toLocaleDateString(),
  },
];

const AdminEmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await empUserAPI.getAllEmpUsers();
      setData(response.data.$values);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.data.$values.length,
        },
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-zinc-900">Employee Management</h1>
        <CoriBtn style="black">
          New
          <AddIcon />
        </CoriBtn>
      </div>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.employeeId}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/individual-employee/${record.employeeId}`),
          className: "cursor-pointer hover:bg-zinc-50",
        })}
      />
    </div>
  );
};

export default AdminEmployeeManagement;
