//Kayla Posthumus

import React from "react";
import "../../styles/adminDash.css"
import { Col, Container, Row } from "react-bootstrap";
import BarChartCard from "../../components/charts/BarChart";
import DoughnutChartCard from "../../components/charts/DoughnutChart";

const AdminDashboard: React.FC = () => {
  
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
                      <BarChartCard />
                    </div>
                </Col>

                {/* Employment Overview Card */}
                <Col xs={12} md={5}>
                  <div className="text-zinc-500 font-semibold text-center mb-2">Employment Overview</div>
                    <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
                      <DoughnutChartCard />
                  </div>
                </Col>

                {/* Leave Requests Card */}
                <Col xs={12} md={6}>
                  <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
                    <h2 className="text-xl text-zinc-900">Leave Requests</h2>
                  </div>
                </Col>

              </Row>


            </Col>
            {/* Right Card -> Performance Review calender and meetCards */}
            <Col lg="4" md="4">Hi Daar!</Col>
          </Row>
        </Container>
      
      </div>
    </div>
  );
};

export default AdminDashboard;