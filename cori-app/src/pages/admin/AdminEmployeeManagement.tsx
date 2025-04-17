import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { GetProp, TableProps } from "antd";
import { Table, Avatar, Dropdown, Tooltip } from "antd";
import type { SorterResult, FilterValue } from "antd/es/table/interface";
import { employeeAPI, pageAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

// Types
import { Gender, PayCycle, EmployType } from "../../types/common";

// Import React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import EmployTypeBadge from "../../components/badges/EmployTypeBadge";

// Import Icons
import { Icons } from "../../constants/icons";

// Utility Functions
import { formatRandAmount } from "../../utils/formatUtils";
import { isDateInPast, formatTimestampToDate, calculateNextPayDay } from "../../utils/dateUtils";
import dayjs from "dayjs";

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
  sortField?: string;
  sortOrder?: "ascend" | "descend" | null;
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

  // We store ALL the employee data in this state
  // This is different from before where we only stored the current page's data
  const [allData, setAllData] = useState<DataType[]>([]);

  // Loading state to show when we're busy fetching data
  const [loading, setLoading] = useState(false);

  // Table parameters tracks:
  // - Current page
  // - Items per page
  // - Sorting order
  // - Sorting field
  // - Filters applied
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1, // Start on page 1
      pageSize: 10, // Show 10 items per page
    },
  });

  // This function runs once when the page loads to get ALL the employee data
  // We use useCallback to make sure this function doesn't change unnecessarily
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get ALL the employee data from the server
      const response = await pageAPI.getAdminEmpManagement();

      // Clean up the data to match DataType interface
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

      // Store ALL the data in our state
      setAllData(processedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run fetchData when the component first loads
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function runs when the user:
  // - Changes pages
  // - Changes how many items per page
  // - Sorts the data
  // - Applies filters
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<DataType> | SorterResult<DataType>[]
    ) => {
      // Update our table parameters with the new settings
      setTableParams({
        pagination,
        filters,
        // Handle both single and multiple column sorting
        sortOrder: Array.isArray(sorter) ? sorter[0]?.order : sorter.order,
        sortField: Array.isArray(sorter) ? (sorter[0]?.field as string) : (sorter.field as string),
      });
    },
    []
  );

  // useMemo to only recalculate the displayed data when:
  // - allData changes (new data from server)
  // - tableParams changes (user changed page/sort/filter)
  const processedData = useMemo(() => {
    // Make a copy of all our data to work with
    const data = [...allData];

    // If the user wants to sort the data
    if (tableParams.sortField && tableParams.sortOrder) {
      data.sort((a, b) => {
        // Get the values we want to compare
        // The ?? '' means "use empty string if the value is null or undefined"
        const aValue = a[tableParams.sortField as keyof DataType] ?? "";
        const bValue = b[tableParams.sortField as keyof DataType] ?? "";

        // Sort in ascending or descending order
        if (tableParams.sortOrder === "ascend") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const { current = 1, pageSize = 10 } = tableParams.pagination || {};
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  }, [allData, tableParams]);

  const handleToggleSuspension = useCallback(
    async (employeeId: number) => {
      try {
        await employeeAPI.toggleEmpSuspension(employeeId.toString());
        fetchData();
      } catch (error) {
        console.error("Error toggling employee suspension:", error);
      }
    },
    [fetchData]
  );

  // Memoize the columns configuration
  const columns = useMemo<ColumnsType<DataType>>(
    () => [
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
                  <Icons.Female className="text-pink-500" />
                ) : parseInt(record.gender) === Gender.Male ? (
                  <Icons.Male className="text-blue-500" />
                ) : (
                  <Icons.Transgender className="text-purple-500" />
                )}
              </div>
              <p className="text-sm text-zinc-500">{record.jobTitle}</p>
            </div>
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
                <Icons.StarRounded className="text-yellow-500" />
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
            e.stopPropagation();
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
                        icon: <Icons.ThumbUpAlt />,
                        onClick: () => {
                          handleToggleSuspension(record.employeeId);
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
                        icon: <Icons.ThumbDownAlt />,
                        onClick: () => {
                          handleToggleSuspension(record.employeeId);
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
        render: (date, record) => {
          const isLate = isDateInPast(calculateNextPayDay(record.payCycle, date));
          const nextPayDate = calculateNextPayDay(record.payCycle, date);

          if (isLate) {
            return (
              <Tooltip
                title={
                  <>
                    Payment was due on
                    <br />
                    {nextPayDate}.
                  </>
                }
                placement="top"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="red"
              >
                <div className="flex flex-col">
                  <p>{formatTimestampToDate(date)}</p>
                  <div className="flex items-center gap-1">
                    <Icons.WatchLater className="text-red-500" fontSize="small" />
                    <p className="text-red-500 text-[12px]">
                      {dayjs(nextPayDate).fromNow(true)} late
                    </p>
                  </div>
                </div>
              </Tooltip>
            );
          }

          return (
            <Tooltip
              title={
                <>
                  Next Payment in {dayjs(nextPayDate).fromNow(true)}
                  <br />
                  on {nextPayDate}.
                </>
              }
              placement="topLeft"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <p>{formatTimestampToDate(date)}</p>
                  <Icons.CheckCircle className="text-corigreen-500" fontSize="small" />
                </div>
              </div>
            </Tooltip>
          );
        },
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
          // TODO: Possibly add a tooltip that shows if employee made a leave request
        ),
      },
    ],
    [handleToggleSuspension]
  );

  return (
    <div className="max-w-7xl mx-auto m-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icons.DirectionsWalk fontSize="large" className="text-zinc-900" />
          <h1 className="text-3xl font-bold text-zinc-900">Employees</h1>
        </div>
        <CoriBtn style="black" onClick={() => navigate("/admin/create-employee")}>
          New
          <Icons.Add />
        </CoriBtn>
      </div>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.employeeId}
        dataSource={processedData}
        pagination={{
          ...tableParams.pagination,
          total: allData.length,
        }}
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
