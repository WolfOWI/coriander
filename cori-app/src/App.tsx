import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en";
import Navigation from "./components/Navigation";
import "antd/dist/reset.css";
import { ServerStatusProvider } from "./contexts/ServerStatusContext";
import ServerStatusModal from "./components/modals/ServerStatusModal";
import { useServerStatus } from "./contexts/ServerStatusContext";
import "./styles/table.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Configure day.js
dayjs.locale("en");

// Import all pages
import Login from "./pages/auth/Login";
import EmployeeSignUp from "./pages/auth/EmployeeSignUp";
import AdminSignUp from "./pages/auth/AdminSignUp";
import EmployeeHome from "./pages/employee/EmployeeHome";
import EmployeeLeaveOverview from "./pages/employee/EmployeeLeaveOverview";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeMeetings from "./pages/employee/EmployeeMeetings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEmployeeManagement from "./pages/admin/AdminEmployeeManagement";
import AdminCreateEmployee from "./pages/admin/AdminCreateEmployee";
import AdminIndividualEmployee from "./pages/admin/AdminIndividualEmployee";
import AdminEquipmentManagement from "./pages/admin/AdminEquipmentManagement";
import AdminLeaveRequests from "./pages/admin/AdminLeaveRequests";
import AdminMeetings from "./pages/admin/AdminMeetings";

// TODO: Delete these later
import ReferencePage from "./pages/Reference";
import TempModalsLeaveOverviewPage from "./pages/TempModalsLeaveOverviewPage";
import TempModalsAdminDashPage from "./pages/TempModalsAdminDashPage";
import ApiPlayground from "./pages/apiPlayground/ApiPlayground";
import TempNewGatheringBoxPage from "./pages/TempNewGatheringBoxPage";

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isServerSleeping, checkServerStatus } = useServerStatus();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/employee/signup" ||
    location.pathname === "/admin/signup";

  return (
    <div className="flex h-screen mr-4">
      {!isAuthPage && <Navigation />}
      <main className="flex-grow-1">
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/employee/signup" element={<EmployeeSignUp />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />

          {/* Employee Routes */}
          <Route path="/employee/home" element={<EmployeeHome />} />
          <Route path="/employee/leave-overview" element={<EmployeeLeaveOverview />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/meetings" element={<EmployeeMeetings />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<AdminEmployeeManagement />} />
          <Route path="/admin/equipment" element={<AdminEquipmentManagement />} />
          <Route path="/admin/create-employee" element={<AdminCreateEmployee />} />
          <Route
            path="/admin/individual-employee/:employeeId?"
            element={<AdminIndividualEmployee />}
          />
          <Route path="/admin/leave-requests" element={<AdminLeaveRequests />} />
          <Route path="/admin/meetings" element={<AdminMeetings />} />

          {/* Temporary Reference Route */}
          {/* TODO: Delete this later */}
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/temp-modals/leave-overview" element={<TempModalsLeaveOverviewPage />} />
          <Route path="/temp-modals/admin-dash" element={<TempModalsAdminDashPage />} />
          <Route path="/apiplayground" element={<ApiPlayground />} />
          <Route path="/temp-new-gathering-box" element={<TempNewGatheringBoxPage />} />
        </Routes>
      </main>
      <ServerStatusModal isVisible={isServerSleeping} onClose={() => checkServerStatus()} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          // Primary Colors
          colorPrimary: "#88A764",
          colorPrimaryHover: "#6D8650",
          colorPrimaryActive: "#52643C",
          colorPrimaryText: "#1B2114",
          colorPrimaryTextHover: "#1B2114",
          colorPrimaryTextActive: "#1B2114",

          // Text Colors
          colorText: "#18181b", // zinc-900
          colorTextSecondary: "#71717a", // zinc-500
          colorTextTertiary: "#a1a1aa", // zinc-400

          // Background Colors
          colorBgContainer: "#fafaf9", // warmstone-50
          colorBgElevated: "#f5f5f4", // warmstone-100
          colorBgLayout: "#e7e5e4", // warmstone-200

          // Border Colors
          colorBorder: "#d4d4d8", // zinc-300
          colorBorderSecondary: "#e4e4e7", // zinc-200

          // Component Specific
          borderRadius: 16, // rounded-2xl
          borderRadiusLG: 24,
          borderRadiusSM: 8,
          borderRadiusXS: 4,

          // Font
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          fontWeightStrong: 600,

          // Control
          controlHeight: 40,
          controlHeightLG: 48,
          controlHeightSM: 32,
          controlPaddingHorizontal: 16,
          controlPaddingHorizontalSM: 12,

          // Layout
          margin: 16,
          marginLG: 24,
          marginSM: 12,
          marginXS: 8,
          marginXXS: 4,
          padding: 16,
          paddingLG: 24,
          paddingSM: 12,
          paddingXS: 8,
          paddingXXS: 4,
        },
        // Components
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingInline: 16,
            paddingBlock: 8,
            lineHeight: 1.5,
          },
          DatePicker: {
            borderRadius: 8,
            controlHeight: 40,
            paddingBlock: 8,
            paddingInline: 12,
            lineHeight: 1.5,
          },
          Modal: {
            borderRadiusLG: 32,
            paddingContentHorizontal: 32,
            paddingContentVertical: 24,
            titleFontSize: 24,
            lineHeight: 1.5,
          },
          Card: {
            borderRadius: 16,
            padding: 24,
            lineHeight: 1.5,
          },
          Typography: {
            margin: 0,
            padding: 0,
          },
          Form: {
            labelFontSize: 12,
            labelColor: "#71717a", // zinc-500
            verticalLabelPadding: 2,
            fontSize: 12,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 48,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 48,
            borderRadiusLG: 8,
          },
          Dropdown: {
            borderRadiusLG: 16,
          },
          Table: {
            colorBgSolidHover: "#e7e5e4",
            borderRadiusLG: 16,
            headerBg: "#e7e5e4",
            headerBorderRadius: 16,
            headerSplitColor: "transparent",
            headerColor: "#71717a",
            headerFilterHoverBg: "transparent",
            headerSortActiveBg: "transparent",
            headerSortHoverBg: "transparent",
          },
        },
      }}
    >
      <ServerStatusProvider>
        <Router>
          <AppContent />
        </Router>
      </ServerStatusProvider>
    </ConfigProvider>
  );
};

export default App;
