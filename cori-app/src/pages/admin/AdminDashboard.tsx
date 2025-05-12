// //Kayla Posthumus

import React, { useEffect, useState } from "react";
import "../../styles/adminDash.css"
import { Col, Container, Row } from "react-bootstrap";
import BarChartCard from "../../components/charts/BarChart";
import DoughnutChartCard from "../../components/charts/DoughnutChart";
import LeaveCardAdminDash from "../../components/leave/LeaveCardAdminDash";
import AdminAddIcon from "../../assets/icons/AdminAddIcon.png";
import TopRatedEmpCard from "../../components/cards/adminCards/TopRatedEmpAdm";
import AdminCalendar from "../../components/calender";

//---
import { pageAPI } from "../../services/api.service";

// import PerfReviewBox from "../../components/performanceReview/PerfReviewBox";

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await pageAPI.getAdminDashboardData();
        console.log("Dashboard Data:", response.data); // Debugging
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const empUserRatingMetrics = dashboardData?.empUserRatingMetrics?.$values || [];
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
      <h1 className="text-3xl font-bold mb-2 text-zinc-900">Welcome, (Admin Name)</h1>
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
                  <div className="w-full h-[330px] overflow-y-auto relative scrollbar-hide [&::-webkit-scrollbar]:hidden bg-warmstone-50 p-3 rounded-2xl flex flex-col shadow gap-2">
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
                      <div className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full">
                        <p className='text-sm font-bold mb-2'>New Performance Review</p>
                          <div className="flex justify-end h-full">
                            <img src={AdminAddIcon} alt="Plus Icon" className="AdminAddIcon" />
                          </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full">
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
                            employType={
                              employeeData?.employType === 0
                                ? "Full Time"
                                : employeeData?.employType === 1
                                ? "Part Time"
                                : "Unknown"
                            }
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
              <AdminCalendar />
              {/* <PerfReviewBox /> */}
            </Col>
          </Row>
        </Container>
      
      </div>
    </div>
  );
};

export default AdminDashboard;

// const AdminDashboard: React.FC = () => {
//   return(
//     <div></div>
//   )
// }

// export default AdminDashboard;