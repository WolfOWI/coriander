//Kayla Posthumus

import React, { useEffect, useState } from "react";
import "../../styles/adminDash.css";
import { Col, Container, Row } from "react-bootstrap";

//Custom Components
import BarChartCard from "../../components/charts/BarChart";
import DoughnutChartCard from "../../components/charts/DoughnutChart";
import LeaveCardAdminDash from "../../components/leave/LeaveCardAdminDash";
import TopRatedEmpCard from "../../components/cards/adminCards/TopRatedEmpAdm";
import AdminCalendar from "../../components/calender";
import AdminGatheringBox from "../../components/gathering/AdminGatheringBox";

//Functionality
import { gatheringAPI, pageAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

//Interface
import { Gathering } from "../../interfaces/gathering/gathering";

//Modals
import CreatePRModal from "../../components/modals/CreatePRModal";
import EditPRModal from "../../components/modals/EditPRModal";

//Assets
import AdminAddIcon from "../../assets/icons/AdminAddIcon.png";
import { Spin } from "antd";
import dayjs from "dayjs";
import { Icons } from "../../constants/icons";
import CoriBtn from "../../components/buttons/CoriBtn";

const AdminDashboard: React.FC = () => {
  // State variables
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePRModal, setShowCreatePRModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [gatherings, setGatherings] = useState<any>({ all: [] });
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [loadingGatherings, setLoadingGatherings] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch dashboard data from the API
  const fetchDashboardData = async () => {
    try {
      const response = await pageAPI.getAdminDashboardData(1); //set adminId = 2 *Change later
      setDashboardData(response.data);
      console.log("Dashboard Data:", response.data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchGatherings = async (adminId: number, month: number) => {
    try {
      setLoadingGatherings(true);
      // Clear existing gatherings before fetching new ones
      setGatherings({ all: [] });

      const response = await gatheringAPI.getUpcomingAndCompletedGatheringsByAdminIdAndMonth(
        adminId,
        month
      );

      // Ensure we're working with a clean array and no duplicates
      const gatheringsData = response.data.$values || [];
      const uniqueGatherings = Array.from(
        new Map(gatheringsData.map((g: any) => [g.id, g])).values()
      );

      setGatherings({
        all: uniqueGatherings,
      });
    } catch (err) {
      setGatherings({ all: [] });
    } finally {
      setLoadingGatherings(false);
    }
  };

  // If a different month is selected, fetch the gatherings for the new month
  useEffect(() => {
    const newMonth = selectedDate.getMonth() + 1;
    // Only fetch if month actually changes
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
      fetchGatherings(1, newMonth);
    }
  }, [selectedDate]);

  // Initial fetch only on component mount
  useEffect(() => {
    const initialMonth = selectedDate.getMonth() + 1;
    setCurrentMonth(initialMonth);
    fetchGatherings(1, initialMonth);
  }, []);

  //Display gatherings for selected Day
  const gatheringsForSelectedDay = React.useMemo(() => {
    return (gatherings.all || []).filter((g: { startDate: string | number | Date }) => {
      if (!g || !g.startDate) return false;
      const d = new Date(g.startDate);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    });
  }, [gatherings.all, selectedDate]);

  if (loading)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  // Destructure the data from the API response
  const empUserRatingMetrics = dashboardData?.empUserRatingMetrics?.$values || [];
  //Default values for employee status totals
  // If the API response is empty or undefined
  const employeeStatusTotals = dashboardData?.employeeStatusTotals || {
    totalEmployees: 0,
    totalFullTimeEmployees: 0,
    totalPartTimeEmployees: 0,
    totalInternEmployees: 0,
    totalContractEmployees: 0,
    totalSuspendedEmployees: 0,
  };
  const leaveRequests = dashboardData?.leaveRequests?.$values || [];
  const topRatedEmployees = dashboardData?.topRatedEmployees?.$values || [];

  return (
    <div className="max-w-7xl mx-auto m-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-zinc-900">
        Welcome, {dashboardData?.adminUser?.fullName || "Admin"}
      </h1>
      <h4 className="text-zinc-900 mb-3">Stay updated on key HR activities and pending tasks.</h4>
      <div className="line-horisontal mb-4"></div>

      {/* Page Body */}
      {/* Container 1 */}

      <div className="">
        {/* Column 1 */}
        <Container>
          <Row>
            {/* Left Cards */}
            <Col lg="8" md="8">
              <Row className="g-3">
                {/* Employee Ratings Chart */}
                <Col xs={12} md={7}>
                  <div className="text-zinc-500 font-semibold text-center mb-2">
                    Employee Ratings: Top 5
                  </div>
                  <div className="bg-warmstone-50 pt-2 rounded-2xl shadow">
                    <BarChartCard empUserRatingMetrics={empUserRatingMetrics} />
                  </div>
                </Col>

                {/* Employment Overview Card */}
                <Col xs={12} md={5}>
                  <div className="text-zinc-500 font-semibold text-center mb-2">
                    Employment Overview
                  </div>
                  <div className="bg-warmstone-50 p-3 rounded-2xl flex flex-col shadow">
                    <DoughnutChartCard employeeStatusTotals={employeeStatusTotals} />
                  </div>
                </Col>

                {/* Leave Requests Card */}
                <Col xs={12} md={5}>
                  <div className="w-full flex flex-col items-center">
                    <div className="flex justify-between items-center gap-3 mb-2">
                      <div className="text-zinc-500 font-semibold">
                        Leave Requests
                      </div>
                      <button
                        className="bg-sakura-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow hover:bg-sakura-400 transition"
                        onClick={() => navigate("/admin/leave-requests")}
                        type="button"
                      >
                        View All
                      </button>
                    </div>
                    <div className="relative w-full">
                      <div
                        className="h-[335px] overflow-y-auto bg-warmstone-50 p-3 rounded-2xl flex flex-col shadow gap-2"
                        style={{ paddingBottom: 32 /* space for fade */ }}
                      >
                        {leaveRequests.map((request: any) => (
                          <LeaveCardAdminDash
                            key={request.leaveRequestId}
                            leave={{
                              leaveRequestId: request.leaveRequestId,
                              employeeId: request.employeeId,
                              employeeName: request.employeeName,
                              startDate: request.startDate,
                              endDate: request.endDate,
                              leaveType: request.leaveType,
                              createdAt: request.createdAt,
                            }}
                          />
                        ))}
                      </div> 
                    </div>
                  </div>
                </Col>

                <Col xs={12} md={7}>
                  {/* Creating PRM meetings and rating employee buttons - For Modal */}
                  <Row className="g-3">
                    <Col md={6}>
                      <div
                        className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full hover:cursor-pointer"
                        onClick={() => setShowCreatePRModal(true)}
                      >
                        <p className="text-sm font-bold mb-2">New Performance Review</p>
                        <div className="flex justify-end h-full">
                          <img src={AdminAddIcon} alt="Plus Icon" className="AdminAddIcon" />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div
                        className="flex flex-col bg-sakura-500 text-warmstone-200 p-3 rounded-2xl shadow h-full hover:cursor-pointer"
                        onClick={() => {
                          navigate("/admin/meetings");
                        }}
                      >
                        <p className="text-zinc-900 text-sm font-bold mb-2">View All Meetings</p>
                        <div className="flex bg-zinc-900 rounded-full p-2 w-fit align-self-end">
                          <Icons.MeetingRoom className="w-6 h-6" />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Top Rated employee list */}
                  <Col xs={12} md={12}>
                    <div className="text-zinc-500 font-semibold text-center mb-2 mt-3">
                      Top 3 Employees
                    </div>
                    <div className="bg-warmstone-50 p-2 rounded-2xl flex flex-col shadow">
                      {topRatedEmployees.map((employee: any) => {
                        const employeeData = employee.employees?.$values[0];
                        const ratingData = employee.ratings?.$values[0];

                        return (
                          <TopRatedEmpCard
                            key={employeeData?.employeeId}
                            profilePicture={employeeData?.profilePicture}
                            fullName={employeeData?.fullName || "Unknown"}
                            jobTitle={employeeData?.jobTitle || "Unknown"}
                            averageRating={ratingData?.averageRating || 0}
                            employType={employeeData?.employType}
                            isSuspended={employeeData?.isSuspended}
                          />
                        );
                      })}
                    </div>
                  </Col>
                </Col>
              </Row>
            </Col>

            {/* Right Card -> Performance Review calender and meetCards */}
            <Col lg="4" md="4">
              <AdminCalendar value={selectedDate} onChange={setSelectedDate} />
            <div className="text-zinc-500 font-semibold text-center mb-2 mt-3">
              <h4>Your Meetings on {dayjs(selectedDate).format("D MMMM")}</h4>
            </div>
              <div className="relative">
                <div
                  className="meetings w-full h-[390px] flex flex-col rounded-2xl overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden"
                  style={{ position: "relative" }}
                >
                  <div className="grid gap-3 flex-1">
                    {loadingGatherings ? (
                      <div className="w-full flex justify-center py-4">
                        <Spin size="default" />
                      </div>
                    ) : gatheringsForSelectedDay.length > 0 ? (
                      gatheringsForSelectedDay.map((gathering: Gathering) => (
                        <AdminGatheringBox
                          key={gathering.id}
                          gathering={gathering}
                          onEditSuccess={() => {
                            fetchDashboardData();
                            fetchGatherings(1, currentMonth);
                          }}
                          onDeleteSuccess={() => {
                            fetchDashboardData();
                            fetchGatherings(1, currentMonth);
                          }}
                          loggedInAdminId={dashboardData?.adminUser?.adminId?.toString() || "1"}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4 text-zinc-500">You have no meetings today!</div>
                    )}
                  </div>
                  {/* Fade effect at the bottom */}
                  <div className=" w-full bg-gradient-to-b from-transparent to-stone-200 sticky bottom-0 left-0 right-0 text-transparent">
                      _
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* CreatePRModal */}
        <CreatePRModal
          showModal={showCreatePRModal}
          setShowModal={setShowCreatePRModal}
          onCreateSuccess={() => {
            fetchDashboardData(); // Refresh dashboard data
            fetchGatherings(1, currentMonth); // Refresh meetings list
            setShowCreatePRModal(false);
            console.log("Performance Review created successfully!");
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
