// Wolf Botha
import React, { useEffect, useState } from "react";
import { empUserAPI, pageAPI, employeeAPI } from "../../services/api.service";
import { useNavigate, useParams } from "react-router-dom";

// Import 3rd party components
import GaugeComponent from "react-gauge-component";
import { Avatar, DatePicker, Dropdown, Tooltip, message, Button } from "antd";
import dayjs from "dayjs"; // For simple date formatting
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with plugins
dayjs.extend(relativeTime);

// Import React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import CoriBadge from "../../components/badges/CoriBadge";
import EquipmentListItem from "../../components/equipment/EquipmentListItem";
import LeaveBalanceBlock from "../../components/leave/LeaveBalanceBlock";
import PerfReviewBox from "../../components/performanceReview/PerfReviewBox";
import EmployTypeBadge from "../../components/badges/EmployTypeBadge";
import TimeTodayBadge from "../../components/badges/TimeTodayBadge";

// Modals
import AdminEditEmpDetailsModal from "../../components/modals/AdminEditEmpDetailsModal";
import CreateAssignedEquipModal from "../../components/modals/CreateAssignedEquipModal";
import AssignEmpToEquipsModal from "../../components/modals/AssignEmpToEquipsModal";
import ManageAssignedItemModal from "../../components/modals/ManageAssignedItemModal";

// Import Icons
import { Icons } from "../../constants/icons";

// Import Assets
import GoogleIcon from "../../assets/icons/googleIcon.png";

// Import Utils
import {
  calculateNextPayDay,
  formatEmploymentDuration,
  calculatePreviousPayDay,
} from "../../utils/dateUtils";
import TerminateEmployeeModal from "../../components/modals/TerminateEmployeeModal";
import { formatPhone, formatRandAmount } from "../../utils/formatUtils";

// Types
import { EmployType, EquipmentCondition, Gender, PayCycle, ReviewStatus } from "../../types/common";

// Equipment Interface
interface Equipment {
  equipmentId: number;
  employeeId: number;
  equipmentCatId: number;
  equipmentCategoryName: string;
  equipmentName: string;
  assignedDate: string;
  condition: EquipmentCondition;
}

// Leave Balance Interface
interface LeaveBalance {
  leaveBalanceId: number;
  remainingDays: number;
  leaveTypeName: string;
  description: string;
  defaultDays: number;
}

// Performance Review Interface
interface PerformanceReview {
  reviewId: number;
  adminId: number;
  adminName: string;
  employeeId: number;
  employeeName: string;
  isOnline: boolean;
  meetLocation: string | null;
  meetLink: string;
  startDate: string;
  endDate: string;
  rating: number;
  comment: string;
  docUrl: string;
  status: ReviewStatus;
}

// Employee Rating Metrics Interface
interface EmpUserRatingMetrics {
  employeeId: number;
  fullName: string;
  averageRating: number;
  numberOfRatings: number;
  mostRecentRating: number;
}

// Admin Employee Details Page Response Interface
interface AdminEmpDetailsResponse {
  empUser: EmpUser;
  equipment: {
    $values: Equipment[];
  };
  leaveBalances: {
    $values: LeaveBalance[];
  };
  empUserRatingMetrics: EmpUserRatingMetrics;
  performanceReviews: {
    $values: PerformanceReview[];
  };
}

// EmpUser Data Interface
interface EmpUser {
  userId: number;
  fullName: string;
  email: string;
  googleId: string | null;
  profilePicture: string;
  role: number;
  employeeId: number;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  salaryAmount: number;
  payCycle: PayCycle;
  lastPaidDate: string;
  employType: EmployType;
  employDate: string;
  isSuspended: boolean;
}

