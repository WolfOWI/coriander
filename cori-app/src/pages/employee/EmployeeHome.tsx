import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import GaugeComponent from "react-gauge-component";
import LeaveBalanceBlock from "../../components/leave/LeaveBalanceBlock";
import { empUserAPI, pageAPI, employeeAPI } from "../../services/api.service";
import { EmpUser } from "../../interfaces/people/empUser";
import { formatRandAmount } from "../../utils/formatUtils";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import TimeTodayBadge from "../../components/badges/TimeTodayBadge";
import { Icons } from "../../constants/icons";

import { useParams } from "react-router-dom"; // ✅ Needed for employeeId
import { Spin } from "antd"; // ✅ Used in loading state


const EmployeeHome: React.FC = () => {
  const { employeeId = "8" } = useParams();


  const [empUser, setEmpUser] = useState<EmpUser | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<any>(null); // 
  const [empUserRatingMetrics, setEmpUserRatingMetrics] = useState<any>(null); // Replace with actual type if availableReplace with actual type if available

  const [loading, setLoading] = useState(true);
  

  const fetchEmployeeData = async () => {
    try {
      if (employeeId) {
        const response = await pageAPI.getAdminEmpDetails(employeeId);
        const data: any = response.data; 
  
        setEmpUser(data.empUser);
        setLeaveBalances(data.leaveBalances?.$values || []);
        setEmpUserRatingMetrics(data.empUserRatingMetrics);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false); // ✅ Ensure spinner stops
    }
  };
  

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  //For the Quote of the day
  const [quote, setQuote] = useState<string>(""); 
  const [quoteAuthor, setQuoteAuthor] = useState<string>("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        setQuote(data.content);
        setQuoteAuthor(data.author);
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        setQuote("Stay positive and keep moving forward."); // fallback quote
        setQuoteAuthor("Unknown");
      }
    };
  
    fetchQuote();
  }, []);
  

  if (loading)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (!empUser)
    return (
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <h2 className="text-zinc-900 font-bold text-3xl text-center">Employee Not Found</h2>
      </div>
    );
  

  return (
    <div className="max-w-7xl mx-auto m-4">
      {empUser && (      
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">Welcome, {empUser.fullName}</h1>
      )}
      <h4 className="text-zinc-900 mb-3">Stay informed and manage your tasks effortlessly.</h4>
      <div className="line-horisontal mb-4 bg-black" style={{ height: '1px' }}></div>

      <Container>
        <Row>
          <Col md={8}>
            <Row className="g-3">
              {/* Ratings */}
              <Col xs={12} md={5}>
                  <div className="text-zinc-500 font-semibold text-center mb-2">Your Ratings</div>
                    <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow">
                      <div className="w-full flex flex-col gap-2 items-center">
                      <GaugeComponent
                        minValue={0}
                        maxValue={500}
                        value={empUserRatingMetrics ? empUserRatingMetrics.averageRating * 100 : 0}
                        type="radial"
                        labels={{
                          valueLabel: {
                            formatTextValue: (value) => `${(Number(value) / 100).toFixed(2)}`,
                            style: { fontSize: "32px", fill: "#18181b" },
                          },
                          tickLabels: {
                            hideMinMax: false,
                            defaultTickValueConfig: {
                              formatTextValue: (value) => `${(Number(value) / 100).toFixed(1)}`,
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
              </Col>

              {/* Leave Balances */}
              <Col xs={12} md={7}>
                  <div className="text-zinc-500 font-semibold text-center mb-2">Your Remaining Leave</div>
                    <div className="bg-red flex flex-col items-center">
                        <div className="flex flex-wrap gap-2">
                        {leaveBalances?.map((balance: any) => (
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
              </Col>
            </Row>
            {/* Payroll Information */}
            <Row className="g-3 pt-3">
              <Col xs={12} md={12}>
              <div className="text-zinc-500 font-semibold text-center mb-2">Your Payroll Information</div>
                <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow">
                  <div className="w-full flex flex-col gap-2 items-center">
                    <div className="bg-warmstone-50 p-2 rounded-2xl w-full flex flex-col items-center">
                        <p className="text-zinc-500 text-sm mb-1">Salary</p>
                        <div className="flex flex-col items-center p-3 bg-warmstone-200 w-full rounded-2xl">
                          <p className="text-zinc-900 text-xl">{formatRandAmount(empUser.salaryAmount)}</p>
                          <p className="text-zinc-500 text-sm"> monthly
                            {/* {empUser.payCycle === PayCycle.Monthly
                              ? "monthly"
                              : empUser.payCycle === PayCycle.BiWeekly
                              ? "bi-weekly"
                              : "weekly"} */}
                          </p>
                        </div>
                        <div className="flex w-full mt-2 gap-2 h-fit">
                          <div className="flex flex-col w-1/2 items-center">
                            <p className="text-zinc-500 text-sm mb-1">Last Paid</p>
                            <div className="flex justify-center items-center gap-2 p-3 bg-warmstone-200 rounded-2xl h-full">
                              <DatePicker
                                // value={dayjs(empUser.lastPaidDate)}
                                format="DD MMM YYYY"
                                suffixIcon={<CoriCircleBtn style="black" icon={<Icons.Edit />} />}
                                allowClear={false}
                                variant="borderless"
                                className="hover:cursor-pointer"
                                // onChange={(date) => updateLastPaidDate(date?.format("YYYY-MM-DD") || "")}
                                // Only allow dates after the employee's employment date and before today
                                // minDate={dayjs(empUser.employDate)}
                                maxDate={dayjs()}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col w-1/2 items-center">
                            <p className="text-zinc-500 text-sm mb-1">Next Pay Day</p>
                            <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                                <p className="text-zinc-900">Date here: 00/00/0000</p>
                                {/* <TimeTodayBadge /> */}
                              </div>
                            {/* {nextPayDay && (
                              <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                                <p className="text-zinc-900">{nextPayDay}</p>
                                <TimeTodayBadge date={nextPayDay} />
                              </div>
                            )} */}
                          </div>
                          <div className="flex flex-col w-1/2 items-center">
                            <p className="text-transparent text-sm mb-1">..</p>
                            <div className="flex justify-center items-center gap-2 p-4  hover:bg-corigreen-200 border-2 border-corigreen-500 rounded-2xl w-full">
                              <div className="flex items-center">
                                <Icons.Upload className="text-corigreen-600" />
                                <p className="text-corigreen-600 font-medium text-sm">Export Payroll</p>
                              </div>
                            </div>
                            {/* {nextPayDay && (
                              <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                                <p className="text-zinc-900">{nextPayDay}</p>
                                <TimeTodayBadge date={nextPayDay} />
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
              </Col>
            </Row>
            <Row className="g-3 pt-4 mb-4">
              <Col xs={12} md={12}>
                    <div className="bg-corigreen-500 p-4 rounded-2xl shadow justify-center flex items-center text-white text-center"> 
                      {quote} - "{quoteAuthor}"
                    </div>
              </Col>
            </Row>
          </Col>

          <Col md={4}>
            <Col xs={12} md={12}>
                <div className="text-zinc-500 font-semibold text-center mb-2">Performance Reviews</div>
                  <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow mb-3">
                    Chart here
                  </div>
                  <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow mb-3">
                    Chart here
                  </div>
                  <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow">
                    Chart here
                  </div>
            </Col>
          </Col>

        </Row>
      </Container>

    </div>
  );
};

export default EmployeeHome;
