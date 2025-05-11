import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import GaugeComponent from "react-gauge-component";
import LeaveBalanceBlock from "../../components/leave/LeaveBalanceBlock";
import { empUserAPI } from "../../services/api.service";
import { EmpUser } from "../../interfaces/people/empUser";
import { formatRandAmount } from "../../utils/formatUtils";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import TimeTodayBadge from "../../components/badges/TimeTodayBadge";
import { Icons } from "../../constants/icons";
import CoriBtn from "../../components/buttons/CoriBtn";
import { getFullCurrentUser, CurrentUserDTO } from "../../services/authService";

const EmployeeHome: React.FC = () => {
  const [empUser, setEmpUser] = useState<EmpUser>();
  const [currentUser, setCurrentUser] = useState<CurrentUserDTO | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getFullCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!currentUser?.employeeId) return;

      try {
        const response = await empUserAPI.getEmpUserById(
          currentUser.employeeId.toString()
        );
        setEmpUser(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [currentUser]);

  useEffect(() => {
    console.log("Employee Data:", empUser);
  }, [empUser]);

  useEffect(() => {
    console.log("Employee Data:", empUser);
  }, [empUser]);

  //Dummy data for leave balances
  const FakeLeaveData = {
    $id: "1",
    $values: [
      {
        $id: "2",
        leaveBalanceId: 46,
        remainingDays: 5,
        leaveTypeName: "Family Responsibility",
        description:
          "Leave granted to employees needing to attend urgent family-related matters or responsibilities.",
        defaultDays: 5,
      },
      {
        $id: "3",
        leaveBalanceId: 47,
        remainingDays: 8,
        leaveTypeName: "Study",
        description:
          "Leave provided to employees undertaking formal educational or professional development activities related to their role.",
        defaultDays: 8,
      },
      {
        $id: "4",
        leaveBalanceId: 43,
        remainingDays: 1,
        leaveTypeName: "Annual",
        description:
          "Paid leave provided annually to employees for rest and personal activities, typically scheduled in agreement with management.",
        defaultDays: 15,
      },
      {
        $id: "5",
        leaveBalanceId: 44,
        remainingDays: 5,
        leaveTypeName: "Sick",
        description:
          "Leave taken when an employee is unable to perform work duties due to illness, injury, or medical treatment.",
        defaultDays: 10,
      },
      {
        $id: "6",
        leaveBalanceId: 45,
        remainingDays: 43,
        leaveTypeName: "Parental",
        description:
          "Leave provided to employees following the birth or adoption of a child, allowing time for caregiving and bonding.",
        defaultDays: 60,
      },
      {
        $id: "7",
        leaveBalanceId: 48,
        remainingDays: 1,
        leaveTypeName: "Compassionate",
        description:
          "Leave granted due to the death, serious illness, or emergency situation involving immediate family members or close relationships.",
        defaultDays: 3,
      },
    ],
  };

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
                  <div className="w-full flex flex-col gap-2 items-center">
                    <GaugeComponent
                      minValue={0}
                      maxValue={500}
                      value={430} // Example value, replace with actual data here
                      type="radial"
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
                    {/* {empUserRatingMetrics && (
                            <div className="text-center mt-2">
                              <p className="text-zinc-500 text-sm">
                                Based on {empUserRatingMetrics.numberOfRatings} rating
                                {empUserRatingMetrics.numberOfRatings !== 1 ? "s" : ""}
                              </p>
                            </div>
                          )} */}
                  </div>
                </div>
              </Col>

              {/* Leave Balances */}
              <Col xs={12} md={7}>
                <div className="text-zinc-500 font-semibold text-center mb-2">
                  Your Remaining Leave
                </div>
                <div className="bg-red flex flex-col items-center">
                  <div className="flex flex-wrap gap-3">
                    {FakeLeaveData.$values.map((balance) => (
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
                <div className="text-zinc-500 font-semibold text-center mb-2">
                  Payroll Information
                </div>
                <div className="bg-warmstone-50 p-4 pt-2 rounded-2xl shadow">
                  <div className="w-full flex flex-col gap-2 items-center">
                    <div className="bg-warmstone-50 p-2 rounded-2xl w-full flex flex-col items-center">
                      <p className="text-zinc-500 text-sm mb-1">Salary</p>
                      <div className="flex flex-col items-center p-3 bg-warmstone-200 w-full rounded-2xl">
                        <p className="text-zinc-900 text-xl">
                          {formatRandAmount(100)}
                        </p>
                        <p className="text-zinc-500 text-sm">
                          {" "}
                          monthly
                          {/* {empUser.payCycle === PayCycle.Monthly
                              ? "monthly"
                              : empUser.payCycle === PayCycle.BiWeekly
                              ? "bi-weekly"
                              : "weekly"} */}
                        </p>
                      </div>
                      <div className="flex w-full mt-2 gap-2 h-fit">
                        <div className="flex flex-col w-1/2 items-center">
                          <p className="text-zinc-500 text-sm mb-1">
                            Last Paid
                          </p>
                          <div className="flex justify-center items-center gap-2 p-3 bg-warmstone-200 rounded-2xl h-full">
                            <DatePicker
                              // value={dayjs(empUser.lastPaidDate)}
                              format="DD MMM YYYY"
                              suffixIcon={
                                <CoriCircleBtn
                                  style="black"
                                  icon={<Icons.Edit />}
                                />
                              }
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
                          <p className="text-zinc-500 text-sm mb-1">
                            Next Pay Day
                          </p>
                          <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                            <p className="text-zinc-900">
                              Date here: 00/00/0000
                            </p>
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
                          <div className="flex justify-center items-center gap-2 p-4 bg-white hover:bg-corigreen-500 border-2 border-corigreen-500 rounded-2xl w-full">
                            <div className="flex items-center">
                              <Icons.Upload className="text-corigreen-500" />
                              <p className="text-corigreen-500 text-sm">
                                Export Payroll
                              </p>
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
                      <div className="flex justify-between w-full mt-4">
                        <CoriBtn secondary style="black">
                          <Icons.Undo />
                          Undo Payment
                        </CoriBtn>
                        <CoriBtn secondary style="black">
                          Pay Now
                          <Icons.Pay />
                        </CoriBtn>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-3 pt-4 mb-4">
              <Col xs={12} md={12}>
                <div className="bg-corigreen-500 p-4 rounded-2xl shadow justify-center flex items-center text-white text-center">
                  Quote of the day
                </div>
              </Col>
            </Row>
          </Col>

          <Col md={4}>
            <Col xs={12} md={12}>
              <div className="text-zinc-500 font-semibold text-center mb-2">
                Performance Reviews
              </div>
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
