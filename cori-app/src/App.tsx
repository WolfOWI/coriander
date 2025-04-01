import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

// Import all pages
import Login from "./pages/auth/Login";
import EmployeeSignUp from "./pages/auth/EmployeeSignUp";
import AdminSignUp from "./pages/auth/AdminSignUp";
import EmployeeHome from "./pages/employee/EmployeeHome";
import EmployeeLeaveOverview from "./pages/employee/EmployeeLeaveOverview";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEmployeeManagement from "./pages/admin/AdminEmployeeManagement";
import AdminCreateEmployee from "./pages/admin/AdminCreateEmployee";
import AdminIndividualEmployee from "./pages/admin/AdminIndividualEmployee";
import AdminLeaveRequests from "./pages/admin/AdminLeaveRequests";
import ReferencePage from "./pages/Reference";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex m-4 min-h-[calc(98vh-32px)]">
        <Navigation />
        <main className="flex-grow-1 my-4">
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/employee/signup" element={<EmployeeSignUp />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />

            {/* Employee Routes */}
            <Route path="/employee/home" element={<EmployeeHome />} />
            <Route path="/employee/leave-overview" element={<EmployeeLeaveOverview />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<AdminEmployeeManagement />} />
            <Route path="/admin/create-employee" element={<AdminCreateEmployee />} />
            <Route path="/admin/individual-employee" element={<AdminIndividualEmployee />} />
            <Route path="/admin/leave-requests" element={<AdminLeaveRequests />} />

            {/* Temporary Reference Route */}
            {/* TODO: Delete this later */}
            <Route path="/reference" element={<ReferencePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
