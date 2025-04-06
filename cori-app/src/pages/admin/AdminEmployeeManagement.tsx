import React, { useEffect, useState } from "react";
import type { GetProp, TableProps } from "antd";
import { Table, Avatar } from "antd";
import type { AnyObject } from "antd/es/_util/type";
import type { SorterResult } from "antd/es/table/interface";
import { empUserAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

// Types
import { Gender, PayCycle } from "../../types/common";

// Import React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import EmployTypeBadge from "../../components/badges/EmployTypeBadge";

// Import Google Icons
import AddIcon from "@mui/icons-material/Add";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

// Utility Functions
import { formatRandAmount } from "../../utils/formatUtils";

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;

interface DataType {
  employeeId: number;
  fullName: string;
  gender: string;
  jobTitle: string;
  department: string;
  // Average rating?
  profilePicture: string | null;
  employType: number;
  salaryAmount: number;
  payCycle: number;
  lastPaidDate: string;
  isSuspended: boolean;
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
    sorter: true, // TODO: add sorting functionality
    render: (value, record) => (
      <div className="flex items-center gap-2">
        {record.profilePicture ? (
          <Avatar
            src={record.profilePicture}
            className="bg-warmstone-600 h-12 w-12 rounded-full object-cover border-2 border-zinc-700"
          />
        ) : (
          <Avatar
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.fullName}`}
            className="bg-warmstone-600 h-12 w-12 rounded-full object-cover border-2 border-zinc-700"
          />
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-medium min-w-fit">{record.fullName}</p>
            {parseInt(record.gender) === Gender.Female ? (
              <FemaleIcon className="text-pink-500" />
            ) : parseInt(record.gender) === Gender.Male ? (
              <MaleIcon className="text-blue-500" />
            ) : (
              <TransgenderIcon className="text-purple-500" />
            )}
          </div>
          <p className="text-sm text-zinc-500">{record.employeeId}</p>
        </div>
      </div>
    ),
    width: "20%",
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
    render: (_, record) =>
      record.isSuspended ? (
        <EmployTypeBadge status="suspended" />
      ) : (
        <EmployTypeBadge status={record.employType} />
      ),
  },
  {
    title: "Salary",
    dataIndex: "salaryAmount",
    sorter: true,
    width: "15%",
    render: (_, record) => (
      <div className="flex flex-col">
        <p>{formatRandAmount(record.salaryAmount)}</p>
        <p className="text-[12px] text-zinc-500">
          {record.payCycle === PayCycle.Monthly
            ? "monthly"
            : record.payCycle === PayCycle.Weekly
            ? "weekly"
            : "bi-weekly"}
        </p>
      </div>
    ),
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
        <CoriBtn style="black" onClick={() => navigate("/admin/create-employee")}>
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