const AdminIndividualEmployee: React.FC = () => {
  // States
  const [empUser, setEmpUser] = useState<EmpUser | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [empUserRatingMetrics, setEmpUserRatingMetrics] = useState<EmpUserRatingMetrics | null>(
    null
  );
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPayDay, setNextPayDay] = useState<string | null>(null);
  const { employeeId } = useParams();

  // Modal States
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [showCreateAssignedEquipModal, setShowCreateAssignedEquipModal] = useState(false);
  const [showAssignExistingEquipModal, setShowAssignExistingEquipModal] = useState(false);
  const [showManageEquipmentModal, setShowManageEquipmentModal] = useState(false);
  const [showTerminateEmployeeModal, setShowTerminateEmployeeModal] = useState(false);

  // Message System
  const [messageApi, ContextHolder] = message.useMessage();

  // Navigation
  const navigate = useNavigate();

  const fetchEmployee = async () => {
    try {
      if (employeeId) {
        // Fetch the specific employee by ID using the new API endpoint
        const response = await pageAPI.getAdminEmpDetails(employeeId);
        const data: AdminEmpDetailsResponse = response.data;

        setEmpUser(data.empUser);
        setEquipment(data.equipment.$values);
        // TODO Set leave balances in a specific order
        setLeaveBalances(data.leaveBalances.$values);
        setEmpUserRatingMetrics(data.empUserRatingMetrics);
        setPerformanceReviews(data.performanceReviews.$values);
      } else {
        // If no ID provided, redirect to employee management page
        navigate("/admin/employees");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      // Handle error case
      return <div>Something went wrong</div>;
    } finally {
      setLoading(false);
    }
  };

  // On page load (fetch employee data)
  useEffect(() => {
    fetchEmployee();
  }, [employeeId, navigate]);

  // Calculate the next pay day & store it in state
  useEffect(() => {
    if (empUser) {
      setNextPayDay(calculateNextPayDay(empUser.payCycle, empUser.lastPaidDate));
    }
  }, [empUser]);

  // Toggle suspension status of an employee
  const toggleEmpSuspension = async () => {
    try {
      if (employeeId) {
        console.log("Toggling suspension status of employee:", employeeId);
        await employeeAPI.toggleEmpSuspension(employeeId);
        fetchEmployee(); // Refresh the employee data
        messageApi.success("Employee suspension status updated");
      }
    } catch (error) {
      console.error("Error toggling employee suspension:", error);
      messageApi.error("Error updating employee suspension status");
    }
  };

  // Update last paid date
  const updateLastPaidDate = async (newDate: string) => {
    try {
      // There must be an employee ID
      if (employeeId) {
        await empUserAPI.updateEmpUserById(employeeId, {
          lastPaidDate: newDate,
        });
        fetchEmployee(); // Refresh the employee data
        messageApi.success("Last paid date updated");
      } else {
        // If no ID provided, redirect to employee management page
        messageApi.error("Something went wrong - Employee ID not found");
      }
    } catch (error) {
      messageApi.error("Error updating last paid date");
    }
  };

  // Undo payment (shift last paid by -1 pay cycle)
  const onUndoPayment = async () => {
    // Check if empUser is defined
    if (empUser) {
      // Calculate the previous pay day
      const calcPrevPayday = calculatePreviousPayDay(empUser?.payCycle, empUser?.lastPaidDate);
      // Format the previous pay day
      const previousPayDay = dayjs(calcPrevPayday).format("YYYY-MM-DD");

      // Check if the previous pay day is before the employee's employment date
      if (dayjs(previousPayDay).isBefore(dayjs(empUser.employDate))) {
        messageApi.error({
          content: `You can't set the last paid date to before ${empUser.fullName} was employed.`,
          duration: 8,
        });
        return;
      }

      // Update the last paid date
      try {
        // There must be an employee ID
        if (employeeId) {
          await empUserAPI.updateEmpUserById(employeeId, { lastPaidDate: previousPayDay });
          fetchEmployee(); // Refresh the employee data
          messageApi.success("Payment undone");
        } else {
          messageApi.error("Something went wrong - Employee ID not found");
        }
      } catch (error) {
        messageApi.error("Error undoing payment");
      }
    }
  };

  // Pay employee (set last paid as today)
  const onPayNow = async () => {
    // // Check if the next pay day is in the future
    // if (dayjs(formattedNextPayDay).isAfter(dayjs())) {
    //   messageApi.error({
    //     content: "You can't set the last paid date to a date in the future",
    //     duration: 8,
    //   });
    //   return;
    // }

    // Update the last paid date
    try {
      // There must be an employee ID
      if (employeeId) {
        // Set the last paid date to the next payday
        await empUserAPI.updateEmpUserById(employeeId, {
          lastPaidDate: dayjs().format("YYYY-MM-DD"),
        });
        fetchEmployee(); // Refresh the employee data
        messageApi.success("Payment updated");
      } else {
        messageApi.error("Something went wrong - Employee ID not found");
      }
    } catch (error) {
      messageApi.error("Error updating payment");
    }
  };

  // Terminate employee
  const onTerminate = async () => {
    try {
      if (employeeId) {
        await employeeAPI.terminateEmpById(employeeId); // Delete the employee
        messageApi.success("Employee terminated");
        navigate("/admin/employees"); // Navigate back to employee management page
      } else {
        messageApi.error("Something went wrong - Employee ID not found");
      }
    } catch (error) {
      console.error("Error terminating employee:", error);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!empUser)
    return (
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <h2 className="text-zinc-900 font-bold text-3xl text-center">Employee Not Found</h2>
      </div>
    );

  return (
    <div className="">
      {ContextHolder} {/* Message System */}
      <div className="max-w-7xl mx-auto m-4 pb-4">
        {/* Top Heading with buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <CoriBtn style="black" iconOnly onClick={() => navigate("/admin/employees")}>
              <Icons.ArrowBack />
            </CoriBtn>
            <h1 className="text-3xl font-bold text-zinc-900">Employee Details</h1>
          </div>
          <div className="flex gap-2">
            <CoriBtn secondary style="black" onClick={() => setShowEditDetailsModal(true)}>
              <Icons.Edit />
              Edit Details
            </CoriBtn>
            <CoriBtn style="black" onClick={toggleEmpSuspension}>
              {empUser?.isSuspended ? "Unsuspend" : "Suspend"}
            </CoriBtn>
            <CoriBtn style="red" onClick={() => setShowTerminateEmployeeModal(true)}>
              Terminate
            </CoriBtn>
          </div>
        </div>
        {/* Page Body */}
        <div className="flex gap-4">
          <div className="max-w-1/2 min-w-1/2 w-1/2 flex flex-col gap-4">
            {/* Employee Details */}
            <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col">
              <div className="flex gap-4">
                {empUser.profilePicture ? (
                  <Avatar
                    src={empUser.profilePicture}
                    size={104}
                    className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                  />
                ) : (
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${empUser.fullName}`}
                    size={104}
                    className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-zinc-500">Employee ID {empUser.employeeId}</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-zinc-900 font-bold text-3xl">{empUser.fullName}</h2>
                    {empUser.googleId && (
                      <Tooltip title="Signed up with Google">
                        <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                      </Tooltip>
                    )}
                  </div>
                  <Tooltip
                    title={`${
                      empUser.jobTitle
                    } in the ${empUser.department.toLowerCase()} department`}
                    placement="bottomLeft"
                  >
                    <div className="flex gap-2 items-center justify-between overflow-clip">
                      {/* <WorkIcon /> */}
                      <p className="text-zinc-900 truncate max-w-[40%]">{empUser.jobTitle}</p>
                      <p className="text-zinc-900">•</p>
                      <p className="text-zinc-500 truncate max-w-[40%]">{empUser.department}</p>
                      <div className="w-fit">
                        {empUser.isSuspended ? (
                          <EmployTypeBadge status="suspended" />
                        ) : (
                          <EmployTypeBadge status={empUser.employType} />
                        )}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <div className="flex">
                  <div className="flex flex-grow flex-col gap-4 w-1/2">
                    <div className="flex gap-2 items-center">
                      {empUser.gender === Gender.Female ? (
                        <Icons.Female className="text-pink-500" />
                      ) : empUser.gender === Gender.Male ? (
                        <Icons.Male className="text-blue-500" />
                      ) : (
                        <Icons.Transgender className="text-purple-500" />
                      )}
                      <p className="text-zinc-500">
                        {empUser.gender === Gender.Female
                          ? "Female"
                          : empUser.gender === Gender.Male
                          ? "Male"
                          : "Other"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Icons.Cake />
                      <p className="text-zinc-500">
                        {empUser.dateOfBirth}
                        <span className="text-zinc-400 text-sm ml-2">
                          ({dayjs(empUser.dateOfBirth).fromNow(true)} old)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col gap-4 w-1/2">
                    <div className="flex gap-2 items-center">
                      <Icons.Phone />
                      <p className="text-zinc-500">{formatPhone(empUser.phoneNumber)}</p>
                    </div>
                    <Tooltip
                      title={empUser.email}
                      placement="top"
                      overlayInnerStyle={{
                        width: "fit-content",
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <Icons.Email />
                        <p className="text-zinc-500 text-truncate">{empUser.email}</p>
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Icons.AssistantPhoto />
                  <p className="text-zinc-500">
                    Employed for {formatEmploymentDuration(empUser.employDate)}
                    <span className="text-zinc-400 text-sm ml-2">
                      ({dayjs(empUser.employDate).format("DD MMM YYYY")})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Payroll Information */}
            <div className="w-full flex flex-col gap-2 items-center">
              <h2 className="text-zinc-500 font-semibold">Payroll</h2>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                <p className="text-zinc-500 text-sm mb-1">Salary</p>
                <div className="flex flex-col items-center p-4 bg-warmstone-200 w-full rounded-2xl">
                  <p className="text-zinc-900 text-xl">{formatRandAmount(empUser.salaryAmount)}</p>
                  <p className="text-zinc-500 text-sm">
                    {empUser.payCycle === PayCycle.Monthly
                      ? "monthly"
                      : empUser.payCycle === PayCycle.BiWeekly
                      ? "bi-weekly"
                      : "weekly"}
                  </p>
                </div>
                <div className="flex w-full mt-2 gap-2 h-fit">
                  <div className="flex flex-col w-1/2 items-center">
                    <p className="text-zinc-500 text-sm mb-1">Last Paid</p>
                    <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                      <DatePicker
                        value={dayjs(empUser.lastPaidDate)}
                        format="DD MMM YYYY"
                        suffixIcon={<CoriCircleBtn style="black" icon={<Icons.Edit />} />}
                        allowClear={false}
                        variant="borderless"
                        className="hover:cursor-pointer"
                        onChange={(date) => updateLastPaidDate(date?.format("YYYY-MM-DD") || "")}
                        // Only allow dates after the employee's employment date and before today
                        minDate={dayjs(empUser.employDate)}
                        maxDate={dayjs()}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2 items-center">
                    <p className="text-zinc-500 text-sm mb-1">Next Pay Day</p>
                    {nextPayDay && (
                      <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                        <p className="text-zinc-900">{nextPayDay}</p>
                        {/* <CoriBadge text={`${dayjs(nextPayDay).fromNow()}`} size="x-small" /> */}
                        <TimeTodayBadge date={nextPayDay} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between w-full mt-4">
                  <CoriBtn secondary style="black" onClick={onUndoPayment}>
                    <Icons.Undo />
                    Undo Payment
                  </CoriBtn>
                  <CoriBtn secondary style="black" onClick={onPayNow}>
                    Pay Now
                    <Icons.Pay />
                  </CoriBtn>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="w-full flex flex-col gap-2 items-center">
              <div className="flex gap-2 items-center">
                <h2 className="text-zinc-500 font-semibold">Equipment</h2>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "create",
                        label: "Create Brand New",
                        icon: <Icons.AutoAwesome />,
                        onClick: () => setShowCreateAssignedEquipModal(true),
                      },
                      {
                        key: "assign",
                        label: "Assign Existing",
                        icon: <Icons.PersonPin />,
                        onClick: () => setShowAssignExistingEquipModal(true),
                      },
                    ],
                  }}
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <Button
                    type="text"
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-zinc-500 text-zinc-50 border-2 border-zinc-500 hover:bg-zinc-900 hover:text-zinc-50 hover:border-zinc-900"
                  >
                    <Icons.Add fontSize="small" />
                  </Button>
                </Dropdown>
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-4">
                {equipment.map((item) => (
                  <EquipmentListItem
                    key={item.equipmentId}
                    item={item}
                    onEdit={() => setShowManageEquipmentModal(true)}
                    adminView
                  />
                ))}
                {/* Empty Message */}
                {equipment.length === 0 && (
                  <p className="text-zinc-500 py-4">No Equipment Assigned</p>
                )}
              </div>
            </div>
          </div>
          <div className="max-w-1/2 min-w-1/2 w-1/2">
            <div className="flex gap-4">
              {/* Leave Balances */}
              <div className="w-3/12 flex flex-col items-center gap-2">
                <h2 className="text-zinc-500 font-semibold">Leave</h2>
                <div className="flex flex-col gap-3">
                  {leaveBalances.map((balance) => (
                    <LeaveBalanceBlock
                      key={balance.leaveBalanceId}
                      leaveType={balance.leaveTypeName}
                      remainingDays={balance.remainingDays}
                      totalDays={balance.defaultDays}
                      description={balance.description}
                    />
                  ))}
                </div>
              </div>
              {/* Rating & Performance Reviews */}
              <div className="w-9/12 flex flex-col gap-4 max-w-9/12">
                <div className="w-full flex flex-col gap-2 items-center">
                  <h2 className="text-zinc-500 font-semibold">Average Rating</h2>
                  <div className="w-full p-4 bg-warmstone-50 rounded-2xl">
                    <GaugeComponent
                      minValue={0}
                      maxValue={500}
                      value={empUserRatingMetrics ? empUserRatingMetrics.averageRating * 100 : 0}
                      type="semicircle"
                      labels={{
                        valueLabel: {
                          formatTextValue: (value) => `${value / 100}`,
                          style: { fontSize: "32px", fill: "#18181b" },
                        },
                        tickLabels: {
                          hideMinMax: false,
                          defaultTickValueConfig: {
                            formatTextValue: (value) => `${value / 100}`,
                            style: { fontSize: "16px", fill: "#18181b" },
                          },
                        },
                      }}
                      arc={{
                        nbSubArcs: 5,
                        colorArray: ["#d32f2f", "#f57c00", "#fbc02d", "#388e3c", "#1976d2"],
                        padding: 0.02,
                        width: 0.2,
                      }}
                      pointer={{
                        type: "arrow",
                        animationDuration: 1000,
                      }}
                    />
                    {empUserRatingMetrics && (
                      <div className="text-center mt-2">
                        <p className="text-zinc-500 text-sm">
                          Based on {empUserRatingMetrics.numberOfRatings} rating
                          {empUserRatingMetrics.numberOfRatings !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                  <h2 className="text-zinc-500 font-semibold">Performance Reviews</h2>
                  {/* TODO Possibly create a performance review here? */}
                  <div className="w-full h-[580px] overflow-y-auto gap-4 flex flex-col rounded-2xl relative scrollbar-hide [&::-webkit-scrollbar]:hidden">
                    {performanceReviews.map((review) => (
                      <PerfReviewBox key={review.reviewId} review={review} showPerson={true} />
                    ))}
                    {performanceReviews.length === 0 && (
                      <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-3">
                        <p className="text-zinc-500 text-center">No Performance Reviews Yet</p>
                      </div>
                    )}
                    {/* Empty Spacer Overlay (for fade out effect) */}
                    <div className="py-10 w-full bg-gradient-to-b from-transparent to-stone-200 sticky bottom-0 left-0 right-0 text-transparent">
                      _
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* MODALS */}
        {/* Edit Details Modal */}
        <AdminEditEmpDetailsModal
          showModal={showEditDetailsModal}
          setShowModal={setShowEditDetailsModal}
          employee={empUser}
          onUpdate={fetchEmployee}
        />

        {/* Create & Assign Equipment Modal */}
        <CreateAssignedEquipModal
          showModal={showCreateAssignedEquipModal}
          setShowModal={setShowCreateAssignedEquipModal}
        />

        {/* Assign Existing Equipments Modal */}
        <AssignEmpToEquipsModal
          showModal={showAssignExistingEquipModal}
          setShowModal={setShowAssignExistingEquipModal}
        />

        {/* Manage Equipment Modal */}
        <ManageAssignedItemModal
          showModal={showManageEquipmentModal}
          setShowModal={setShowManageEquipmentModal}
        />

        {/* Terminate Employee Modal */}
        <TerminateEmployeeModal
          showModal={showTerminateEmployeeModal}
          setShowModal={setShowTerminateEmployeeModal}
          employeeFullName={empUser?.fullName || "this employee"}
          onTerminate={onTerminate}
        />
      </div>
    </div>
  );
};

export default AdminIndividualEmployee;
