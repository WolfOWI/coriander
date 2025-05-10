// //Kayla Posthumus

// import React, { useEffect, useState } from "react";
// import "../../styles/adminDash.css"
// import { Col, Container, Row } from "react-bootstrap";
// import BarChartCard from "../../components/charts/BarChart";
// import DoughnutChartCard from "../../components/charts/DoughnutChart";
// import LeaveCardAdminDash from "../../components/leave/LeaveCardAdminDash";
// import AdminAddIcon from "../../assets/icons/AdminAddIcon.png";
// import TopRatedEmpCard from "../../components/cards/adminCards/TopRatedEmpAdm";
// import AdminCalendar from "../../components/calender";
// import { AdminPageAPI } from "../../services/api.service";
// // import PerfReviewBox from "../../components/performanceReview/PerfReviewBox";

// const AdminDashboard: React.FC = () => {
//   const [empRatings, setEmpRatings] = useState([]);
//   const [topRated, setTopRated] = useState([]);
//   const [statusTotals, setStatusTotals] = useState<StatusTotals>({});
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ratings, top, status, leave] = await Promise.all([
//           AdminPageAPI.getEmpRatings(),
//           AdminPageAPI.getTopRatedEmployees(),
//           AdminPageAPI.getEmployeeStatusTotals(),
//           AdminPageAPI.getLeaveRequests(),
//         ]);

//         setEmpRatings(ratings.data?.$values || []);
//         setTopRated(top.data?.$values || []);
//         setStatusTotals(status.data || {});
//         setLeaveRequests(leave.data?.$values || []);
//       } catch (err) {
//         console.error("Error loading dashboard:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto m-4">
//       {/* Heading */}
//       <h1 className="text-3xl font-bold mb-2 text-zinc-900">Welcome, (Admin Name)</h1>
//       <h4 className="text-zinc-900 mb-3">Stay updated on key HR activities and pending tasks.</h4>
//       <div className="line-horisontal mb-4"></div>

//       {/* Page Body */}
//         {/* Container 1 */}

//       <div className="">

//         {/* Column 1 */}
//         <Container>
//           <Row>
//             {/* Left Cards */}
//             <Col lg="8" md="8">
//               <Row className="g-3">
//                 {/* Employee Ratings Chart */}
//                 <Col xs={12} md={7}>
//                   <div className="text-zinc-500 font-semibold text-center mb-2">Employee Ratings</div>
//                     <div className="bg-warmstone-50 pt-2 rounded-2xl shadow">
//                     <BarChartCard
//                       chartData={{
//                         labels: empRatings.map(emp => emp.fullName),
//                         series: [
//                           { name: "Average Rating", data: empRatings.map(emp => emp.averageRating) },
//                           { name: "Most Recent Rating", data: empRatings.map(emp => emp.mostRecentRating) },
//                         ],
//                       }}
//                     />
//                     </div>
//                 </Col>

//                 {/* Employment Overview Card */}
//                 <Col xs={12} md={5}>
//                   <div className="text-zinc-500 font-semibold text-center mb-2">Employment Overview</div>
//                     <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
//                       <DoughnutChartCard data={statusTotals} />
//                     </div>
//                 </Col>

//                 {/* Leave Requests Card */}
//                 <Col xs={12} md={5}>
//                 <div className="text-zinc-500 font-semibold text-center mb-2">Leave Requests</div>
//                   <div className="bg-warmstone-50 p-3 rounded-2xl flex flex-col shadow gap-2">
//                   {leaveRequests.map((leave) => (
//                   <LeaveCardAdminDash key={leave.leaveRequestId} leave={leave} />
//                 ))}

//                   </div>
//                 </Col>

//                 <Col xs={12} md={7}>
//                 {/* Creating PRM meetings and rating employee buttons - For Modal */}
//                   <Row className="g-3">
//                     <Col md={6}>
//                       <div className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full">
//                         <p className='text-sm font-bold mb-1'>New Performance Review</p>
//                           <div className="flex justify-end h-full">
//                             <img src={AdminAddIcon} alt="Plus Icon" className="AdminAddIcon" />
//                           </div>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="bg-corigreen-500 text-warmstone-200 p-3 rounded-2xl shadow h-full">
//                         <p className='text-sm font-bold mb-1'>Rate Your Employee</p>
//                           <div className="flex justify-end h-full">
//                             <img src={AdminAddIcon} alt="Plus Icon" className="AdminAddIcon" />
//                           </div>
//                       </div>
//                     </Col>
//                   </Row>

//                   {/* Top Rated employee list */}
//                   <Col xs={12} md={12}>
//                     <div className="text-zinc-500 font-semibold text-center mb-2 mt-3">Top Rated Employees</div>
//                       <div className="bg-warmstone-50 p-2 rounded-2xl flex flex-col shadow">
//                       {topRated.map((emp, i) => (
//                         <TopRatedEmpCard key={i} employees={emp} />
//                       ))}
//                       </div>
//                   </Col>

//                 </Col>

//               </Row>


//             </Col>
//             {/* Right Card -> Performance Review calender and meetCards */}
//             <Col lg="4" md="4">
//               <AdminCalendar />
//               {/* <PerfReviewBox /> */}
//             </Col>
//           </Row>
//         </Container>
      
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

const AdminDashboard: React.FC = () => {
  return(
    <div></div>
  )
}

export default AdminDashboard;