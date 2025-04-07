import React, { useEffect, useState } from "react";
import type { GetProp, TableProps } from "antd";
import { Table, Avatar, Dropdown } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import { employeeAPI, pageAPI } from "../../services/api.service";
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
import StarIcon from "@mui/icons-material/StarRounded";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

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
  profilePicture: string | null;
  employType: number;
  salaryAmount: number;
  payCycle: number;
  lastPaidDate: string;
  isSuspended: boolean;
  averageRating?: number;
  numberOfRatings?: number;
  totalRemainingDays?: number;
  totalLeaveDays?: number;
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
      const response = await pageAPI.getAdminEmpManagement();
      const processedData = response.data.$values.map((item: any) => ({
        employeeId: item.empUser.employeeId,
        fullName: item.empUser.fullName,
        gender: item.empUser.gender,
        jobTitle: item.empUser.jobTitle,
        department: item.empUser.department,
        profilePicture: item.empUser.profilePicture,
        employType: item.empUser.employType,
        salaryAmount: item.empUser.salaryAmount,
        payCycle: item.empUser.payCycle,
        lastPaidDate: item.empUser.lastPaidDate,
        isSuspended: item.empUser.isSuspended,
        averageRating: item.empUserRatingMetrics?.averageRating,
        numberOfRatings: item.empUserRatingMetrics?.numberOfRatings,
        totalRemainingDays: item.totalLeaveBalanceSum?.totalRemainingDays,
        totalLeaveDays: item.totalLeaveBalanceSum?.totalLeaveDays,
      }));
      setData(processedData);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: processedData.length,
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "fullName",
      sorter: true,
      width: "24%",
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
    },
    {
      title: "Job",
      dataIndex: "jobTitle",
      sorter: true,
      render: (_, record) => (
        <div className="flex flex-col">
          <p className="">{record.jobTitle}</p>
          <p className="text-sm text-zinc-500">{record.department}</p>
        </div>
      ),
    },
    {
      title: "Ratings",
      dataIndex: "averageRating",
      sorter: true,
      render: (_, record) => (
        <>
          {record.averageRating ? (
            <div className="flex items-center">
              <StarIcon className="text-yellow-500" />
              <p>{record.averageRating}</p>
              <p className="text-zinc-500 text-[12px] ml-2">({record.numberOfRatings})</p>
            </div>
          ) : (
            <p className="text-zinc-500 text-[12px]">No Ratings</p>
          )}
        </>
      ),
    },
    {
      title: "Employment",
      dataIndex: "employType",
      sorter: true,
      render: (_, record) => {
        const handleEmploymentClick = (e: React.MouseEvent) => {
          e.stopPropagation(); // Prevent row click navigation
        };

        return (
          <div onClick={handleEmploymentClick}>
            {record.isSuspended ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "unsuspend",
                      label: "Unsuspend Employee",
                      icon: <ThumbUpAltIcon />,
                      onClick: () => {
                        employeeAPI
                          .toggleEmpSuspension(record.employeeId.toString())
                          .then(() => {
                            fetchData(); // Refresh the table data
                          })
                          .catch((error) => {
                            console.error("Error unsuspending employee:", error);
                          });
                      },
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <div>
                  <EmployTypeBadge status="suspended" />
                </div>
              </Dropdown>
            ) : (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "suspend",
                      label: "Suspend Employee",
                      icon: <ThumbDownAltIcon />,
                      onClick: () => {
                        employeeAPI
                          .toggleEmpSuspension(record.employeeId.toString())
                          .then(() => {
                            fetchData(); // Refresh the table data
                          })
                          .catch((error) => {
                            console.error("Error suspending employee:", error);
                          });
                      },
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <div>
                  <EmployTypeBadge status={record.employType} />
                </div>
              </Dropdown>
            )}
          </div>
        );
      },
    },
    {
      title: "Salary",
      dataIndex: "salaryAmount",
      sorter: true,
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
    {
      title: "Leave",
      dataIndex: "totalRemainingDays",
      sorter: true,
      render: (_, record) => (
        <div className="flex flex-col items-center">
          <p>{record.totalRemainingDays}</p>
          <p className="text-zinc-500 text-[12px]">{record.totalLeaveDays} days</p>
        </div>
      ),
    },
  ];

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
