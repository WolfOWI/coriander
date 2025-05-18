// //Kayla Posthumus

import React, { useEffect, useState } from "react";
import "../../styles/adminDash.css"
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

//Interface
import { Gathering } from "../../interfaces/gathering/gathering";

//Modals
import CreatePRModal from "../../components/modals/CreatePRModal";
import EditPRModal from "../../components/modals/EditPRModal";

//Assets
import AdminAddIcon from "../../assets/icons/AdminAddIcon.png";
import { Spin } from "antd";

const AdminDashboard: React.FC = () => {
  // State variables
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePRModal, setShowCreatePRModal] = useState(false);
  const [showEditPRModal, setShowEditPRModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [gatherings, setGatherings] = useState<any>({ all: [] });

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
      const response = await gatheringAPI.getUpcomingAndCompletedGatheringsByAdminIdAndMonth(adminId, month);
      // Use the $values array directly
      setGatherings({
        all: response.data.$values || [],
      });
    } catch (err) {
      setGatherings({ all: [] });
    }
  };

  useEffect(() => {
    fetchGatherings(1, selectedDate.getMonth() + 1); // adminId=2, month is 1-indexed
  }, [selectedDate]);

  //Display gatherings for selected Day
  const gatheringsForSelectedDay = (gatherings.all || []).filter((g: { startDate: string | number | Date; }) => {
    if (!g || !g.startDate) return false;
    const d = new Date(g.startDate);
    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  });

  if (loading) return (
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
        Welcome, {dashboardData?.adminUser?.fullName || "(Admin Name)"}
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
                  <div className="text-zinc-500 font-semibold text-center mb-2">Employee Ratings</div>
                    <div className="bg-warmstone-50 pt-2 rounded-2xl shadow">
                    <BarChartCard empUserRatingMetrics={empUserRatingMetrics} />
                    </div>
                </Col>

                {/* Employment Overview Card */}
                <Col xs={12} md={5}>
                  <div className="text-zinc-500 font-semibold text-center mb-2">Employment Overview</div>
                    <div className="bg-warmstone-50 p-3 rounded-2xl flex flex-col shadow">
                    <DoughnutChartCard employeeStatusTotals={employeeStatusTotals} />
                    </div>
                </Col>

                {/* Leave Requests Card */}
                <Col xs={12} md={5}>
                <div className="w-full flex flex-col items-center">
                <div className="text-zinc-500 font-semibold text-center mb-2">Leave Requests</div>
                  <div className="w-full h-[350px] overflow-y-auto relative scrollbar-hide [&::-webkit-scrollbar]:hidden bg-warmstone-50 p-3 rounded-2xl flex flex-col shadow gap-2">
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
                  {/* <div className="py-10 w-full bg-gradient-to-b from-transparent to-stone-200 sticky bottom-0 left-0 right-0 text-transparent">
                      _
                  </div> */}
                  </div>
                </Col>

                <Col xs={12} md={7}>
                {/* Creating PRM meetings and rating employee buttons - For Modal */}
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full hover:cursor-pointer" onClick={() => setShowCreatePRModal(true)}>
                        <p className='text-sm font-bold mb-2'>New Performance Review</p>
                          <div className="flex justify-end h-full">
                            <img src={AdminAddIcon} alt="Plus Icon" className="AdminAddIcon" />
                          </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full hover:cursor-pointer" onClick={() => setShowEditPRModal(true)}>
                        <p className='text-sm font-bold mb-2'>Rate Your Employee</p>
                          <div className="flex justify-end h-full">
                            <img src={AdminAddIcon} alt="Plus Icon" className="AdminAddIcon" />
                          </div>
                      </div>
                    </Col>
                  </Row>

                  
                  {/* Top Rated employee list */}
                  <Col xs={12} md={12}>
                    <div className="text-zinc-500 font-semibold text-center mb-2 mt-3">Top Rated Employees</div>
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
             <div>
              <div className="text-zinc-500 font-semibold text-center mb-2 mt-3">
                <h4>Gatherings for {selectedDate.toLocaleDateString()}</h4>
              </div>
              <div className='grid gap-3'>
                {gatheringsForSelectedDay.map((gathering: Gathering) => (
                  <AdminGatheringBox key={gathering.id} gathering={gathering} />
                ))}
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
          setShowCreatePRModal(false);
          console.log("Performance Review created successfully!");
        }} 
      />     

      <EditPRModal
        showModal={showEditPRModal}
        setShowModal={setShowEditPRModal}
        onEditSuccess={() => {
          fetchDashboardData(); // Refresh dashboard data
          setShowEditPRModal(false);
          console.log("Performance Review updated successfully!");
        }} 
      />               
      
      </div>
    </div>
  );
};

export default AdminDashboard;
