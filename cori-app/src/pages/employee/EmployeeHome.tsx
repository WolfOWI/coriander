import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import GaugeComponent from "react-gauge-component";
import LeaveBalanceBlock from "../../components/leave/LeaveBalanceBlock";
import { gatheringAPI, pageAPI } from "../../services/api.service";
import { EmpUser } from "../../interfaces/people/empUser";
import { formatRandAmount } from "../../utils/formatUtils";
import dayjs from "dayjs";
import { Icons } from "../../constants/icons";
import { calculateNextPayDay } from "../../utils/dateUtils";
import { generatePayrollPDF } from "../../utils/pdfUtils";
import { Gender, PayCycle } from "../../types/common";

import { useParams } from "react-router-dom";
import { Spin } from "antd";
import EmpGatheringBox from "../../components/gathering/EmpGatheringBox";

const EmployeeHome: React.FC = () => {
  const { employeeId = "8" } = useParams();

  const [empUser, setEmpUser] = useState<EmpUser | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<any>(null); //
  const [empUserRatingMetrics, setEmpUserRatingMetrics] = useState<any>(null); // Replace with actual type if availableReplace with actual type if available
  const [nextPayDay, setNextPayDay] = useState<string | null>(null);
  const [gatherings, setGatherings] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchGatherings = async () => {
      try {
        const response = await gatheringAPI.getAllGatheringsByEmpId(
          Number(employeeId)
        );
        setGatherings(response.data.$values || []);
      } catch (err) {
        setGatherings([]);
      }
    };
    fetchGatherings();
  }, [employeeId]);

  //For the Quote of the day
  const [quote, setQuote] = useState<string>("");
  const [quoteAuthor, setQuoteAuthor] = useState<string>("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const cachedQuote = localStorage.getItem("dailyQuote");
        const cachedDate = localStorage.getItem("dailyQuoteDate");
        const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

        if (cachedQuote && cachedDate === today) {
          const { quote, author } = JSON.parse(cachedQuote);
          setQuote(quote);
          setQuoteAuthor(author);
          return;
        }

        const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": "/cP8Aq3lAI2uPIG9ePOHQg==8nCa4YBBLaFwGjYQ",
          },
        });

        const data = await response.json();
        const randomQuote = data[0];

        if (randomQuote) {
          setQuote(randomQuote.quote);
          setQuoteAuthor(randomQuote.author);
          localStorage.setItem(
            "dailyQuote",
            JSON.stringify({
              quote: randomQuote.quote,
              author: randomQuote.author,
            })
          );
          localStorage.setItem("dailyQuoteDate", today);
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        setQuote("Stay positive and keep moving forward.");
        setQuoteAuthor("Unknown");
      }
    };

    fetchQuote();
  }, []);

  useEffect(() => {
    if (empUser) {
      // Use lastPaidDate if available, otherwise use employDate
      const baseDate = empUser.lastPaidDate || empUser.employDate;
      setNextPayDay(calculateNextPayDay(empUser.payCycle, baseDate));
    }
  }, [empUser]);

  if (loading)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (!empUser)
    return (
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <h2 className="text-zinc-900 font-bold text-3xl text-center">
          Employee Not Found
        </h2>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto m-4">
      {empUser && (
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">
          Welcome, {empUser.fullName}
        </h1>
      )}
      <h4 className="text-zinc-900 mb-3">
        Stay informed and manage your tasks effortlessly.
      </h4>
      <div
        className="line-horisontal mb-4 bg-black"
        style={{ height: "1px" }}
      ></div>

      <Container>
        <Row>
          <Col md={8}>
            <Row className="g-3">
              {/* Ratings */}
              <Col xs={12} md={5}>
                <div className="text-zinc-500 font-semibold text-center mb-2">
                  Your Ratings
                </div>
                <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow">
                  <div className="w-full py-4 flex flex-col gap-2 items-center">
                    <GaugeComponent
                      minValue={0}
                      maxValue={500}
                      value={
                        empUserRatingMetrics
                          ? empUserRatingMetrics.averageRating * 100
                          : 0
                      }
                      type="semicircle"
                      labels={{
                        valueLabel: {
                          formatTextValue: (value) =>
                            `${(Number(value) / 100).toFixed(2)}`,
                          style: { fontSize: "32px", fill: "#18181b" },
                        },
                        tickLabels: {
                          hideMinMax: false,
                          defaultTickValueConfig: {
                            formatTextValue: (value) =>
                              `${(Number(value) / 100).toFixed(1)}`,
                            style: { fontSize: "12px", fill: "#18181b" },
                          },
                        },
                      }}
                      arc={{
                        nbSubArcs: 5,
                        colorArray: [
                          "#d32f2f",
                          "#f57c00",
                          "#fbc02d",
                          "#388e3c",
                          "#1976d2",
                        ],
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
                          {empUserRatingMetrics.numberOfRatings !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              {/* Leave Balances */}
              <Col xs={12} md={7}>
                <div className="text-zinc-500 font-semibold text-center mb-2">
                  Your Remaining Leave
                </div>
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    {leaveBalances?.slice(0, 6).map((balance: any) => (
                      <LeaveBalanceBlock
                        key={balance.leaveBalanceId}
                        leaveType={balance.leaveTypeName}
                        remainingDays={balance.remainingDays}
                        totalDays={balance.defaultDays}
                        description={balance.description}
                        shadow
                      />
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
            {/* Payroll Information */}
            <Row className="g-3 pt-3">
              <Col xs={12} md={12}>
                <div className="text-zinc-500 font-semibold text-center mb-2">
                  Your Payroll Information
                </div>
                <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow">
                  <div className="w-full flex flex-col gap-2 items-center">
                    <div className="bg-warmstone-50 p-2 rounded-2xl w-full flex flex-col items-center">
                      <p className="text-zinc-500 text-sm mb-1">Salary</p>
                      <div className="flex flex-col items-center p-3 bg-warmstone-200 w-full rounded-2xl">
                        <p className="text-zinc-900 text-xl">
                          {formatRandAmount(empUser.salaryAmount)}
                        </p>
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
                          <p className="text-zinc-500 text-sm mb-1">
                            Last Paid
                          </p>
                          <div className="flex justify-center items-center gap-2 p-3 bg-warmstone-200 rounded-2xl h-full w-full">
                            <p className="text-zinc-900">
                              {empUser.lastPaidDate
                                ? dayjs(empUser.lastPaidDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col w-1/2 items-center">
                          <p className="text-zinc-500 text-sm mb-1">
                            Next Pay Day
                          </p>
                          <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                            <p className="text-zinc-900">
                              {nextPayDay
                                ? dayjs(nextPayDay).format("DD/MM/YYYY")
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col w-1/2 items-center">
                          <p className="text-transparent text-sm mb-1">..</p>
                          <div
                            className="flex justify-center items-center gap-2 p-4 hover:bg-corigreen-200 border-2 border-corigreen-500 rounded-2xl w-full cursor-pointer"
                            onClick={() =>
                              empUser && generatePayrollPDF(empUser)
                            }
                            style={{ minHeight: 48 }}
                          >
                            <Icons.Upload className="text-corigreen-600" />
                            <p className="text-corigreen-600 font-medium text-sm">
                              Export Payroll
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-3 pt-4 mb-4">
              <Col xs={12} md={12}>
                <div className="bg-corigreen-500 p-4 rounded-2xl shadow justify-center text-white text-center">
                  <p>"{quote}"</p>
                  <p className="italic"> - {quoteAuthor}</p>
                </div>
              </Col>
            </Row>
          </Col>

          <Col md={4}>
            <Col xs={12} md={12}>
              <div className="text-zinc-500 font-semibold text-center mb-2">
                Meetings Overview
              </div>
              <div className="relative">
                <div
                  className="grid gap-3 pr-2"
                  style={{
                    maxHeight: 700,
                    overflowY: "auto",
                    paddingBottom: 32, // space for fade
                  }}
                >
                  {gatherings.map((gathering) => (
                    <EmpGatheringBox
                      key={gathering.$id}
                      gathering={gathering}
                    />
                  ))}
                </div>
                {/* Fade overlay at the bottom */}
                <div
                  className="pointer-events-none w-full absolute left-0 right-0 bottom-0 h-7"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(231,229,228,0), #E7E5E4 100%)",
                  }}
                />
              </div>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmployeeHome;
